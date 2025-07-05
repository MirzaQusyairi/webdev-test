<?php

namespace App\Repositories;

use App\Models\Sale;

class SaleRepository
{
    public function getAll()
    {
        return Sale::with(['customer', 'product'])->get();
    }

    public function getById($id)
    {
        return Sale::with(['customer', 'product'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return Sale::create($data);
    }

    public function update($id, array $data)
    {
        $sale = Sale::findOrFail($id);
        $sale->update($data);
        return $sale;
    }

    public function delete($id)
    {
        $sale = Sale::findOrFail($id);
        $sale->delete();
    }
}
