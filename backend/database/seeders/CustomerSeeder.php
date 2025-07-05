<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Customer;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Customer::insert([
            [
                'id' => (string)\Illuminate\Support\Str::uuid(),
                'customer_name' => 'John Doe',
                'customer_address' => '123 Main St',
                'gender' => 'Pria',
                'birth_date' => '1990-01-01',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string)\Illuminate\Support\Str::uuid(),
                'customer_name' => 'Jane Smith',
                'customer_address' => '456 Oak Ave',
                'gender' => 'Wanita',
                'birth_date' => '1992-05-10',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
