from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from ..auth.auth import sign_up, sign_in, sign_in_with_otp, verify_otp, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

class SignUpRequest(BaseModel):
    email: EmailStr
    password: str

class SignInRequest(BaseModel):
    email: EmailStr
    password: str

class OTPRequest(BaseModel):
    email: EmailStr

class OTPVerifyRequest(BaseModel):
    email: EmailStr
    token: str

@router.post("/signup")
async def register(request: SignUpRequest):
    return await sign_up(request.email, request.password)

@router.post("/signin")
async def login(request: SignInRequest):
    return await sign_in(request.email, request.password)

@router.post("/otp/send")
async def send_otp(request: OTPRequest):
    return await sign_in_with_otp(request.email)

@router.post("/otp/verify")
async def verify_otp_token(request: OTPVerifyRequest):
    return await verify_otp(request.email, request.token) 