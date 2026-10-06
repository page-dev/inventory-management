<?php

use App\Models\Product;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;

pest()->use(LazilyRefreshDatabase::class);

describe('list and show', function (): void {
    it('returns an empty collection when there are no products', function (): void {
        $this->getJson('/api/products')
            ->assertOk()
            ->assertExactJson(['data' => []]);
    });

    it('lists active and inactive products without pagination', function (): void {
        $active = Product::factory()->create();
        $inactive = Product::factory()->create(['status' => 'inactive']);

        $this->getJson('/api/products')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.id', $active->id)
            ->assertJsonPath('data.0.status', 'active')
            ->assertJsonPath('data.1.id', $inactive->id)
            ->assertJsonPath('data.1.status', 'inactive')
            ->assertJsonMissingPath('meta');
    });

    it('shows the agreed product fields and a two-decimal price', function (): void {
        $product = Product::factory()->create([
            'name' => 'Mouse',
            'description' => 'Wireless mouse',
            'quantity' => 4,
            'price' => '19.90',
            'created_at' => '2026-10-06 00:00:00',
            'updated_at' => '2026-10-06 00:00:00',
        ]);

        $this->getJson('/api/products/'.$product->id)
            ->assertOk()
            ->assertExactJson(['data' => [
                'id' => $product->id,
                'name' => 'Mouse',
                'description' => 'Wireless mouse',
                'quantity' => 4,
                'price' => '19.90',
                'status' => 'active',
                'created_at' => '2026-10-06T00:00:00.000000Z',
                'updated_at' => '2026-10-06T00:00:00.000000Z',
            ]]);
    });

    it('returns JSON 404 when viewing a missing product', function (): void {
        $this->get('/api/products/999999')
            ->assertNotFound()
            ->assertJsonStructure(['message']);
    });
});

describe('create', function (): void {
    it('creates and persists a product with an allowed status', function (string $status): void {
        $payload = [
            'name' => 'Keyboard',
            'description' => 'Mechanical keyboard',
            'quantity' => 10,
            'price' => '29.95',
            'status' => $status,
        ];

        $response = $this->postJson('/api/products', $payload);

        $response->assertCreated()->assertJsonFragment($payload);
        $this->assertDatabaseHas('products', ['id' => $response->json('data.id'), ...$payload]);
    })->with(['active', 'inactive']);

    it('accepts zero quantity and price with an optional description', function (array $description): void {
        $payload = [
            'name' => 'Free sample',
            'quantity' => 0,
            'price' => 0,
            'status' => 'active',
            ...$description,
        ];

        $response = $this->postJson('/api/products', $payload);

        $response->assertCreated()
            ->assertJsonPath('data.quantity', 0)
            ->assertJsonPath('data.price', '0.00')
            ->assertJsonPath('data.description', null);
        $this->assertDatabaseHas('products', [
            'id' => $response->json('data.id'),
            'quantity' => 0,
            'price' => '0.00',
            'description' => null,
        ]);
    })->with([
        'omitted' => [[]],
        'null' => [['description' => null]],
        'empty' => [['description' => '']],
    ]);

    it('stores and returns a price rounded to two decimal places', function (): void {
        $response = $this->postJson('/api/products', [
            'name' => 'Rounded price',
            'quantity' => 1,
            'price' => '19.995',
            'status' => 'active',
        ]);

        $response->assertCreated()->assertJsonPath('data.price', '20.00');
        $this->assertDatabaseHas('products', ['id' => $response->json('data.id'), 'price' => '20.00']);
    });

    it('returns JSON 422 when required fields are missing', function (): void {
        $response = $this->post('/api/products', []);

        $response->assertUnprocessable()->assertJsonValidationErrors([
            'name' => 'The name field is required.',
            'quantity' => 'The quantity field is required.',
            'price' => 'The price field is required.',
            'status' => 'The status field is required.',
        ]);
        $this->assertDatabaseCount('products', 0);
    });

    it('returns 422 for invalid input without creating a product', function (string $field, mixed $value, string $message): void {
        $payload = [
            'name' => 'Keyboard',
            'quantity' => 10,
            'price' => '29.95',
            'status' => 'active',
            $field => $value,
        ];

        $response = $this->postJson('/api/products', $payload);

        $response->assertUnprocessable()->assertJsonValidationErrors([$field => $message]);
        $this->assertDatabaseCount('products', 0);
    })->with([
        'non-string name' => ['name', 123, 'The name field must be a string.'],
        'blank name' => ['name', '   ', 'The name field is required.'],
        'long name' => ['name', str_repeat('a', 256), 'The name field must not be greater than 255 characters.'],
        'non-string description' => ['description', 123, 'The description field must be a string.'],
        'fractional quantity' => ['quantity', 1.5, 'The quantity field must be an integer.'],
        'negative quantity' => ['quantity', -1, 'The quantity field must be at least 0.'],
        'quantity overflow' => ['quantity', 2147483648, 'The quantity field must not be greater than 2147483647.'],
        'non-numeric price' => ['price', 'free', 'The price field must be a number.'],
        'negative price' => ['price', -0.01, 'The price field must be at least 0.'],
        'price overflow' => ['price', '100000000.00', 'The price field must not be greater than 99999999.99.'],
        'stock status' => ['status', 'in_stock', 'The selected status is invalid.'],
    ]);
});

describe('update', function (): void {
    it('updates and persists all editable product fields', function (): void {
        $product = Product::factory()->create();
        $payload = [
            'name' => 'Updated keyboard',
            'description' => null,
            'quantity' => 0,
            'price' => '12.345',
            'status' => 'inactive',
        ];

        $response = $this->putJson('/api/products/'.$product->id, $payload);

        $response->assertOk()
            ->assertJsonFragment([...$payload, 'price' => '12.35'])
            ->assertJsonPath('data.id', $product->id);
        $this->assertDatabaseHas('products', ['id' => $product->id, ...$payload, 'price' => '12.35']);
        $this->assertDatabaseCount('products', 1);
    });

    it('returns 422 for invalid updates and leaves the product unchanged', function (): void {
        $product = Product::factory()->create(['quantity' => 5]);
        $original = $product->getAttributes();

        $response = $this->putJson('/api/products/'.$product->id, [
            'name' => 'Changed name',
            'quantity' => -1,
            'price' => '12.00',
            'status' => 'inactive',
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors(['quantity']);
        $this->assertDatabaseHas('products', $original);
    });

    it('returns 422 when required update fields are missing', function (): void {
        $product = Product::factory()->create();
        $original = $product->getAttributes();

        $response = $this->putJson('/api/products/'.$product->id, []);

        $response->assertUnprocessable()->assertJsonValidationErrors(['name', 'quantity', 'price', 'status']);
        $this->assertDatabaseHas('products', $original);
    });

    it('returns JSON 404 when updating a missing product', function (): void {
        $this->putJson('/api/products/999999', [
            'name' => 'Missing product',
            'quantity' => 0,
            'price' => 0,
            'status' => 'active',
        ])->assertNotFound()->assertJsonStructure(['message']);

        $this->assertDatabaseCount('products', 0);
    });
});

describe('delete', function (): void {
    it('deletes the product and returns an empty 204 response', function (): void {
        $product = Product::factory()->create();

        $this->deleteJson('/api/products/'.$product->id)->assertNoContent();

        $this->assertModelMissing($product);
    });

    it('returns JSON 404 when deleting a missing product', function (): void {
        $this->deleteJson('/api/products/999999')
            ->assertNotFound()
            ->assertJsonStructure(['message']);
    });
});
