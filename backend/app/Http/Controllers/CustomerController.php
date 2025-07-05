<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CustomerService;

class CustomerController extends Controller
{
    protected $customerService;

    public function __construct(CustomerService $customerService)
    {
        $this->customerService = $customerService;
    }

    public function index()
    {
        return response()->json($this->customerService->getAll());
    }

    public function show($id)
    {
        return response()->json($this->customerService->getById($id));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name' => 'required|string',
            'customer_address' => 'required|string',
            'gender' => 'required|in:Pria,Wanita',
            'birth_date' => 'required|date',
        ]);
        return response()->json($this->customerService->create($data), 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'customer_name' => 'sometimes|required|string',
            'customer_address' => 'sometimes|required|string',
            'gender' => 'sometimes|required|in:Pria,Wanita',
            'birth_date' => 'sometimes|required|date',
        ]);
        return response()->json($this->customerService->update($id, $data));
    }

    public function destroy($id)
    {
        $this->customerService->delete($id);
        return response()->json(['message' => 'Customer deleted']);
    }
}
