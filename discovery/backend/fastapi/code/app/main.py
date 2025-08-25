from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.routes.user import router as user_router
from prisma import Prisma
import time

db = Prisma()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    app.state.db = db# we can use this to access db in routes if needed
    yield
    await db.disconnect()
   
    
app = FastAPI(
    title="User Management API",
    description="API for managing users with Prisma and FastAPI",
    version="1.0.0",
    openapi_url="/openapi.json",
    openapi_tags=[
        {
            "name": "Users",
            "description": "Operations with users"
        }
    ],
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,#in actual application t7tajjo gir hdi rni nzid 3liha brk hna hhh
    debug=True,

)
# @app.on_event("startup")
# async def startup():
#     await db.connect()

# @app.on_event("shutdown")
# async def shutdown():
#     await db.disconnect()

@app.middleware("http")
async def log_time(request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    print(f" {request.method} {request.url.path} took {duration:.2f}s")
    return response
@app.get("/health")
async def health():
    try:
        await db.user.find_many(take=1)
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "details": str(e)}
    
    
app.include_router(user_router, prefix="/users", tags=["Users"])
