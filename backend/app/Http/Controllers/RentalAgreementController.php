<?php

namespace App\Http\Controllers;

use App\Models\RentalAgreement;
use App\Models\Tenant;
use App\Models\Unit;
use Carbon\Carbon;
use Illuminate\Http\Request;

class RentalAgreementController extends Controller
{
    public function index(Request $request)
    {
        $query = RentalAgreement::with(['tenant', 'unit.building'])
            ->where('user_id', $request->user()->id);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('tenant_id')) {
            $query->where('tenant_id', $request->tenant_id);
        }
        if ($request->filled('unit_id')) {
            $query->where('unit_id', $request->unit_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'tenant_id' => 'required|exists:tenants,id',
            'unit_id' => 'required|exists:units,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'monthly_rent' => 'required|numeric',
            'security_deposit' => 'nullable|numeric',
            'notes' => 'nullable|string'
        ]);

        $unit = Unit::findOrFail($data['unit_id']);
        abort_unless($unit->building->user_id === $request->user()->id, 403);

        $tenant = Tenant::findOrFail($data['tenant_id']);
        abort_unless($tenant->user_id === $request->user()->id, 403);

        $overlap = RentalAgreement::where('unit_id', $unit->id)
            ->where('status', 'active')
            ->exists();
        abort_if($overlap, 422, 'Unit already has an active agreement');

        $data['user_id'] = $request->user()->id;
        $data['security_deposit'] = $data['security_deposit'] ?? 0;
        $data['status'] = Carbon::parse($data['start_date'])->isFuture() ? 'upcoming' : 'active';

        $agreement = RentalAgreement::create($data);
        $unit->update(['status' => 'occupied']);

        return response()->json($agreement->load(['tenant', 'unit.building']), 201);
    }

    public function show(Request $request, $id)
    {
        $agreement = RentalAgreement::where('user_id', $request->user()->id)
            ->with(['tenant', 'unit.building', 'payments'])
            ->findOrFail($id);
        return response()->json($agreement);
    }

    public function update(Request $request, $id)
    {
        $agreement = RentalAgreement::where('user_id', $request->user()->id)
            ->with('unit.building', 'tenant')
            ->findOrFail($id);

        $data = $request->validate([
            'tenant_id' => 'sometimes|exists:tenants,id',
            'unit_id' => 'sometimes|exists:units,id',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'monthly_rent' => 'sometimes|numeric',
            'security_deposit' => 'nullable|numeric',
            'status' => 'nullable|in:active,ended,upcoming',
            'notes' => 'nullable|string'
        ]);

        if (isset($data['tenant_id'])) {
            abort_unless(
                Tenant::where('user_id', $request->user()->id)->where('id', $data['tenant_id'])->exists(),
                403
            );
        }

        $targetUnitId = $data['unit_id'] ?? $agreement->unit_id;
        $intendedStatus = $data['status'] ?? $agreement->status;
        $targetUnit = Unit::with('building')->findOrFail($targetUnitId);
        abort_unless($targetUnit->building->user_id === $request->user()->id, 403);

        if ($intendedStatus === 'active') {
            $hasActive = RentalAgreement::where('unit_id', $targetUnitId)
                ->where('id', '!=', $agreement->id)
                ->where('status', 'active')
                ->exists();
            abort_if($hasActive, 422, 'Unit already has an active agreement');
        }

        $agreement->update($data);

        if ($agreement->status === 'active') {
            $agreement->unit()->update(['status' => 'occupied']);
        }

        if ($agreement->status === 'ended') {
            if (!$agreement->end_date_actual) {
                $agreement->end_date_actual = now();
                $agreement->save();
            }
            $agreement->unit()->update(['status' => 'vacant']);
        }

        if ($agreement->status === 'upcoming' && $agreement->start_date && $agreement->start_date->isPast()) {
            $agreement->status = 'active';
            $agreement->save();
            $agreement->unit()->update(['status' => 'occupied']);
        }

        return response()->json($agreement->fresh(['tenant', 'unit.building', 'payments']));
    }

    public function end(Request $request, $id)
    {
        $agreement = RentalAgreement::where('user_id', $request->user()->id)->findOrFail($id);
        $agreement->status = 'ended';
        $agreement->end_date_actual = now();
        $agreement->save();
        $agreement->unit()->update(['status' => 'vacant']);

        return response()->json(['message' => 'Agreement ended', 'agreement' => $agreement->fresh()]);
    }
}
