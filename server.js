const express = require("express")
const mysql = require("mysql2/promise")
const cors = require("cors")
const path = require("path")

const app = express()
const PORT = 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

// Database configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "nasaa0122", // Update with your MySQL password
  database: "student_lesson_db",
}

// Create database pool
const pool = mysql.createPool(dbConfig)

// =============================================
// API Routes
// =============================================

// ---------- Dashboard Stats ----------
app.get("/api/stats", async (req, res) => {
  try {
    const conn = await pool.getConnection()

    const [students] = await conn.query("SELECT COUNT(*) as count FROM Student")
    const [teachers] = await conn.query("SELECT COUNT(*) as count FROM Teacher")
    const [courses] = await conn.query("SELECT COUNT(*) as count FROM Course")
    const [enrollments] = await conn.query(
      "SELECT COUNT(*) as count FROM Enrollment"
    )

    conn.release()

    res.json({
      students: students[0].count,
      teachers: teachers[0].count,
      courses: courses[0].count,
      enrollments: enrollments[0].count,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    res.status(500).json({ error: "Failed to fetch statistics" })
  }
})

// ---------- Majors ----------
app.get("/api/majors", async (req, res) => {
  try {
    const conn = await pool.getConnection()
    const [rows] = await conn.query("SELECT * FROM Major ORDER BY Major_name")
    conn.release()
    res.json(rows)
  } catch (error) {
    console.error("Error fetching majors:", error)
    res.status(500).json({ error: "Failed to fetch majors" })
  }
})

app.post("/api/majors", async (req, res) => {
  try {
    const { Major_ID, Major_name } = req.body
    const conn = await pool.getConnection()
    await conn.query("INSERT INTO Major (Major_ID, Major_name) VALUES (?, ?)", [
      Major_ID,
      Major_name,
    ])
    conn.release()
    res.json({ success: true, message: "Major added successfully" })
  } catch (error) {
    console.error("Error adding major:", error)
    res.status(500).json({ error: "Failed to add major" })
  }
})

app.delete("/api/majors/:id", async (req, res) => {
  try {
    const conn = await pool.getConnection()
    await conn.query("DELETE FROM Major WHERE Major_ID = ?", [req.params.id])
    conn.release()
    res.json({ success: true, message: "Major deleted successfully" })
  } catch (error) {
    console.error("Error deleting major:", error)
    res.status(500).json({ error: "Failed to delete major" })
  }
})

// ---------- Teachers ----------
app.get("/api/teachers", async (req, res) => {
  try {
    const conn = await pool.getConnection()
    const [rows] = await conn.query(
      "SELECT * FROM Teacher ORDER BY Teacher_name"
    )
    conn.release()
    res.json(rows)
  } catch (error) {
    console.error("Error fetching teachers:", error)
    res.status(500).json({ error: "Failed to fetch teachers" })
  }
})

app.post("/api/teachers", async (req, res) => {
  try {
    const { Teacher_code, Teacher_name, email, department } = req.body
    const conn = await pool.getConnection()
    await conn.query(
      "INSERT INTO Teacher (Teacher_code, Teacher_name, email, department) VALUES (?, ?, ?, ?)",
      [Teacher_code, Teacher_name, email, department]
    )
    conn.release()
    res.json({ success: true, message: "Teacher added successfully" })
  } catch (error) {
    console.error("Error adding teacher:", error)
    res.status(500).json({ error: "Failed to add teacher" })
  }
})

app.put("/api/teachers/:code", async (req, res) => {
  try {
    const { Teacher_name, email, department } = req.body
    const conn = await pool.getConnection()
    await conn.query(
      "UPDATE Teacher SET Teacher_name = ?, email = ?, department = ? WHERE Teacher_code = ?",
      [Teacher_name, email, department, req.params.code]
    )
    conn.release()
    res.json({ success: true, message: "Teacher updated successfully" })
  } catch (error) {
    console.error("Error updating teacher:", error)
    res.status(500).json({ error: "Failed to update teacher" })
  }
})

app.delete("/api/teachers/:code", async (req, res) => {
  try {
    const conn = await pool.getConnection()
    await conn.query("DELETE FROM Teacher WHERE Teacher_code = ?", [
      req.params.code,
    ])
    conn.release()
    res.json({ success: true, message: "Teacher deleted successfully" })
  } catch (error) {
    console.error("Error deleting teacher:", error)
    res.status(500).json({ error: "Failed to delete teacher" })
  }
})

// Get teacher's courses with enrolled students
app.get("/api/teachers/:code/courses", async (req, res) => {
  try {
    const conn = await pool.getConnection()
    const [rows] = await conn.query(
      `
            SELECT 
                c.Course_code,
                c.Course_name,
                c.Credit,
                COUNT(DISTINCT e.Student_code) as student_count
            FROM Enrollment e
            JOIN Course c ON e.Course_code = c.Course_code
            WHERE e.Teacher_code = ?
            GROUP BY c.Course_code, c.Course_name, c.Credit
            ORDER BY c.Course_name
        `,
      [req.params.code]
    )
    conn.release()
    res.json(rows)
  } catch (error) {
    console.error("Error fetching teacher courses:", error)
    res.status(500).json({ error: "Failed to fetch teacher courses" })
  }
})

// ---------- Courses ----------
app.get("/api/courses", async (req, res) => {
  try {
    const conn = await pool.getConnection()
    const [rows] = await conn.query(`
            SELECT c.*, p.Course_name as Prerequisite_name,
                   (SELECT COUNT(*) FROM Enrollment e WHERE e.Course_code = c.Course_code) as enrolled_count
            FROM Course c
            LEFT JOIN Course p ON c.Prerequisite = p.Course_code
            ORDER BY c.Course_code
        `)
    conn.release()
    res.json(rows)
  } catch (error) {
    console.error("Error fetching courses:", error)
    res.status(500).json({ error: "Failed to fetch courses" })
  }
})

app.post("/api/courses", async (req, res) => {
  try {
    const { Course_code, Course_name, Prerequisite, Credit, description } =
      req.body
    const conn = await pool.getConnection()
    await conn.query(
      "INSERT INTO Course (Course_code, Course_name, Prerequisite, Credit, description) VALUES (?, ?, ?, ?, ?)",
      [Course_code, Course_name, Prerequisite || null, Credit, description]
    )
    conn.release()
    res.json({ success: true, message: "Course added successfully" })
  } catch (error) {
    console.error("Error adding course:", error)
    res.status(500).json({ error: "Failed to add course" })
  }
})

app.put("/api/courses/:code", async (req, res) => {
  try {
    const { Course_name, Prerequisite, Credit, description } = req.body
    const conn = await pool.getConnection()
    await conn.query(
      "UPDATE Course SET Course_name = ?, Prerequisite = ?, Credit = ?, description = ? WHERE Course_code = ?",
      [Course_name, Prerequisite || null, Credit, description, req.params.code]
    )
    conn.release()
    res.json({ success: true, message: "Course updated successfully" })
  } catch (error) {
    console.error("Error updating course:", error)
    res.status(500).json({ error: "Failed to update course" })
  }
})

app.delete("/api/courses/:code", async (req, res) => {
  try {
    const conn = await pool.getConnection()
    await conn.query("DELETE FROM Course WHERE Course_code = ?", [
      req.params.code,
    ])
    conn.release()
    res.json({ success: true, message: "Course deleted successfully" })
  } catch (error) {
    console.error("Error deleting course:", error)
    res.status(500).json({ error: "Failed to delete course" })
  }
})

// Get students enrolled in a course
app.get("/api/courses/:code/students", async (req, res) => {
  try {
    const conn = await pool.getConnection()
    const [rows] = await conn.query(
      `
            SELECT 
                s.Student_code,
                s.Student_name,
                s.GPA,
                s.email,
                m.Major_name,
                t.Teacher_name,
                e.enrollment_date,
                e.grade
            FROM Enrollment e
            JOIN Student s ON e.Student_code = s.Student_code
            JOIN Teacher t ON e.Teacher_code = t.Teacher_code
            LEFT JOIN Major m ON s.Major_ID = m.Major_ID
            WHERE e.Course_code = ?
            ORDER BY s.Student_name
        `,
      [req.params.code]
    )
    conn.release()
    res.json(rows)
  } catch (error) {
    console.error("Error fetching course students:", error)
    res.status(500).json({ error: "Failed to fetch course students" })
  }
})

// ---------- Students ----------
app.get("/api/students", async (req, res) => {
  try {
    const conn = await pool.getConnection()
    const [rows] = await conn.query(`
            SELECT s.*, m.Major_name,
                   (SELECT COUNT(*) FROM Enrollment e WHERE e.Student_code = s.Student_code) as course_count
            FROM Student s
            LEFT JOIN Major m ON s.Major_ID = m.Major_ID
            ORDER BY s.Student_name
        `)

    conn.release()
    res.json(rows)
  } catch (error) {
    console.error("Error fetching students:", error)
    res.status(500).json({ error: "Failed to fetch students" })
  }
})

app.post("/api/students", async (req, res) => {
  try {
    const {
      Student_code,
      Student_name,
      GPA,
      Major_ID,
      email,
      enrollment_year,
    } = req.body
    const conn = await pool.getConnection()
    await conn.query(
      "INSERT INTO Student (Student_code, Student_name, GPA, Major_ID, email, enrollment_year) VALUES (?, ?, ?, ?, ?, ?)",
      [Student_code, Student_name, GPA, Major_ID, email, enrollment_year]
    )
    conn.release()
    res.json({ success: true, message: "Student added successfully" })
  } catch (error) {
    console.error("Error adding student:", error)
    res.status(500).json({ error: "Failed to add student" })
  }
})

app.put("/api/students/:code", async (req, res) => {
  try {
    const { Student_name, GPA, Major_ID, email, enrollment_year } = req.body
    const conn = await pool.getConnection()
    await conn.query(
      "UPDATE Student SET Student_name = ?, GPA = ?, Major_ID = ?, email = ?, enrollment_year = ? WHERE Student_code = ?",
      [Student_name, GPA, Major_ID, email, enrollment_year, req.params.code]
    )
    conn.release()
    res.json({ success: true, message: "Student updated successfully" })
  } catch (error) {
    console.error("Error updating student:", error)
    res.status(500).json({ error: "Failed to update student" })
  }
})

app.delete("/api/students/:code", async (req, res) => {
  try {
    const conn = await pool.getConnection()
    await conn.query("DELETE FROM Enrollment WHERE Student_code = ?", [
      req.params.code,
    ])
    await conn.query("DELETE FROM Student WHERE Student_code = ?", [
      req.params.code,
    ])
    conn.release()
    res.json({ success: true, message: "Student deleted successfully" })
  } catch (error) {
    console.error("Error deleting student:", error)
    res.status(500).json({ error: "Failed to delete student" })
  }
})

// Get student's enrolled courses
app.get("/api/students/:code/courses", async (req, res) => {
  try {
    const conn = await pool.getConnection()
    const [rows] = await conn.query(
      `
            SELECT 
                c.Course_code,
                c.Course_name,
                c.Credit,
                t.Teacher_name,
                e.enrollment_date,
                e.grade
            FROM Enrollment e
            JOIN Course c ON e.Course_code = c.Course_code
            JOIN Teacher t ON e.Teacher_code = t.Teacher_code
            WHERE e.Student_code = ?
            ORDER BY c.Course_name
        `,
      [req.params.code]
    )
    conn.release()
    res.json(rows)
  } catch (error) {
    console.error("Error fetching student courses:", error)
    res.status(500).json({ error: "Failed to fetch student courses" })
  }
})

// ---------- Enrollments ----------
app.get("/api/enrollments", async (req, res) => {
  try {
    const conn = await pool.getConnection()
    const [rows] = await conn.query(`
            SELECT 
                e.*,
                s.Student_name,
                c.Course_name,
                c.Credit,
                t.Teacher_name
            FROM Enrollment e
            JOIN Student s ON e.Student_code = s.Student_code
            JOIN Course c ON e.Course_code = c.Course_code
            JOIN Teacher t ON e.Teacher_code = t.Teacher_code
            ORDER BY e.enrollment_date DESC, s.Student_name
        `)
    conn.release()
    res.json(rows)
  } catch (error) {
    console.error("Error fetching enrollments:", error)
    res.status(500).json({ error: "Failed to fetch enrollments" })
  }
})

app.post("/api/enrollments", async (req, res) => {
  try {
    const { Student_code, Course_code, Teacher_code, grade } = req.body
    const conn = await pool.getConnection()
    await conn.query(
      "INSERT INTO Enrollment (Student_code, Course_code, Teacher_code, grade) VALUES (?, ?, ?, ?)",
      [Student_code, Course_code, Teacher_code, grade || null]
    )
    conn.release()
    res.json({ success: true, message: "Enrollment added successfully" })
  } catch (error) {
    console.error("Error adding enrollment:", error)
    res.status(500).json({ error: "Failed to add enrollment" })
  }
})

app.put("/api/enrollments/:studentCode/:courseCode", async (req, res) => {
  try {
    const { Teacher_code, grade } = req.body
    const conn = await pool.getConnection()
    await conn.query(
      "UPDATE Enrollment SET Teacher_code = ?, grade = ? WHERE Student_code = ? AND Course_code = ?",
      [
        Teacher_code,
        grade || null,
        req.params.studentCode,
        req.params.courseCode,
      ]
    )
    conn.release()
    res.json({ success: true, message: "Enrollment updated successfully" })
  } catch (error) {
    console.error("Error updating enrollment:", error)
    res.status(500).json({ error: "Failed to update enrollment" })
  }
})

app.delete("/api/enrollments/:studentCode/:courseCode", async (req, res) => {
  try {
    const conn = await pool.getConnection()
    await conn.query(
      "DELETE FROM Enrollment WHERE Student_code = ? AND Course_code = ?",
      [req.params.studentCode, req.params.courseCode]
    )
    conn.release()
    res.json({ success: true, message: "Enrollment deleted successfully" })
  } catch (error) {
    console.error("Error deleting enrollment:", error)
    res.status(500).json({ error: "Failed to delete enrollment" })
  }
})

// ---------- Teacher View: All Lessons ----------
app.get("/api/teacher-view/lessons", async (req, res) => {
  try {
    const conn = await pool.getConnection()
    const [rows] = await conn.query(`
            SELECT 
                t.Teacher_code,
                t.Teacher_name,
                c.Course_code,
                c.Course_name,
                c.Credit,
                COUNT(e.Student_code) as total_students,
                GROUP_CONCAT(
                    CONCAT(s.Student_name, ' (', s.Student_code, ')')
                    ORDER BY s.Student_name
                    SEPARATOR ', '
                ) as students_list
            FROM Teacher t
            LEFT JOIN Enrollment e ON t.Teacher_code = e.Teacher_code
            LEFT JOIN Course c ON e.Course_code = c.Course_code
            LEFT JOIN Student s ON e.Student_code = s.Student_code
            GROUP BY t.Teacher_code, t.Teacher_name, c.Course_code, c.Course_name, c.Credit
            ORDER BY t.Teacher_name, c.Course_name
        `)
    conn.release()
    res.json(rows)
  } catch (error) {
    console.error("Error fetching teacher lessons view:", error)
    res.status(500).json({ error: "Failed to fetch teacher lessons" })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║     Student Lesson Management System                ║
║     Server running on http://localhost:${PORT}         ║
╚══════════════════════════════════════════════════════╝
    `)
})
