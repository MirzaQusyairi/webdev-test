<?php

namespace App\Services;

use App\Repositories\SaleRepository;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SaleService
{
    protected $saleRepository;

    public function __construct(SaleRepository $saleRepository)
    {
        $this->saleRepository = $saleRepository;
    }

    public function getAll()
    {
        return $this->saleRepository->getAll();
    }

    public function getById($id)
    {
        return $this->saleRepository->getById($id);
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $product = Product::findOrFail($data['product_id']);
            if ($product->stock < $data['quantity']) {
                throw ValidationException::withMessages([
                    'quantity' => ['Stok produk tidak mencukupi.'],
                ]);
            }
            $totalPrice = $data['quantity'] * $product->price;
            $data['total_price'] = $totalPrice;
            $sale = $this->saleRepository->create($data);
            $product->decrement('stock', $data['quantity']);
            return $sale;
        });
    }

    public function update($id, array $data)
    {
        return $this->saleRepository->update($id, $data);
    }

    public function delete($id)
    {
        $this->saleRepository->delete($id);
    }
}
