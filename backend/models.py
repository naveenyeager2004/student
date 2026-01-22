from sqlalchemy import Column, String, Integer
from database import Base

class Student(Base):
    __tablename__ = "students"

    roll_no = Column(String, primary_key=True, index=True)
    name = Column(String)
    department = Column(String)
    age = Column(Integer)
