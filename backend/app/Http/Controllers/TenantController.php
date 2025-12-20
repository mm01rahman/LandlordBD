<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\Request;

class TenantController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->integer('per_page', 15);
        $tenants = Tenant::where('user_id', $request->user()->id)
            ->withCount(['agreements' => function ($query) {
                $query->where('status', 'active');
            }])->paginate($perPage);
        return response()->json([
            'data' => $tenants->items(),
            'meta' => [
                'current_page' => $tenants->currentPage(),
                'last_page' => $tenants->lastPage(),
                'per_page' => $tenants->perPage(),
                'total' => $tenants->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string',
            'whatsapp' => 'nullable|string',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
        ]);
        $data['user_id'] = $request->user()->id;
        $tenant = Tenant::create($data);
        return response()->json($tenant, 201);
    }

    public function show(Request $request, $id)
    {
        $tenant = Tenant::where('user_id', $request->user()->id)
            ->with(['agreements.unit.building'])
            ->findOrFail($id);

        $payments = $tenant->payments()
            ->orderByDesc('billing_month')
            ->paginate($request->integer('payments_per_page', 10));
        $tenant->setAttribute('payment_summary', $this->summarizePayments($tenant));
        $tenant->setAttribute('payments', $payments);

        return response()->json($tenant);
    }

    public function update(Request $request, $id)
    {
        $tenant = Tenant::where('user_id', $request->user()->id)->findOrFail($id);
        $tenant->update($request->validate([
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|required|string',
            'whatsapp' => 'nullable|string',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
        ]));
        return response()->json($tenant->fresh());
    }

    public function destroy(Request $request, $id)
    {
        $tenant = Tenant::where('user_id', $request->user()->id)->findOrFail($id);
        $tenant->delete();
        return response()->json(['message' => 'Tenant deleted']);
    }

    protected function summarizePayments(Tenant $tenant): array
    {
        $paidPayments = $tenant->payments()
            ->whereIn('status', ['paid', 'overpaid'])
            ->get();

        $totalDue = $paidPayments->sum('amount_due');
        $totalPaid = $paidPayments->sum('amount_paid');
        $latestPayment = $paidPayments->sortByDesc(function ($payment) {
            return $payment->payment_date ?? $payment->billing_month;
        })->first();

        return [
            'total_due' => $totalDue,
            'total_paid' => $totalPaid,
            'outstanding' => max(0, $totalDue - $totalPaid),
            'last_payment_date' => $latestPayment
                ? ($latestPayment->payment_date
                    ? \Illuminate\Support\Carbon::parse($latestPayment->payment_date)->toDateString()
                    : ($latestPayment->billing_month ? (string) $latestPayment->billing_month : null)
                )
            : null,
        ];
    }
}
