-- Supabase database schema for Students & Classes application
-- Run this SQL in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Students table
CREATE TABLE students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name VARCHAR(64) NOT NULL,
    last_name VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Classes table  
CREATE TABLE classes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Many-to-many relationship table for class assignments
CREATE TABLE class_assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    -- Ensure a student can only be assigned to a class once
    UNIQUE(student_id, class_id)
);

-- Indexes for better performance
CREATE INDEX idx_students_name ON students(last_name, first_name);
CREATE INDEX idx_classes_name ON classes(name);
CREATE INDEX idx_class_assignments_student ON class_assignments(student_id);
CREATE INDEX idx_class_assignments_class ON class_assignments(class_id);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data (optional)
INSERT INTO students (first_name, last_name) VALUES
    ('Ada', 'Lovelace'),
    ('Alan', 'Turing'),
    ('Grace', 'Hopper'),
    ('Katherine', 'Johnson'),
    ('Margaret', 'Hamilton');

INSERT INTO classes (name, description) VALUES
    ('Mathematics 101', 'Introduction to algebra and basic mathematical concepts'),
    ('Computer Science Fundamentals', 'Basic programming concepts and computational thinking'),
    ('Physics for Beginners', 'Classical mechanics and fundamental physics principles'),
    ('Literature & Writing', 'Creative writing and literary analysis'),
    ('History of Science', 'Evolution of scientific thought through the ages');

-- Enable Row Level Security (RLS) for production
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_assignments ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (adjust as needed for your security requirements)
CREATE POLICY "Enable all operations for authenticated users" ON students FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON classes FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON class_assignments FOR ALL TO authenticated USING (true);

-- For development without auth, you can allow public access (NOT recommended for production)
-- CREATE POLICY "Enable all operations for public" ON students FOR ALL TO anon USING (true);
-- CREATE POLICY "Enable all operations for public" ON classes FOR ALL TO anon USING (true);
-- CREATE POLICY "Enable all operations for public" ON class_assignments FOR ALL TO anon USING (true);
