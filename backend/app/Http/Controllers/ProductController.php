<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ProductService;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index()
    {
        return response()->json($this->productService->getAll());
    }

    public function show($id)
    {
        return response()->json($this->productService->getById($id));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_code' => 'required|string|unique:products,product_code',
            'product_name' => 'required|string',
            'stock' => 'required|integer',
            'price' => 'required|numeric',
        ]);
        return response()->json($this->productService->create($data), 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'product_code' => 'sometimes|required|string|unique:products,product_code,' . $id,
            'product_name' => 'sometimes|required|string',
            'stock' => 'sometimes|required|integer',
            'price' => 'sometimes|required|numeric',
        ]);
        return response()->json($this->productService->update($id, $data));
    }

    public function destroy($id)
    {
        $this->productService->delete($id);
        return response()->json(['message' => 'Product deleted']);
    }
}
