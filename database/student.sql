USE student_lesson_db;



select * from Major;
drop table Major;
drop table Course;
drop table Enrollment;


CREATE TABLE student_excel_import (
    student_name     VARCHAR(50),
    gender           VARCHAR(10),
    region           VARCHAR(100),
    register_no      VARCHAR(20),
    birth_date       DATE,
    age              INT,
    teacher_id       INT,
    student_code     CHAR(9),

    c1 TINYINT,
    c2 TINYINT,
    c3 TINYINT,
    c4 TINYINT,
    c5 TINYINT,
    c6 TINYINT,
    c7 TINYINT,
    c8 TINYINT,
    c9 TINYINT,
    c10 TINYINT,

    total_courses INT,
    total_credits INT
);

SHOW VARIABLES LIKE 'local_infile';
SET GLOBAL local_infile = 1;

LOAD DATA LOCAL INFILE '/Users/nasanbatg/Desktop/lessons/other_biydaalt/mishel/clean_students.csv'
INTO TABLE student_excel_import
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

INSERT INTO Student (
    Student_code,
    Student_name,
    GPA,
    Major_ID,
    email,
    enrollment_year
)
SELECT
    student_code,
    student_name,
    NULL,              -- GPA not in Excel
    'CS',              -- default (change if needed)
    NULL,              -- email not in Excel
    YEAR(birth_date)   -- enrollment year estimate
FROM student_excel_import;

SELECT * FROM Student LIMIT 10;