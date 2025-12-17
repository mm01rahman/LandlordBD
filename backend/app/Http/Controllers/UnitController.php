<?php

namespace App\Http\Controllers;

use App\Models\Building;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UnitController extends Controller
{
    public function index(Request $request, Building $building)
    {
        $this->authorizeBuilding($request, $building);
        $perPage = $request->integer('per_page', 15);
        $units = $building->units()->paginate($perPage);
        return response()->json([
            'data' => $units->items(),
            'meta' => [
                'current_page' => $units->currentPage(),
                'last_page' => $units->lastPage(),
                'per_page' => $units->perPage(),
                'total' => $units->total(),
            ],
        ]);
    }

    public function store(Request $request, Building $building)
    {
        $this->authorizeBuilding($request, $building);
        $data = $request->validate([
            'unit_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('units', 'unit_number')->where('building_id', $building->id),
            ],
            'floor' => 'nullable|integer',
            'type' => 'nullable|string',
            'rent_amount' => 'required|numeric|min:0',
            'status' => 'nullable|in:vacant,occupied',
        ]);
        $data['building_id'] = $building->id;

        $unit = Unit::create($data);
        return response()->json($unit, 201);
    }

    public function update(Request $request, Unit $unit)
    {
        $this->authorizeBuilding($request, $unit->building);
        $unit->update($request->validate([
            'unit_number' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('units', 'unit_number')
                    ->where('building_id', $unit->building_id)
                    ->ignore($unit->id),
            ],
            'floor' => 'nullable|integer',
            'type' => 'nullable|string',
            'rent_amount' => 'sometimes|required|numeric|min:0',
            'status' => 'nullable|in:vacant,occupied',
        ]));

        return response()->json($unit->fresh());
    }

    public function destroy(Request $request, Unit $unit)
    {
        $this->authorizeBuilding($request, $unit->building);
        if ($unit->agreements()->exists() || $unit->payments()->exists()) {
            return response()->json([
                'message' => 'Unit cannot be deleted while agreements or payments exist.',
            ], 422);
        }
        $unit->delete();
        return response()->json(['message' => 'Unit deleted']);
    }

    protected function authorizeBuilding(Request $request, Building $building)
    {
        abort_unless($building->user_id === $request->user()->id, 403);
    }
}
