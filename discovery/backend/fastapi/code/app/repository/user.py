from prisma import Prisma
from app.models.user import UserCreate

class UserRepository:
    @staticmethod
    async def create_user(db: Prisma, user_data: UserCreate):
        return await db.user.create(
            data={
                "name": user_data.name,
                "email": user_data.email
            }
        )

    @staticmethod
    async def get_user(db: Prisma, user_id: int):
        return await db.user.find_unique(where={"id": user_id})
