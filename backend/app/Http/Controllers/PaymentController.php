<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\RentalAgreement;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'tenant_id' => 'sometimes|integer',
            'building_id' => 'sometimes|integer',
            'unit_id' => 'sometimes|integer',
            'month' => 'sometimes|date_format:Y-m',
            'status' => 'sometimes|string',
            'per_page' => 'sometimes|integer|min:1|max:100',
        ]);

        $query = Payment::with(['tenant', 'unit.building', 'agreement'])
            ->where('user_id', $request->user()->id);

        if (!empty($validated['tenant_id'])) {
            $query->where('tenant_id', $validated['tenant_id']);
        }
        if (!empty($validated['building_id'])) {
            $query->whereHas('unit.building', function ($q) use ($request) {
                $q->where('id', $request->building_id);
            });
        }
        if (!empty($validated['unit_id'])) {
            $query->where('unit_id', $validated['unit_id']);
        }
        if (!empty($validated['month'])) {
            $month = Carbon::createFromFormat('Y-m', $validated['month'])->startOfMonth();
            $query->whereMonth('billing_month', $month->month)
                ->whereYear('billing_month', $month->year);
        }
        if (!empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        $payments = $query->orderByDesc('billing_month')->paginate($validated['per_page'] ?? 15);

        return response()->json([
            'data' => $payments->items(),
            'meta' => [
                'current_page' => $payments->currentPage(),
                'last_page' => $payments->lastPage(),
                'per_page' => $payments->perPage(),
                'total' => $payments->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'agreement_id' => 'required|exists:rental_agreements,id',
            'billing_month' => 'required|date_format:Y-m',
            'amount_due' => 'required|numeric|min:0',
            'amount_paid' => 'required|numeric|min:0',
            'payment_date' => 'nullable|date',
            'payment_method' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $agreement = RentalAgreement::with('tenant', 'unit')->findOrFail($data['agreement_id']);
        abort_unless($agreement->user_id === $request->user()->id, 403);

        $billingMonth = Carbon::createFromFormat('Y-m', $data['billing_month'])->startOfMonth();

        $duplicateExists = Payment::where('agreement_id', $agreement->id)
            ->whereDate('billing_month', $billingMonth)
            ->exists();
        if ($duplicateExists) {
            return response()->json([
                'message' => 'Payment for this agreement and billing month already exists.',
            ], 422);
        }

        $payload = array_merge($data, [
            'user_id' => $request->user()->id,
            'tenant_id' => $agreement->tenant_id,
            'unit_id' => $agreement->unit_id,
        ]);
        $payload['billing_month'] = $billingMonth;
        $payload['status'] = $this->calculateStatus($payload['amount_due'], $payload['amount_paid']);

        $payment = Payment::create($payload);
        return response()->json($payment->load(['tenant', 'unit.building', 'agreement']), 201);
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::where('user_id', $request->user()->id)->findOrFail($id);
        $data = $request->validate([
            'billing_month' => 'sometimes|date_format:Y-m',
            'amount_due' => 'sometimes|numeric|min:0',
            'amount_paid' => 'sometimes|numeric|min:0',
            'payment_date' => 'nullable|date',
            'payment_method' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        if (!empty($data['billing_month'])) {
            $billingMonth = Carbon::createFromFormat('Y-m', $data['billing_month'])->startOfMonth();
            $duplicateExists = Payment::where('agreement_id', $payment->agreement_id)
                ->whereDate('billing_month', $billingMonth)
                ->where('id', '!=', $payment->id)
                ->exists();
            if ($duplicateExists) {
                return response()->json([
                    'message' => 'Payment for this agreement and billing month already exists.',
                ], 422);
            }
            $data['billing_month'] = $billingMonth;
        }

        $payment->update($data);

        $payment->status = $this->calculateStatus($payment->amount_due, $payment->amount_paid);
        $payment->save();

        return response()->json($payment->fresh()->load(['tenant', 'unit.building', 'agreement']));
    }

    public function outstanding(Request $request)
    {
        $validated = $request->validate([
            'building_id' => 'sometimes|integer',
            'tenant_id' => 'sometimes|integer',
            'month' => 'sometimes|date_format:Y-m',
            'per_page' => 'sometimes|integer|min:1|max:100',
        ]);

        $query = Payment::with(['tenant', 'unit.building'])
            ->where('user_id', $request->user()->id)
            ->whereIn('status', ['unpaid', 'partial']);

        if (!empty($validated['building_id'])) {
            $query->whereHas('unit.building', function ($q) use ($request) {
                $q->where('id', $request->building_id);
            });
        }
        if (!empty($validated['tenant_id'])) {
            $query->where('tenant_id', $validated['tenant_id']);
        }
        if (!empty($validated['month'])) {
            $month = Carbon::createFromFormat('Y-m', $validated['month'])->startOfMonth();
            $query->whereMonth('billing_month', $month->month)
                ->whereYear('billing_month', $month->year);
        }

        $payments = $query->paginate($validated['per_page'] ?? 15);

        return response()->json([
            'data' => $payments->items(),
            'meta' => [
                'current_page' => $payments->currentPage(),
                'last_page' => $payments->lastPage(),
                'per_page' => $payments->perPage(),
                'total' => $payments->total(),
            ],
        ]);
    }

    protected function calculateStatus($amountDue, $amountPaid): string
    {
        if ($amountDue <= 0 && $amountPaid <= 0) {
            return 'zero-due';
        }
        if ($amountPaid <= 0) {
            return 'unpaid';
        }
        if ($amountPaid < $amountDue) {
            return 'partial';
        }
        if ($amountPaid == $amountDue) {
            return 'paid';
        }
        return 'overpaid';
    }
}
