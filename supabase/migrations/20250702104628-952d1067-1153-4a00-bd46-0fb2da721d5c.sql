
-- Add class_level and admission_info columns to mcq_questions table
ALTER TABLE mcq_questions 
ADD COLUMN class_level VARCHAR(50),
ADD COLUMN admission_info JSONB DEFAULT '{}';

-- Update existing data to have proper class levels
UPDATE mcq_questions 
SET class_level = 'class_9_10' 
WHERE class_level IS NULL AND (subject LIKE '%নবম%' OR subject LIKE '%দশম%' OR year BETWEEN 2015 AND 2025);

UPDATE mcq_questions 
SET class_level = 'class_11_12' 
WHERE class_level IS NULL AND (subject LIKE '%একাদশ%' OR subject LIKE '%দ্বাদশ%' OR subject LIKE '%HSC%');

UPDATE mcq_questions 
SET class_level = 'admission' 
WHERE class_level IS NULL AND (subject LIKE '%admission%' OR subject LIKE '%ভর্তি%' OR board LIKE '%university%');

-- Create index for better performance
CREATE INDEX idx_mcq_class_level ON mcq_questions(class_level);
CREATE INDEX idx_mcq_admission_info ON mcq_questions USING GIN(admission_info);
