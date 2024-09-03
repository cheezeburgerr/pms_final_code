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
        Schema::create('model_designs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('file');
            $table->unsignedBigInteger('model_id');
            $table->foreign('model_id')->references('id')->on('product_models');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('model_designs');
    }
};
