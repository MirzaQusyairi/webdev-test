<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::insert([
            [
                'product_code' => 'P001',
                'product_name' => 'Laptop',
                'stock' => 10,
                'price' => 15000000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_code' => 'P002',
                'product_name' => 'Smartphone',
                'stock' => 25,
                'price' => 7000000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
