<?php

namespace App\Http\Controllers;

use App\Models\Building;
use Illuminate\Http\Request;

class BuildingController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->integer('per_page', 15);
        $buildings = Building::withCount('units')
            ->where('user_id', $request->user()->id)
            ->paginate($perPage);
        return response()->json([
            'data' => $buildings->items(),
            'meta' => [
                'current_page' => $buildings->currentPage(),
                'last_page' => $buildings->lastPage(),
                'per_page' => $buildings->perPage(),
                'total' => $buildings->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'zip_code' => 'nullable|string',
            'total_floors' => 'nullable|integer',
        ]);
        $data['user_id'] = $request->user()->id;

        $building = Building::create($data);
        return response()->json($building, 201);
    }

    public function show(Request $request, $id)
    {
        $building = Building::where('user_id', $request->user()->id)
            ->with('units')
            ->findOrFail($id);
        return response()->json($building);
    }

    public function update(Request $request, $id)
    {
        $building = Building::where('user_id', $request->user()->id)->findOrFail($id);
        $building->update($request->validate([
            'name' => 'sometimes|required|string|max:255',
            'address' => 'sometimes|required|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'zip_code' => 'nullable|string',
            'total_floors' => 'nullable|integer',
        ]));

        return response()->json($building->fresh());
    }

    public function destroy(Request $request, $id)
    {
        $building = Building::where('user_id', $request->user()->id)->findOrFail($id);
        if ($building->units()->exists()) {
            return response()->json(['message' => 'Building cannot be deleted while units exist.'], 422);
        }
        $building->delete();
        return response()->json(['message' => 'Building deleted']);
    }
}
