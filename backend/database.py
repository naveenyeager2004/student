from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql://postgres:postgres@db:5432/student_db"

engine = create_engine(DATABASE_URL, echo=True)

try:
    with engine.connect() as conn:
        print("✅ DATABASE CONNECTION SUCCESSFUL")
except Exception as e:
    print("❌ DATABASE CONNECTION FAILED")
    print(e)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()
