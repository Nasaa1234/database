const API = "http://localhost:3000/api"

// Current page
let currentPage = "students"

// Init
document.addEventListener("DOMContentLoaded", () => {
  // Nav buttons
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".nav-btn")
        .forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
      currentPage = btn.dataset.page
      loadPage(currentPage)
    })
  })

  loadPage("students")
})

// Load page
function loadPage(page) {
  const content = document.getElementById("content")
  content.innerHTML = '<div class="loading">Loading...</div>'

  switch (page) {
    case "students":
      loadStudents()
      break
    case "teachers":
      loadTeachers()
      break
    case "courses":
      loadCourses()
      break
    case "enrollments":
      loadEnrollments()
      break
  }
}

// ========== STUDENTS ==========
async function loadStudents() {
  try {
    const [students, majors] = await Promise.all([
      fetch(`${API}/students`).then((r) => r.json()),
      fetch(`${API}/majors`).then((r) => r.json()),
    ])

    const majorOptions = majors
      .map((m) => `<option value="${m.Major_ID}">${m.Major_name}</option>`)
      .join("")

    document.getElementById("content").innerHTML = `
            <h2 class="section-title">Students</h2>
            
            <div class="form-section">
                <h3>Add Student</h3>
                <form id="studentForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Code</label>
                            <input name="Student_code" placeholder="STU000001" required>
                        </div>
                        <div class="form-group">
                            <label>Name</label>
                            <input name="Student_name" placeholder="John Doe" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input name="email" type="email" placeholder="john@email.com">
                        </div>
                        <div class="form-group">
                            <label>Major</label>
                            <select name="Major_ID">
                                <option value="">Select Major</option>
                                ${majorOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>GPA</label>
                            <input name="GPA" type="number" step="0.01" min="0" max="4" placeholder="3.5">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Student</button>
                </form>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Major</th>
                        <th>GPA</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${
                      students.length
                        ? students
                            .map(
                              (s) => `
                        <tr>
                            <td>${s.Student_code}</td>
                            <td>${s.Student_name}</td>
                            <td>${s.email || "-"}</td>
                            <td>${s.Major_name || "-"}</td>
                            <td>${s.GPA || "-"}</td>
                            <td class="actions">
                                <button class="btn btn-danger btn-sm" onclick="deleteStudent('${
                                  s.Student_code
                                }')">Delete</button>
                            </td>
                        </tr>
                    `
                            )
                            .join("")
                        : '<tr><td colspan="6" class="empty">No students found</td></tr>'
                    }
                </tbody>
            </table>
        `

    document.getElementById("studentForm").onsubmit = async (e) => {
      e.preventDefault()
      const data = Object.fromEntries(new FormData(e.target))
      const res = await fetch(`${API}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        loadStudents()
      } else {
        alert("Failed to add student")
      }
    }
  } catch (e) {
    document.getElementById("content").innerHTML =
      '<div class="empty">Failed to load students</div>'
  }
}

async function deleteStudent(code) {
  if (!confirm("Delete this student?")) return
  await fetch(`${API}/students/${code}`, { method: "DELETE" })
  loadStudents()
}

// ========== TEACHERS ==========
async function loadTeachers() {
  try {
    const teachers = await fetch(`${API}/teachers`).then((r) => r.json())

    document.getElementById("content").innerHTML = `
            <h2 class="section-title">Teachers</h2>
            
            <div class="form-section">
                <h3>Add Teacher</h3>
                <form id="teacherForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Code</label>
                            <input name="Teacher_code" placeholder="T001" required maxlength="4">
                        </div>
                        <div class="form-group">
                            <label>Name</label>
                            <input name="Teacher_name" placeholder="Dr. Smith" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input name="email" type="email" placeholder="smith@edu.com">
                        </div>
                        <div class="form-group">
                            <label>Department</label>
                            <input name="department" placeholder="Computer Science">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Teacher</button>
                </form>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${
                      teachers.length
                        ? teachers
                            .map(
                              (t) => `
                        <tr>
                            <td>${t.Teacher_code}</td>
                            <td>${t.Teacher_name}</td>
                            <td>${t.email || "-"}</td>
                            <td>${t.department || "-"}</td>
                            <td class="actions">
                                <button class="btn btn-danger btn-sm" onclick="deleteTeacher('${
                                  t.Teacher_code
                                }')">Delete</button>
                            </td>
                        </tr>
                    `
                            )
                            .join("")
                        : '<tr><td colspan="5" class="empty">No teachers found</td></tr>'
                    }
                </tbody>
            </table>
        `

    document.getElementById("teacherForm").onsubmit = async (e) => {
      e.preventDefault()
      const data = Object.fromEntries(new FormData(e.target))
      const res = await fetch(`${API}/teachers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        loadTeachers()
      } else {
        alert("Failed to add teacher")
      }
    }
  } catch (e) {
    document.getElementById("content").innerHTML =
      '<div class="empty">Failed to load teachers</div>'
  }
}

async function deleteTeacher(code) {
  if (!confirm("Delete this teacher?")) return
  await fetch(`${API}/teachers/${code}`, { method: "DELETE" })
  loadTeachers()
}

// ========== COURSES ==========
async function loadCourses() {
  try {
    const courses = await fetch(`${API}/courses`).then((r) => r.json())

    const courseOptions = courses
      .map(
        (c) =>
          `<option value="${c.Course_code}">${c.Course_code} - ${c.Course_name}</option>`
      )
      .join("")

    document.getElementById("content").innerHTML = `
            <h2 class="section-title">Courses</h2>
            
            <div class="form-section">
                <h3>Add Course</h3>
                <form id="courseForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Code</label>
                            <input name="Course_code" placeholder="CS101" required maxlength="5">
                        </div>
                        <div class="form-group">
                            <label>Name</label>
                            <input name="Course_name" placeholder="Introduction to Programming" required>
                        </div>
                        <div class="form-group">
                            <label>Credits</label>
                            <input name="Credit" type="number" min="1" max="6" placeholder="3" required>
                        </div>
                        <div class="form-group">
                            <label>Prerequisite</label>
                            <select name="Prerequisite">
                                <option value="">None</option>
                                ${courseOptions}
                            </select>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Course</button>
                </form>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Credits</th>
                        <th>Prerequisite</th>
                        <th>Enrolled</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${
                      courses.length
                        ? courses
                            .map(
                              (c) => `
                        <tr>
                            <td><span class="badge badge-blue">${
                              c.Course_code
                            }</span></td>
                            <td>${c.Course_name}</td>
                            <td>${c.Credit}</td>
                            <td>${c.Prerequisite_name || "-"}</td>
                            <td><span class="badge badge-green">${
                              c.enrolled_count || 0
                            }</span></td>
                            <td class="actions">
                                <button class="btn btn-danger btn-sm" onclick="deleteCourse('${
                                  c.Course_code
                                }')">Delete</button>
                            </td>
                        </tr>
                    `
                            )
                            .join("")
                        : '<tr><td colspan="6" class="empty">No courses found</td></tr>'
                    }
                </tbody>
            </table>
        `

    document.getElementById("courseForm").onsubmit = async (e) => {
      e.preventDefault()
      const data = Object.fromEntries(new FormData(e.target))
      const res = await fetch(`${API}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        loadCourses()
      } else {
        alert("Failed to add course")
      }
    }
  } catch (e) {
    document.getElementById("content").innerHTML =
      '<div class="empty">Failed to load courses</div>'
  }
}

async function deleteCourse(code) {
  if (!confirm("Delete this course?")) return
  await fetch(`${API}/courses/${code}`, { method: "DELETE" })
  loadCourses()
}

// ========== ENROLLMENTS ==========
async function loadEnrollments() {
  try {
    const [enrollments, students, courses, teachers] = await Promise.all([
      fetch(`${API}/enrollments`).then((r) => r.json()),
      fetch(`${API}/students`).then((r) => r.json()),
      fetch(`${API}/courses`).then((r) => r.json()),
      fetch(`${API}/teachers`).then((r) => r.json()),
    ])

    document.getElementById("content").innerHTML = `
            <h2 class="section-title">Enrollments</h2>
            
            <div class="form-section">
                <h3>Add Enrollment</h3>
                <form id="enrollmentForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Student</label>
                            <select name="Student_code" required>
                                <option value="">Select Student</option>
                                ${students
                                  .map(
                                    (s) =>
                                      `<option value="${s.Student_code}">${s.Student_code} - ${s.Student_name}</option>`
                                  )
                                  .join("")}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Course</label>
                            <select name="Course_code" required>
                                <option value="">Select Course</option>
                                ${courses
                                  .map(
                                    (c) =>
                                      `<option value="${c.Course_code}">${c.Course_code} - ${c.Course_name}</option>`
                                  )
                                  .join("")}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Teacher</label>
                            <select name="Teacher_code" required>
                                <option value="">Select Teacher</option>
                                ${teachers
                                  .map(
                                    (t) =>
                                      `<option value="${t.Teacher_code}">${t.Teacher_code} - ${t.Teacher_name}</option>`
                                  )
                                  .join("")}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Grade</label>
                            <select name="grade">
                                <option value="">Pending</option>
                                <option value="A">A</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B">B</option>
                                <option value="B-">B-</option>
                                <option value="C+">C+</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="F">F</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Enrollment</button>
                </form>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Teacher</th>
                        <th>Grade</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${
                      enrollments.length
                        ? enrollments
                            .map(
                              (e) => `
                        <tr>
                            <td>${
                              e.Student_name
                            }<br><small style="color:#999">${
                                e.Student_code
                              }</small></td>
                            <td><span class="badge badge-blue">${
                              e.Course_code
                            }</span> ${e.Course_name}</td>
                            <td>${e.Teacher_name}</td>
                            <td>${
                              e.grade
                                ? `<span class="badge badge-green">${e.grade}</span>`
                                : '<span class="badge badge-orange">Pending</span>'
                            }</td>
                            <td class="actions">
                                <button class="btn btn-danger btn-sm" onclick="deleteEnrollment('${
                                  e.Student_code
                                }', '${e.Course_code}')">Delete</button>
                            </td>
                        </tr>
                    `
                            )
                            .join("")
                        : '<tr><td colspan="5" class="empty">No enrollments found</td></tr>'
                    }
                </tbody>
            </table>
        `

    document.getElementById("enrollmentForm").onsubmit = async (e) => {
      e.preventDefault()
      const data = Object.fromEntries(new FormData(e.target))
      const res = await fetch(`${API}/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        loadEnrollments()
      } else {
        alert("Failed to add enrollment")
      }
    }
  } catch (e) {
    document.getElementById("content").innerHTML =
      '<div class="empty">Failed to load enrollments</div>'
  }
}

async function deleteEnrollment(studentCode, courseCode) {
  if (!confirm("Delete this enrollment?")) return
  await fetch(`${API}/enrollments/${studentCode}/${courseCode}`, {
    method: "DELETE",
  })
  loadEnrollments()
}
