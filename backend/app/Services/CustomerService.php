<?php

namespace App\Services;

use App\Repositories\CustomerRepository;

class CustomerService
{
    protected $customerRepository;

    public function __construct(CustomerRepository $customerRepository)
    {
        $this->customerRepository = $customerRepository;
    }

    public function getAll()
    {
        return $this->customerRepository->all();
    }

    public function getById($id)
    {
        return $this->customerRepository->find($id);
    }

    public function create(array $data)
    {
        return $this->customerRepository->create($data);
    }

    public function update($id, array $data)
    {
        return $this->customerRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->customerRepository->delete($id);
    }
}
