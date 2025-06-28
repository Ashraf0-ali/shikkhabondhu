
-- Create only the missing tables and update existing ones if needed

-- Check if board_questions table needs updates (it already exists)
-- Add missing columns to existing board_questions table if needed
DO $$ 
BEGIN
    -- Add seo_title column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'board_questions' AND column_name = 'seo_title') THEN
        ALTER TABLE public.board_questions ADD COLUMN seo_title TEXT;
    END IF;
    
    -- Add seo_description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'board_questions' AND column_name = 'seo_description') THEN
        ALTER TABLE public.board_questions ADD COLUMN seo_description TEXT;
    END IF;
    
    -- Add seo_tags column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'board_questions' AND column_name = 'seo_tags') THEN
        ALTER TABLE public.board_questions ADD COLUMN seo_tags TEXT;
    END IF;
END $$;

-- Check if mcq_questions table needs updates (it already exists)
-- Add missing columns to existing mcq_questions table if needed
DO $$ 
BEGIN
    -- Add chapter column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mcq_questions' AND column_name = 'chapter') THEN
        ALTER TABLE public.mcq_questions ADD COLUMN chapter TEXT;
    END IF;
END $$;

-- Check if nctb_books table needs updates (it already exists)
-- Add missing columns to existing nctb_books table if needed
DO $$ 
BEGIN
    -- Add seo_title column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'nctb_books' AND column_name = 'seo_title') THEN
        ALTER TABLE public.nctb_books ADD COLUMN seo_title TEXT;
    END IF;
    
    -- Add seo_description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'nctb_books' AND column_name = 'seo_description') THEN
        ALTER TABLE public.nctb_books ADD COLUMN seo_description TEXT;
    END IF;
    
    -- Add seo_tags column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'nctb_books' AND column_name = 'seo_tags') THEN
        ALTER TABLE public.nctb_books ADD COLUMN seo_tags TEXT;
    END IF;
END $$;

-- Check if notes table needs updates (it already exists)
-- Add missing columns to existing notes table if needed
DO $$ 
BEGIN
    -- Add seo_title column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'seo_title') THEN
        ALTER TABLE public.notes ADD COLUMN seo_title TEXT;
    END IF;
    
    -- Add seo_description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'seo_description') THEN
        ALTER TABLE public.notes ADD COLUMN seo_description TEXT;
    END IF;
    
    -- Add seo_tags column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'seo_tags') THEN
        ALTER TABLE public.notes ADD COLUMN seo_tags TEXT;
    END IF;
END $$;

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_mcq_subject ON public.mcq_questions(subject);
CREATE INDEX IF NOT EXISTS idx_mcq_year ON public.mcq_questions(year);
CREATE INDEX IF NOT EXISTS idx_mcq_board ON public.mcq_questions(board);
CREATE INDEX IF NOT EXISTS idx_board_questions_subject_year ON public.board_questions(subject, year);
CREATE INDEX IF NOT EXISTS idx_nctb_books_class_subject ON public.nctb_books(class_level, subject);
CREATE INDEX IF NOT EXISTS idx_notes_subject ON public.notes(subject);

-- Enable Row Level Security (RLS) on existing tables
ALTER TABLE public.mcq_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nctb_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motivational_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tips_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (only if they don't exist)
DO $$ 
BEGIN
    -- MCQ Questions policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mcq_questions' AND policyname = 'Anyone can view MCQ questions') THEN
        EXECUTE 'CREATE POLICY "Anyone can view MCQ questions" ON public.mcq_questions FOR SELECT USING (true)';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mcq_questions' AND policyname = 'Admin can manage MCQ questions') THEN
        EXECUTE 'CREATE POLICY "Admin can manage MCQ questions" ON public.mcq_questions FOR ALL USING (true)';
    END IF;
    
    -- Board Questions policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'board_questions' AND policyname = 'Anyone can view board questions') THEN
        EXECUTE 'CREATE POLICY "Anyone can view board questions" ON public.board_questions FOR SELECT USING (true)';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'board_questions' AND policyname = 'Admin can manage board questions') THEN
        EXECUTE 'CREATE POLICY "Admin can manage board questions" ON public.board_questions FOR ALL USING (true)';
    END IF;
    
    -- NCTB Books policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'nctb_books' AND policyname = 'Anyone can view NCTB books') THEN
        EXECUTE 'CREATE POLICY "Anyone can view NCTB books" ON public.nctb_books FOR SELECT USING (true)';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'nctb_books' AND policyname = 'Admin can manage NCTB books') THEN
        EXECUTE 'CREATE POLICY "Admin can manage NCTB books" ON public.nctb_books FOR ALL USING (true)';
    END IF;
    
    -- Notes policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notes' AND policyname = 'Anyone can view notes') THEN
        EXECUTE 'CREATE POLICY "Anyone can view notes" ON public.notes FOR SELECT USING (true)';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notes' AND policyname = 'Admin can manage notes') THEN
        EXECUTE 'CREATE POLICY "Admin can manage notes" ON public.notes FOR ALL USING (true)';
    END IF;
    
    -- Motivational Quotes policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'motivational_quotes' AND policyname = 'Anyone can view active quotes') THEN
        EXECUTE 'CREATE POLICY "Anyone can view active quotes" ON public.motivational_quotes FOR SELECT USING (is_active = true)';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'motivational_quotes' AND policyname = 'Admin can manage quotes') THEN
        EXECUTE 'CREATE POLICY "Admin can manage quotes" ON public.motivational_quotes FOR ALL USING (true)';
    END IF;
    
    -- API Keys policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'api_keys' AND policyname = 'Admin can manage API keys') THEN
        EXECUTE 'CREATE POLICY "Admin can manage API keys" ON public.api_keys FOR ALL USING (true)';
    END IF;
    
    -- Tips Feedback policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tips_feedback' AND policyname = 'Anyone can view tips') THEN
        EXECUTE 'CREATE POLICY "Anyone can view tips" ON public.tips_feedback FOR SELECT USING (is_active = true)';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tips_feedback' AND policyname = 'Admin can manage tips') THEN
        EXECUTE 'CREATE POLICY "Admin can manage tips" ON public.tips_feedback FOR ALL USING (true)';
    END IF;
END $$;
