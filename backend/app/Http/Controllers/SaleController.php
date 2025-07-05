<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SaleService;

class SaleController extends Controller
{
    protected $saleService;

    public function __construct(SaleService $saleService)
    {
        $this->saleService = $saleService;
    }

    public function index()
    {
        return response()->json($this->saleService->getAll());
    }

    public function show($id)
    {
        return response()->json($this->saleService->getById($id));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'product_id' => 'required|exists:products,id',
            'order_date' => 'required|date',
            'quantity' => 'required|integer',
            'total_price' => 'required|numeric',
        ]);
        return response()->json($this->saleService->create($data), 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'customer_id' => 'sometimes|required|exists:customers,id',
            'product_id' => 'sometimes|required|exists:products,id',
            'order_date' => 'sometimes|required|date',
            'quantity' => 'sometimes|required|integer',
            'total_price' => 'sometimes|required|numeric',
        ]);
        return response()->json($this->saleService->update($id, $data));
    }

    public function destroy($id)
    {
        $this->saleService->delete($id);
        return response()->json(['message' => 'Sale deleted']);
    }
}
