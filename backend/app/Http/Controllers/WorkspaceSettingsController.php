<?php

namespace App\Http\Controllers;

use App\Models\WorkspaceSetting;
use Illuminate\Http\Request;

class WorkspaceSettingsController extends Controller
{
    public function show(Request $request)
    {
        $userId = $request->user()->id;

        $settings = WorkspaceSetting::firstOrCreate(
            ['user_id' => $userId],
            [
                'name' => 'LandlordBD',
                'language' => 'English',
                'timezone' => 'Asia/Dhaka',
                'currency' => 'BDT',
            ]
        );

        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'language' => 'required|string|max:50',
            'timezone' => 'required|string|max:80',
            'currency' => 'required|string|max:10',
        ]);

        $userId = $request->user()->id;

        $settings = WorkspaceSetting::updateOrCreate(
            ['user_id' => $userId],
            $data
        );

        return response()->json($settings);
    }
}
