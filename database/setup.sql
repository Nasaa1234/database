-- =============================================
-- Student Lesson Management System Database
-- =============================================

-- =============================================
-- Student Lesson Management System Database
-- =============================================

-- Create database
CREATE DATABASE IF NOT EXISTS student_lesson_db;
USE student_lesson_db;








CREATE TABLE Major (
    Major_ID CHAR(2) PRIMARY KEY,
    Major_name VARCHAR(50) NOT NULL
);

CREATE TABLE Teacher (
    Teacher_code CHAR(4) PRIMARY KEY,
    Teacher_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    department VARCHAR(50)
);

CREATE TABLE Course (
    Course_code CHAR(5) PRIMARY KEY,
    Course_name VARCHAR(100) NOT NULL,
    Prerequisite CHAR(5),
    Credit INT NOT NULL,
    description TEXT,
    FOREIGN KEY (Prerequisite) REFERENCES Course(Course_code)
);

CREATE TABLE Student (
    Student_code CHAR(9) PRIMARY KEY,
    Student_name VARCHAR(50) NOT NULL,
    GPA DECIMAL(3, 2),
    Major_ID CHAR(2),
    email VARCHAR(100),
    enrollment_year INT,
    FOREIGN KEY (Major_ID) REFERENCES Major(Major_ID)
);

CREATE TABLE Enrollment (
    Student_code CHAR(9),
    Course_code CHAR(5),
    Teacher_code CHAR(4),
    enrollment_date DATE DEFAULT (CURRENT_DATE),
    grade VARCHAR(2),
    PRIMARY KEY (Student_code, Course_code),
    FOREIGN KEY (Student_code) REFERENCES Student(Student_code),
    FOREIGN KEY (Course_code) REFERENCES Course(Course_code),
    FOREIGN KEY (Teacher_code) REFERENCES Teacher(Teacher_code)
);










INSERT INTO Major (Major_ID, Major_name) VALUES
('CS', 'Computer Science'),
('EE', 'Electrical Engineering');



INSERT INTO Teacher (Teacher_code, Teacher_name, email, department) VALUES
('T001', 'Энхнаран', NULL, 'Computer Science'),
('T002', 'Уламбаяр', NULL, 'Computer Science'),
('T003', 'Ариунаа', NULL, 'Computer Science'),
('T004', 'Сүхболд', NULL, 'Computer Science'),
('T005', 'Хүрэлтулга', NULL, 'Computer Science'),
('T006', 'Ананд', NULL, 'Computer Science');



INSERT INTO Course (Course_code, Course_name, Prerequisite, Credit, description) VALUES
('C001', 'Веб зохиомж', NULL, 2, 'Веб зохиомжийн үндсэн мэдлэг'),
('C002', 'Өгөгдлийн систем', NULL, 1, 'Өгөгдлийн системийн үндсэн ойлголт'),
('C003', 'Англи хэл', NULL, 1, 'Англи хэлний чадвар сайжруулах'),
('C004', 'Инженерчлэлийн эдийн засаг', NULL, 2, 'Эдийн засгийн үндсэн ойлголт'),
('C005', 'Өгөгдлийн шинжилгээ', NULL, 3, 'Өгөгдөл боловсруулах, шинжлэх'),
('C006', 'Алгоритм', NULL, 2, 'Алгоритм боловсруулах үндэс');



INSERT INTO Student (Student_code, Student_name, GPA, Major_ID, email, enrollment_year) VALUES
('B214180086','Бат',NULL,'CS',NULL,2022),
('M244810070','Болд',NULL,'CS',NULL,2022),
('M147320046','Саруул',NULL,'CS',NULL,2022),
('M143990081','Энхбат',NULL,'CS',NULL,2022),
('B103220032','Ганболд',NULL,'CS',NULL,2022),
('B197770018','Баяр',NULL,'CS',NULL,2022),
('M248890025','Мөнх',NULL,'CS',NULL,2022),
('M135840037','Од',NULL,'CS',NULL,2022),
('B163590003','Амгалан',NULL,'CS',NULL,2022),
('B188350088','Номин',NULL,'CS',NULL,2022),
('B185520055','Цэнгэл',NULL,'CS',NULL,2022),
('M113780006','Хулан',NULL,'CS',NULL,2022),
('B187250007','Энхтуяа',NULL,'CS',NULL,2022),
('B142870036','Сүхбат',NULL,'CS',NULL,2022),
('M153840038','Ариун',NULL,'CS',NULL,2022),
('M148450036','Цэрэн',NULL,'CS',NULL,2022),
('M148180073','Бадам',NULL,'CS',NULL,2022);





INSERT INTO Enrollment (Student_code, Course_code, Teacher_code, enrollment_date) VALUES
('B214180086','C001','T001',CURRENT_DATE),
('B214180086','C002','T002',CURRENT_DATE),
('B214180086','C005','T005',CURRENT_DATE),
('B214180086','C006','T006',CURRENT_DATE);









-- Useful Views
-- =============================================

-- View: Course with enrollment count
CREATE VIEW course_enrollment_summary AS
SELECT 
    c.Course_code,
    c.Course_name,
    c.Credit,
    COUNT(e.Student_code) as enrolled_students
FROM Course c
LEFT JOIN Enrollment e ON c.Course_code = e.Course_code
GROUP BY c.Course_code, c.Course_name, c.Credit;

-- View: Teacher's courses with students
CREATE VIEW teacher_course_students AS
SELECT 
    t.Teacher_code,
    t.Teacher_name,
    c.Course_code,
    c.Course_name,
    s.Student_code,
    s.Student_name,
    e.grade
FROM Teacher t
JOIN Enrollment e ON t.Teacher_code = e.Teacher_code
JOIN Course c ON e.Course_code = c.Course_code
JOIN Student s ON e.Student_code = s.Student_code
ORDER BY t.Teacher_name, c.Course_name, s.Student_name;

