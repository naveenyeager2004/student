import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    name: "",
    roll_no: "",
    department: "",
    age: ""
  });

  const [students, setStudents] = useState({});
  const [ageError, setAgeError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [oldRollNo, setOldRollNo] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "age") {
      if (!/^\d*$/.test(value)) {
        setAgeError("Age should be a number");
        return;
      }
      setAgeError("");
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ageError) return;

    const url = isEditing
      ? `http://127.0.0.1:8000/update-student/${oldRollNo}`
      : "http://127.0.0.1:8000/add-student";

    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, age: Number(form.age) })
    });

    setStudents(await res.json());
    setForm({ name: "", roll_no: "", department: "", age: "" });
    setIsEditing(false);
    setOldRollNo(null);
  };

  const handleDelete = async (roll_no) => {
    const res = await fetch(
      `http://127.0.0.1:8000/delete-student/${roll_no}`,
      { method: "DELETE" }
    );
    setStudents(await res.json());
  };

  const handleEdit = (s) => {
    setForm({
      name: s.name,
      roll_no: s.roll_no,
      department: s.department,
      age: s.age.toString()
    });
    setIsEditing(true);
    setOldRollNo(s.roll_no);
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/students")
      .then(res => res.json())
      .then(setStudents);
  }, []);

  return (
    <div className="page">
      <div className="card">
        <h2>Student Registration</h2>

        <form className="grid" onSubmit={handleSubmit}>
          <input
            className="full"
            name="name"
            placeholder="Student Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="roll_no"
            placeholder="Roll Number"
            value={form.roll_no}
            onChange={handleChange}
            required
          />

          <input
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            required
          />

          {ageError && <div className="error">{ageError}</div>}

          <input
            className="full"
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            required
          />

          <button className="add-btn" type="submit">
            {isEditing ? "Update Student" : "Submit"}
          </button>
        </form>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No</th>
              <th>Department</th>
              <th>Age</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(students).map((s) => (
              <tr key={s.roll_no}>
                <td>{s.name}</td>
                <td>{s.roll_no}</td>
                <td>{s.department}</td>
                <td>{s.age}</td>
                <td className="action">
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => handleEdit(s)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDelete(s.roll_no)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default App;
