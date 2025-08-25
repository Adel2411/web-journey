# Laravel API Workshop - Quick Guide

![laravel](https://abridge-co.jp/wp/wp-content/uploads/2021/11/laravel_logo_icon_170314.png)

## 🗺 Introduction

Laravel is one of the most popular PHP frameworks for building modern web applications. It is known for its elegant syntax, rich ecosystem, and developer-friendly tooling.

✨ Key Features of Laravel:

- MVC Architecture: Clean separation between logic and presentation.
- Eloquent ORM: Easy and expressive database interaction.
- Blade Templating Engine: Powerful templating with control structures.
- Built-in functionalities.
- Sanctum/Passport: For API token authentication.

---

## ⚙️ Requirements

Before starting, make sure you have the following tools installed on your system:

- **PHP**
- **Composer**
- **MySQL** or any database supported by Laravel
- **Postman** or any API testing tool (optional but useful)

## You can use [XAMPP](https://www.apachefriends.org/) or [Laravel Sail](https://laravel.com/docs/sail) as pre-configured environments.

## 1. Project Setup

### Install Laravel:

```bash
composer global require laravel/installer
laravel new example-app
php artisan serve
```

### Configure `.env`

- Set up DB connection

```dotenv
DB_DATABASE=laravel_api
DB_USERNAME=root
DB_PASSWORD=
```

Create a database manually named `laravel_api`.

---

## 2. Core Concepts

### 🧪 Working with API Routes:

To confirm that Laravel recognizes your API routes:

```bash
php artisan install:api
```

This will list all registered API routes defined in `routes/api.php`.

### Routes (routes/api.php):

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});

```

### Controller:

```bash
php artisan make:controller TestController
```

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{
    public function hello()
    {
        return response()->json(['message' => 'Hello']);
    }
}


```

### Model:

```bash
php artisan make:model Task
```

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = ['title', 'completed'];
}
```

### Middleware:

```bash
php artisan make:middleware IsAdmin
```

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        if (!Auth::check()|| !Auth::user()->is_admin) {
            return response()->json(['error' => 'Access denied. Admins only.'], 403);
        }
        return $next($request);
    }
}


```

---

## 3. Build CRUD API (Task Manager)

### Create TaskController:

```bash
php artisan make:controller TaskController --api
```

### Define Controller (`Controllers/TaskController.php`)

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = Task::all();
        return response()->json($tasks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $request->validate([
            'title' => 'required|string|max:255',
            'completed' => 'required|boolean'
        ]);

        $Createdtask = Task::create($request->all());

        return response()->json($Createdtask, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $task = Task::find($id);
        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }
        return response()->json($task, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $task = Task::find($id);
        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'completed' => 'sometimes|boolean'
        ]);

        $task->update($validated);
        return response()->json($task, 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $task = Task::find($id);
        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully'], 200);
    }
}

```

### Define Routes (`routes/api.php`):

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('tasks', TaskController::class);

    // Manual route equivalents (for explanation):
    Route::get('/tasks', [TaskController::class, 'index']);       // GET - List all tasks
    Route::post('/tasks', [TaskController::class, 'store']);      // POST - Create new task
    Route::get('/tasks/{task}', [TaskController::class, 'show']); // GET - Show single task
    Route::put('/tasks/{task}', [TaskController::class, 'update']); // PUT - Update task
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']); // DELETE - Remove task
});
```

---

## 4. Sanctum Authentication

### Install:

```bash
composer require laravel/sanctum
php artisan vendor:publish --tag=sanctum-config
php artisan migrate
```

### Sanctum Config for api:

```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],

    'api' => [
        'driver' => 'sanctum',
        'provider' => 'users',
    ],
],
```

### AuthController:

```bash
php artisan make:controller Api/AuthController
```

```php
public function register(Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string',
    ]);
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt($request->password),
    ]);

    return response()->json([
        'user' => $user
    ], 201);
}

```

```php
public function login(Request $request) {
    $request->validate([
        'email' => 'required|string|email',
        'password' => 'required|string',
    ]);

    if (!Auth::attempt($request->only('email', 'password'))) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    $token = Auth::user()->createToken('auth-token')->plainTextToken;

    return response()->json(['token' => $token, 'user' => Auth::user()], 200);
}
```

### Routes:

```php
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
```

Protect task routes:

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('tasks', TaskController::class);
});
```

---

## 5. Relationships - User and Tasks

### Migration:

```php
Schema::table('tasks', function (Blueprint $table) {
    //$table->foreignId('user_id')->constrained()->onDelete('cascade');

    $table->unsignedBigInteger('user_id');
    $table->foreign('user_id')->references('id')->on('users');
});
```

### Models:

**User.php**

```php
public function tasks() {
    return $this->hasMany(Task::class);
}
```

**Task.php**

```php
public function user() {
    return $this->belongsTo(User::class);
}
```

### In Controller:

```php
public function store(Request $request) {
    return $request->user()->tasks()->create([
        'title' => $request->title
    ]);
}

public function index(Request $request) {
    return $request->user()->tasks;
}
```

---

## ✅ Test Endpoints (Postman)

1. Register user → `/api/register`
2. Login → `/api/login` → copy token
3. Add token to header:

```
Authorization: Bearer <token>
```

4. Access `/api/tasks`

---

**Done! 🎉** You now have a Laravel REST API with authentication and model relationships.
