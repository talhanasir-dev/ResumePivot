# backend/schemas/user.py
def user_serializer(user) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user["email"]
    }