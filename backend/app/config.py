from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Supabase settings
    supabase_url: str = "https://your_url.supabase.co"
    supabase_key: str = "your_key"
    
    # Groq API settings
    groq_api_key: str = "put_your_api_key_here"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings() 
