<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = ['title', 'description', 'completed', 'user_id'];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
