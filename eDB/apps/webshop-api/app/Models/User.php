<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Mehradsadeghi\FilterQueryString\FilterQueryString;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;
    use FilterQueryString;


    // Specify the correct table name
    protected $table = 'Users';

    // Specify the primary key if it's different from the default 'id'
    protected $primaryKey = 'Id';

    // If the primary key is non-incrementing or a string, adjust these properties:
    public $incrementing = true;
    protected $keyType = 'int';

    protected $filters = [
      "sort",
      'name',
      "like",
  ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        "first_name",
        "last_name",
        "email",
        "phone_number",
        "address",
        "postal_code",
        "city"
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function books()
    {
        return $this->hasMany(Book::class);
    }



}
