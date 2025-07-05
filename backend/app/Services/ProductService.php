<?php

namespace App\Services;

use App\Repositories\ProductRepository;

class ProductService
{
    protected $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function getAll()
    {
        return $this->productRepository->getAll();
    }

    public function getById($id)
    {
        return $this->productRepository->getById($id);
    }

    public function create(array $data)
    {
        return $this->productRepository->create($data);
    }

    public function update($id, array $data)
    {
        return $this->productRepository->update($id, $data);
    }

    public function delete($id)
    {
        $this->productRepository->delete($id);
    }
}
