<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArticleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->timestamps();
            $table->increments('id');
            $table->integer('user_id');
            $table->string('value');
            $table->string('description')->nullable();
            $table->string('image')->nullable();
            $table->integer('orders')->default(0);
            $table->enum('status', ['active', 'closed'])->default('closed');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('articles');
    }
}
