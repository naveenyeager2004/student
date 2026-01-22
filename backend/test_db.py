print("TEST FILE STARTED")

from database import engine

try:
    with engine.connect():
        print("DATABASE CONNECTED SUCCESSFULLY")
except Exception as e:
    print("DATABASE CONNECTION FAILED")
    print(e)
