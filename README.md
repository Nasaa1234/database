# EduAdmin - Student Lesson Management System

A beautiful, modern admin dashboard for managing students, teachers, courses, and enrollments.

![Dark Theme](https://img.shields.io/badge/Theme-Dark%20%26%20Light-orange)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)

## Features

- 📊 **Dashboard** - Overview statistics and course cards
- 📚 **Courses Management** - Add, edit, delete courses with prerequisites
- 👨‍🎓 **Students Management** - Full CRUD operations for students
- 👨‍🏫 **Teachers Management** - Manage faculty and instructors
- 📝 **Enrollments** - Register students to courses with grades
- 👁️ **Teacher View** - Special view showing all lessons and enrolled students per teacher
- 🌙 **Dark/Light Theme** - Toggle between themes
- 🔍 **Search** - Filter tables in real-time

## Prerequisites

- Node.js 18 or higher
- MySQL 8.0 or higher

## Installation

### 1. Clone or Download the Project

```bash
cd mishel
```

### 2. Set Up the Database

Open MySQL and run the setup script:

```bash
mysql -u root -p < database/setup.sql
```

Or open MySQL Workbench/CLI and paste the contents of `database/setup.sql`.

### 3. Configure Database Connection

Edit `server.js` and update the database configuration if needed:

```javascript
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "", // Add your MySQL password here
  database: "student_lesson_db",
}
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

### 6. Open the Application

Navigate to: **http://localhost:3000**

## Project Structure

```
mishel/
├── database/
│   └── setup.sql          # Database schema and sample data
├── public/
│   ├── index.html         # Main HTML file
│   ├── styles.css         # CSS styling
│   └── app.js            # Frontend JavaScript
├── server.js             # Express.js backend
├── package.json          # Node.js dependencies
└── README.md             # This file
```

## Database Schema

### Tables

- **Major** - Academic majors/departments
- **Teacher** - Faculty information
- **Course** - Course catalog with prerequisites
- **Student** - Student records with GPA
- **Enrollment** - Student-Course-Teacher relationships

### Entity Relationship

```
Major (1) ──── (N) Student (N) ──── (N) Course
                        │                │
                        └──── Enrollment ────┘
                                │
                                └──── Teacher
```

## API Endpoints

### Statistics

- `GET /api/stats` - Dashboard statistics

### Majors

- `GET /api/majors` - List all majors
- `POST /api/majors` - Create a major
- `DELETE /api/majors/:id` - Delete a major

### Teachers

- `GET /api/teachers` - List all teachers
- `POST /api/teachers` - Create a teacher
- `PUT /api/teachers/:code` - Update a teacher
- `DELETE /api/teachers/:code` - Delete a teacher
- `GET /api/teachers/:code/courses` - Get teacher's courses

### Courses

- `GET /api/courses` - List all courses
- `POST /api/courses` - Create a course
- `PUT /api/courses/:code` - Update a course
- `DELETE /api/courses/:code` - Delete a course
- `GET /api/courses/:code/students` - Get enrolled students

### Students

- `GET /api/students` - List all students
- `POST /api/students` - Create a student
- `PUT /api/students/:code` - Update a student
- `DELETE /api/students/:code` - Delete a student
- `GET /api/students/:code/courses` - Get student's courses

### Enrollments

- `GET /api/enrollments` - List all enrollments
- `POST /api/enrollments` - Create an enrollment
- `PUT /api/enrollments/:studentCode/:courseCode` - Update enrollment
- `DELETE /api/enrollments/:studentCode/:courseCode` - Delete enrollment

### Teacher View

- `GET /api/teacher-view/lessons` - All lessons grouped by teacher

## Screenshots

### Dashboard

The dashboard shows:

- Total students, teachers, courses, and enrollments
- Course cards with enrollment counts

### Teacher View

Special page showing:

- All courses taught by each teacher
- List of enrolled students for each course
- Summary statistics per teacher

## Customization

### Changing Theme Colors

Edit the CSS variables in `public/styles.css`:

```css
:root {
  --accent-primary: #f59e0b; /* Main accent color */
  --accent-secondary: #fbbf24; /* Secondary accent */
  --accent-tertiary: #d97706; /* Darker accent */
}
```

### Adding New Features

1. Add API endpoint in `server.js`
2. Add frontend page function in `public/app.js`
3. Add navigation item in `public/index.html`

## Troubleshooting

### Cannot connect to database

- Ensure MySQL is running
- Check credentials in `server.js`
- Verify database exists: `SHOW DATABASES;`

### Port 3000 already in use

Change the port in `server.js`:

```javascript
const PORT = 3001 // or any available port
```

### Missing tables

Re-run the setup script:

```bash
mysql -u root -p student_lesson_db < database/setup.sql
```

## License

MIT License - feel free to use for educational purposes.
# database
