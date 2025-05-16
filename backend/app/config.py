from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Supabase settings
    supabase_url: str = "https://tktpyofehgpaarziujpb.supabase.co"
    supabase_key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrdHB5b2ZlaGdwYWFyeml1anBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNDU4NjgsImV4cCI6MjA2MjcyMTg2OH0.oGDXcjrkNeLA4Z1F8KUi67v352vo5FbWSYiyRPtROg8"
    
    # Groq API settings
    groq_api_key: str = "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"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings() 