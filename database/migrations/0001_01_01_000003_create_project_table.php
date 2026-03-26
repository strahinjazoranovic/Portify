<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id(); // bigint(20) primary key
            $table->string('name', 100);       
            $table->text('description');
            $table->date('deadline');
            $table->integer('user_id')->nullable();
            $table->timestamps(); // created_at and updated_at
            $table->integer('progress');
            $table->string('logo', 100)->nullable();
            $table->enum('status', ['Not started', 'In development', 'In testing', 'Finished']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};