<?php
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use App\User;
use App\Articles;

class ArticleSeeder extends Seeder
{
  public function run()
  {
    $users = User::get();
    $faker = Faker\Factory::create();
    $counter = 1;
    foreach ($users as $user) {

      $articles= array();
      $timestamp = Carbon::now();
      for ($d = 0; $d <= 5; $d++) {
        $articles[] = array(
          'created_at' => $timestamp->format('Y-m-d H:i:s'),
          'updated_at' => $timestamp->format('Y-m-d H:i:s'),
          'user_id' => $user->id,
          'value' => $faker->sentence(1),
          'description' => $faker->sentence(5),
          'image' => null,
          'orders' => $counter,
          'status' => $faker->randomElement(['active', 'closed'])
        );
        $counter+=1;
        $timestamp = $timestamp->subDay();
      }

      DB::table('articles')->insert($articles);
    }

    $this->command->info('Article table seeded.');
  }
}
