from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models, schemas
from database import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)
print("✅ TABLE CREATION ATTEMPTED")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/add-student")
def add_student(student: schemas.StudentSchema, db: Session = Depends(get_db)):
    db_student = models.Student(**student.dict())
    db.add(db_student)
    db.commit()
    return get_students(db)

@app.get("/students")
def get_students(db: Session = Depends(get_db)):
    students = db.query(models.Student).all()
    return {
        s.roll_no: {
            "name": s.name,
            "roll_no": s.roll_no,
            "department": s.department,
            "age": s.age
        } for s in students
    }

@app.put("/update-student/{old_roll_no}")
def update_student(old_roll_no: str, student: schemas.StudentSchema, db: Session = Depends(get_db)):
    db_student = db.query(models.Student).filter(models.Student.roll_no == old_roll_no).first()
    if db_student:
        db_student.roll_no = student.roll_no
        db_student.name = student.name
        db_student.department = student.department
        db_student.age = student.age
        db.commit()
    return get_students(db)

@app.delete("/delete-student/{roll_no}")
def delete_student(roll_no: str, db: Session = Depends(get_db)):
    db_student = db.query(models.Student).filter(models.Student.roll_no == roll_no).first()
    if db_student:
        db.delete(db_student)
        db.commit()
    return get_students(db)
