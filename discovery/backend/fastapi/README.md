# 🚀 FastAPI Workshop: Build Powerful APIs with Python & Prisma

Welcome to this hands-on workshop!  
We'll start simple with a **Hello World app**, level up to a full **CRUD API**, and finally go advanced with an **agentic app** using **Agno**.

> ⚡ FastAPI gives you automatic docs, type-based validation, async support, and developer happiness out of the box.

---

## 📚 What You'll Learn

- ✅ What FastAPI is and why it's awesome  
- 🔍 How Uvicorn runs FastAPI under the hood  
- 👋 Creating your first FastAPI app  
- 🧱 Handling requests and responses with **Pydantic**  
- 🧩 Using **Prisma** as a type-safe DB client  
- 🔁 Building clean, async **CRUD endpoints**  
- 🔎 Testing your API live with **Swagger UI**  
- ✨ Writing elegant, readable API code with type hints  
- 🤖 Sneak peek into **agentic backends** with **Agno**

---

## ⚙️ Setup
## thing before u setup anything 
 install ruff from vs code extension  and then copy the .vscode in your folder then change the intepreter path and the ruff path  this will help you a lot in the auto complete
### 1. Create a virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

> We'll also use Docker briefly for Prisma + PostgreSQL. Make sure you have Docker installed.

---

## 🔥 What is Uvicorn?

Python (unlike Go or Node.js) doesn't have a built-in HTTP server in its standard web frameworks.

That means:

- FastAPI doesn't handle HTTP requests by itself.
- It doesn't know how to listen to ports, accept connections, or serve responses.

### 🛠 Enter **Uvicorn**

**Uvicorn** is a **lightweight ASGI server** that handles all of that for you.

- It listens on a port (e.g., `localhost:8000`)
- It receives HTTP requests
- It figures out: is this a GET? a POST? a WebSocket?
- Then it passes the request to your FastAPI app to handle the logic.

```python
# You write this
@app.get("/")
def hello():
    return {"msg": "Hello, world"}

# Uvicorn does the rest behind the scenes
```

---

## 🧠 Uvicorn, ASGI, and WSGI – What's the Difference?

### 📜 WSGI (Old)

- Works with **Flask** and older Django
- Only supports **synchronous** requests
- Cannot handle **WebSockets** or **async I/O**

### ⚡ ASGI (New)

- Used by **FastAPI**, Starlette, modern Django
- Supports **both sync and async**
- Handles **WebSockets**, **background tasks**, **real-time apps**

---

### 🚦 Visual Comparison

```
    Client Request
        ↓
 ┌──────────────┐
 │     Server   │
 │              │
 │  Gunicorn    │  (WSGI) → Only sync
 │  Uvicorn     │  (ASGI) → Sync + Async + WebSockets
 └──────────────┘
        ↓
     Your App
     (Flask, FastAPI)
```

### ✅ TL;DR

> Uvicorn is the ASGI server that **runs FastAPI**, handling traffic so you can focus on writing clean logic.

---

## 🧪 Running the App

After creating your FastAPI app (e.g., `app/main.py`), run:

```bash
uvicorn app.main:app --reload
```

- `app.main:app` = `"folder.filename:FastAPI instance"`
- `--reload` = Auto-reload on code changes (for development)

---

## 🧩 Middleware, Routes & Dependencies

### 📦 Middleware (Request/Response Hooks)

Middlewares in FastAPI let you run logic **before and after** every request — like logging, auth, or timing.

#### 🔧 Example:

```python
from fastapi import FastAPI, Request
import time

app = FastAPI()

@app.middleware("http")
async def log_request_time(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    print(f"{request.method} {request.url} took {duration:.2f}s")
    return response
```

#### Common Middlewares:

```python
app.add_middleware(GZipMiddleware)
app.add_middleware(CORSMiddleware, allow_origins=["*"])
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["mydomain.com"])
```

> ✅ Middleware is great for logging, auth checks, request transformation, etc.

---

### 🚏 Routes – Your Endpoints

Every function you define under `@app.get()`, `@app.post()`, etc., is a **route**.

```python
@app.get("/hello")
def say_hello():
    return {"msg": "Hello there!"}
```

Routes support path params, query params, request bodies, and more.

---

### 🧩 Dependencies with `Depends`

FastAPI's `Depends` lets you **inject shared logic** into your routes (auth, DB sessions, common checks).

#### 🔧 Example:

```python
from fastapi import Depends

def get_token():
    return "secrettoken"

@app.get("/secure")
def secure_route(token=Depends(get_token)):
    return {"token": token}
```

> 🔍 `Depends()` makes your routes **clean, testable, and DRY**.

---

## 🧨 Exception Handling

FastAPI gives you clean control over **errors and exceptions**. You can customize responses, log errors, or raise specific HTTP status codes.

#### 🔧 Example:

```python
from fastapi import HTTPException

@app.get("/user/{user_id}")
def get_user(user_id: int):
    if user_id != 1:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user_id, "name": "Alice"}
```

You can also write **custom exception handlers** for logging, wrapping, or retry logic.

---

## 🎯 Pydantic: The Game-Changer

FastAPI uses **Pydantic** to make request/response validation **declarative, elegant, and type-safe**.

### 🧓 Old Python Way (Unvalidated)

```python
def create_user(data):
    name = data.get("name")
    if not name:
        raise ValueError("Missing name")
```

### 🔥 FastAPI + Pydantic Way

```python
from pydantic import BaseModel

class User(BaseModel):
    name: str
    email: str

@app.post("/users")
def create_user(user: User):
    return {"message": f"User {user.name} created!"}
```

- ✅ Fields are validated automatically
- ✅ Docs are generated for free
- ✅ Type hints power editor autocompletion

---

### ⚙️ Pydantic Works Everywhere

- ✅ In request bodies
- ✅ In query parameters
- ✅ In response models
- ✅ In internal logic

> Pydantic + typing makes Python feel like TypeScript or Rust — fast, safe, and readable.

---

### 🧬 Reuse with Inheritance

Pydantic models can be reused and extended with **inheritance**, perfect for shared fields like timestamps or IDs.

```python
from pydantic import BaseModel

class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
```

> 🧠 Create base models with shared fields — then extend for input/output separately.

---

### 🧱 Optional Fields & Defaults

```python
from typing import Optional

class Profile(BaseModel):
    bio: Optional[str] = None
    is_active: bool = True
```

> ✅ Optional fields are nullable in Swagger UI and don’t trigger validation errors.

---

### 🧰 Built-in Validation + Custom Validators

```python
from pydantic import validator

class Product(BaseModel):
    name: str
    price: float

    @validator("price")
    def check_price(cls, v):
        if v <= 0:
            raise ValueError("Price must be positive")
        return v
```

> ⚠️ Custom validators run after basic type checking.

---

### 🔁 Response Models with `response_model`

```python
class UserOut(BaseModel):
    id: int
    name: str

@app.get("/users/{id}", response_model=UserOut)
def read_user(id: int):
    user = {"id": id, "name": "Jane", "password": "secret"}  # password won't be returned
    return user
```

> ✅ `response_model` ensures sensitive data is excluded and schema is enforced in docs.

---

### 🔗 Model Composition (Nested Models)

```python
class Address(BaseModel):
    city: str
    country: str

class Person(BaseModel):
    name: str
    address: Address
```

> 🧱 Build structured APIs by combining small, typed models.

---

### 🔎 Debugging Tip

```python
user = User(name="Alice", email="a@example.com")
print(user.dict())
```

## 📍 Working with Routes, Path Params & Data Models

FastAPI routes are powerful. You can:

- Read data from the **URL path** (e.g. `/users/{id}`)
- Accept and validate JSON **request bodies**
- Use **response models** to control output shape
- Combine all of these with clean, typed Python

---

### 🔗 Path Parameters

Define dynamic URL segments with `{}`. FastAPI automatically parses and validates them.

```python
@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"user_id": user_id}
```

> ✅ `user_id: int` automatically converts and validates the path parameter.

---

### 🧾 Request Models with `BaseModel`

Send data in a POST/PUT request as JSON. Use a **Pydantic model** to validate and document it.

```python
from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str

@app.post("/users")
def create_user(user: UserCreate):
    return {"message": f"User {user.name} created"}
```

> ✅ FastAPI parses the request body, validates it, and provides a typed `user` object.

---

### 📤 Response Models with `response_model`

Use `response_model` to shape the output of your endpoint — great for hiding secrets or formatting responses.

```python
class UserOut(BaseModel):
    id: int
    name: str
    email: str

@app.get("/users/{user_id}", response_model=UserOut)
def read_user(user_id: int):
    return {
        "id": user_id,
        "name": "Alice",
        "email": "alice@example.com",
        "password": "secret123"  # will be excluded!
    }
```

> 🔐 Output will match `UserOut` — extra fields like password will be ignored.

---

### 🧬 Full Example: Path Param + Request Model + Response Model

```python
class UserCreate(BaseModel):
    name: str
    email: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str

fake_db = []

@app.post("/users/{user_id}", response_model=UserOut)
def create_user(user_id: int, user: UserCreate):
    new_user = {"id": user_id, **user.dict()}
    fake_db.append(new_user)
    return new_user
```

> ✅ This shows how to mix path param (`user_id`), request body (`user`), and a clean output (`UserOut`).

---

### 🎯 TL;DR

| Feature             | How it works                          |
|---------------------|----------------------------------------|
| Path Params         | `@app.get("/item/{id}")`              |
| Request Body        | Function param with `BaseModel`       |
| Response Shaping    | Use `response_model=YourModel`        |
| Automatic Docs      | Swagger UI reads all of the above     |



