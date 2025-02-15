ALTER TABLE students
ADD COLUMN enrollment_year INTEGER;

UPDATE students
set enrollment_year = enrollments.year
FROM enrollments
WHERE students.id = enrollments.student_id;
