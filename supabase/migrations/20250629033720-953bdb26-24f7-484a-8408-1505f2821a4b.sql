
-- Make MCQ option columns optional (nullable)
ALTER TABLE public.mcq_questions 
ALTER COLUMN option_a DROP NOT NULL,
ALTER COLUMN option_b DROP NOT NULL,
ALTER COLUMN option_c DROP NOT NULL,
ALTER COLUMN option_d DROP NOT NULL;

-- Update the table comment to reflect the changes
COMMENT ON TABLE public.mcq_questions IS 'Table for storing both MCQ and descriptive questions. Options are optional for descriptive questions.';
