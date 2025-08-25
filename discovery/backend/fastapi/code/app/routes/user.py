from fastapi import APIRouter, HTTPException, Request
from app.models.user import UserCreate, UserOut
from app.repository.user import UserRepository
router = APIRouter()


@router.post("/", response_model=UserOut)
async def create_user(user: UserCreate, request: Request):
    db = request.app.state.db
    
    created = await UserRepository.create_user(db, user)
    return created

@router.get("/{user_id}", response_model=UserOut)
async def read_user(user_id: int, request: Request):
    db = request.app.state.db
    user = await UserRepository.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
