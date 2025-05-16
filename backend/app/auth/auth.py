from supabase import create_client, Client
from fastapi import HTTPException, Depends
from app.config import get_settings
from typing import Optional

settings = get_settings()

# Initialize Supabase client
supabase: Client = create_client(settings.supabase_url, settings.supabase_key)

async def sign_up(email: str, password: str):
    try:
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

async def sign_in(email: str, password: str):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

async def sign_in_with_otp(email: str):
    try:
        response = supabase.auth.sign_in_with_otp({
            "email": email
        })
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

async def verify_otp(email: str, token: str):
    try:
        response = supabase.auth.verify_otp({
            "email": email,
            "token": token,
            "type": "email"
        })
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

async def get_current_user(token: str):
    try:
        user = supabase.auth.get_user(token)
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials") 