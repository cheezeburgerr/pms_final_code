<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class EmployeesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $employees = User::where('user_type', 'Employee')->with('department')->get();
        // dd($employees);
        $departments = Department::all();
        // dd($employees);
        return Inertia::render('Admin/Employees/Employees', ['employees' => $employees, 'departments' => $departments]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //

        // dd($request->all());
        // $request->validate([

        //     'name' => 'required|string|max:255',
        //     'dept_id' => 'required|int',
        //     'email' => 'required|string|lowercase|email|max:255',

        // ]);

        $lastEmployee = User::where('user_type', 'Employee')->latest()->first();
        $lastId = $lastEmployee ? substr($lastEmployee->user_id, 4) : 0;
        $nextId = $lastId + 1;
        $customId = 'TJM_' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

        $emp = User::create([
            'user_id' => $customId,
            'name' => $request->name,
            'email' => $request->email,
            'contact_number' => $request->contact_number,
            'address' => $request->address,
            'dept_id' => $request->department_id,
            'password' => Hash::make('password'),
            'is_supervisor' => '0',
            'user_type' => 'Employee'
        ]);


        return redirect()->route('employees.index')->with('success', 'Employee Successfully Added');

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
