<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $tasks = Task::all();
            return response()->json($tasks, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve tasks: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'string',
            ]);

            /* $task = Task::create($request->all()); */
            $tasks =  $request->user()->tasks()->create(
                [
                    'title' => $request->title,
                    'description' => $request->description,
                ]
            );

            //$request->user()->tasks;

            return response()->json($tasks, 201);

            //return response()->json($task, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create task: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $task = Task::findOrFail($id);

        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }

        return response()->json($task, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }

        $validatedData = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'completed' => 'boolean',
        ]);

        $task->update($validatedData);
        return response()->json($task, 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $task = Task::findOrFail($id);

        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }

        $task->delete();
        return response()->json(['message' => 'Task deleted successfully'], 200);
    }
}
