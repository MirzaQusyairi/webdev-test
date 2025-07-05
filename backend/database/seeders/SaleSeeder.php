<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Sale;
use App\Models\Customer;
use App\Models\Product;

class SaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customer = Customer::first();
        $product = Product::first();
        if ($customer && $product) {
            Sale::create([
                'customer_id' => $customer->id,
                'product_id' => $product->id,
                'order_date' => now(),
                'quantity' => 2,
                'total_price' => $product->price * 2,
            ]);
        }
    }
}
