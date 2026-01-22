from pydantic import BaseModel

class StudentSchema(BaseModel):
    name: str
    roll_no: str
    department: str
    age: int
