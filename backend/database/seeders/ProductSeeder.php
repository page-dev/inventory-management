<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Wireless Mouse',
                'description' => 'Compact wireless mouse with a USB receiver.',
                'quantity' => 35,
                'price' => '19.90',
                'status' => 'active',
            ],
            [
                'name' => 'Mechanical Keyboard',
                'description' => 'Full-size mechanical keyboard with backlit keys.',
                'quantity' => 20,
                'price' => '49.99',
                'status' => 'active',
            ],
            [
                'name' => 'USB-C Cable',
                'description' => null,
                'quantity' => 0,
                'price' => '9.99',
                'status' => 'active',
            ],
            [
                'name' => 'Desk Lamp',
                'description' => 'Adjustable LED lamp with three brightness settings.',
                'quantity' => 8,
                'price' => '29.50',
                'status' => 'inactive',
            ],
            [
                'name' => 'Free Sample',
                'description' => 'Complimentary sample for testing a zero-price product.',
                'quantity' => 25,
                'price' => '0.00',
                'status' => 'active',
            ],
        ];

        foreach ($products as $product) {
            Product::firstOrCreate(['name' => $product['name']], $product);
        }
    }
}
