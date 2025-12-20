<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\RentalAgreement;
use App\Models\Unit;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function summary(Request $request)
    {
        $userId = $request->user()->id;

        $period = $request->query('period', '30d');
        [$startDate, $endDate] = $this->resolvePeriodRange($period);

        $driver = DB::connection()->getDriverName(); // pgsql | mysql ...
        $monthExpr = $this->monthExpr($driver, 'payments.billing_month');

        $totalCollected = Payment::where('user_id', $userId)
            ->whereBetween('billing_month', [$startDate, $endDate])
            ->sum('amount_paid');

        $totalOutstanding = Payment::where('user_id', $userId)
            ->whereBetween('billing_month', [$startDate, $endDate])
            ->whereIn('status', ['unpaid', 'partial'])
            ->selectRaw('COALESCE(SUM(amount_due - amount_paid), 0) as total')
            ->value('total');

        $totalUnits = Unit::whereHas('building', fn ($q) => $q->where('user_id', $userId))->count();

        $totalOccupied = Unit::whereHas('building', fn ($q) => $q->where('user_id', $userId))
            ->where('status', 'occupied')
            ->count();

        $totalVacant = Unit::whereHas('building', fn ($q) => $q->where('user_id', $userId))
            ->where('status', 'vacant')
            ->count();

        $rawTrend = Payment::query()
            ->selectRaw("
                {$monthExpr} as month,
                tenants.name as tenant_name,
                buildings.name as building_name,
                COALESCE(SUM(payments.amount_paid), 0) as total
            ")
            ->join('tenants', 'tenants.id', '=', 'payments.tenant_id')
            ->join('units', 'units.id', '=', 'payments.unit_id')
            ->join('buildings', 'buildings.id', '=', 'units.building_id')
            ->where('payments.user_id', $userId)
            ->whereBetween('payments.billing_month', [$startDate, $endDate])
            ->groupBy('month', 'tenant_name', 'building_name')
            ->orderBy('month')
            ->get();

        $trend = $rawTrend
            ->groupBy('month')
            ->map(function ($rows, $month) {
                $sorted = $rows->sortByDesc('total')->values();

                return [
                    'month' => (string) $month,
                    'month_total' => (float) $rows->sum('total'),
                    'items' => $sorted->take(3)->map(function ($r) {
                        return [
                            'tenant_name' => $r->tenant_name,
                            'building_name' => $r->building_name,
                            'total' => (float) $r->total,
                        ];
                    })->values(),
                ];
            })
            ->values();

        $today = Carbon::today();
        $renewalEnd = $today->copy()->addDays(30);

        $upcomingRenewals = RentalAgreement::query()
            ->with(['tenant:id,name', 'unit:id,unit_number,building_id', 'unit.building:id,name'])
            ->where('user_id', $userId)
            ->where('status', 'active')
            ->whereNotNull('end_date')
            ->whereBetween('end_date', [$today->startOfDay(), $renewalEnd->endOfDay()])
            ->orderBy('end_date')
            ->limit(10)
            ->get()
            ->map(function ($a) use ($today) {
                $end = $a->end_date ? Carbon::parse($a->end_date) : null;

                return [
                    'id' => $a->id,
                    'tenant_name' => $a->tenant?->name,
                    'building_name' => $a->unit?->building?->name,
                    'unit_code' => $a->unit?->unit_number,
                    'end_date' => $end?->toDateString(),
                    'days_remaining' => $end ? $today->diffInDays($end, false) : null,
                ];
            })
            ->values();

        return response()->json([
            'period' => $period,
            'range' => [
                'start' => $startDate->toDateTimeString(),
                'end' => $endDate->toDateTimeString(),
            ],
            'total_rent_collected' => (float) $totalCollected,
            'total_outstanding' => (float) $totalOutstanding,
            'total_units' => (int) $totalUnits,
            'total_occupied_units' => (int) $totalOccupied,
            'total_vacant_units' => (int) $totalVacant,
            'rent_collection_trend' => $trend,
            'upcoming_renewals' => $upcomingRenewals,
        ]);
    }

    private function resolvePeriodRange(string $period): array
    {
        $now = Carbon::now();

        if ($period === '7d') return [$now->copy()->subDays(6)->startOfDay(), $now->copy()->endOfDay()];
        if ($period === '30d') return [$now->copy()->subDays(29)->startOfDay(), $now->copy()->endOfDay()];
        if ($period === '90d') return [$now->copy()->subDays(89)->startOfDay(), $now->copy()->endOfDay()];
        if ($period === 'YTD') return [$now->copy()->startOfYear(), $now->copy()->endOfDay()];

        if ($period === '7d_prev') {
            $end = $now->copy()->subDays(7)->endOfDay();
            return [$end->copy()->subDays(6)->startOfDay(), $end];
        }

        if ($period === '30d_prev') {
            $end = $now->copy()->subDays(30)->endOfDay();
            return [$end->copy()->subDays(29)->startOfDay(), $end];
        }

        if ($period === '90d_prev') {
            $end = $now->copy()->subDays(90)->endOfDay();
            return [$end->copy()->subDays(89)->startOfDay(), $end];
        }

        if ($period === 'YTD_prev') {
            $end = $now->copy()->subYear()->endOfDay();
            return [$end->copy()->startOfYear(), $end];
        }

        return [$now->copy()->subDays(29)->startOfDay(), $now->copy()->endOfDay()];
    }

    private function monthExpr(string $driver, string $column): string
    {
        return match ($driver) {
            'pgsql' => "to_char($column, 'YYYY-MM')",
            'mysql' => "DATE_FORMAT($column, '%Y-%m')",
            default => "strftime('%Y-%m', $column)",
        };
    }
}
