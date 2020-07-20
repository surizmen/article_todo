<?php
use Illuminate\Database\Seeder;
use App\User;

class UserSeeder extends Seeder
{
    /**
     * Generate Users.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Новый user',
            'email' => 'user@test.test',
            'password' => bcrypt('password'),
            'role' => 1
        ]);

        factory(User::class, 5)->create();

        $this->command->info('Users table seeded.');
    }
}
