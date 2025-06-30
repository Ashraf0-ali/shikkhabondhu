
-- Add Google Gemini API key to api_keys table
INSERT INTO public.api_keys (provider, api_key, is_active) 
VALUES ('gemini', 'AIzaSyCarGJak93zvfbNL0WLB1z_v_5JA3DdnTE', true)
ON CONFLICT DO NOTHING;

-- Update board_questions table to include more subjects
UPDATE public.board_questions SET subject = 'বাংলা' WHERE subject = 'bangla';
UPDATE public.board_questions SET subject = 'ইংরেজি' WHERE subject = 'english';
UPDATE public.board_questions SET subject = 'গণিত' WHERE subject = 'math';
UPDATE public.board_questions SET subject = 'বিজ্ঞান' WHERE subject = 'science';

-- Add more subjects to board_questions if they don't exist
INSERT INTO public.board_questions (title, subject, board, year, file_type, file_url) VALUES
('নমুনা প্রশ্ন - পদার্থবিজ্ঞান', 'পদার্থবিজ্ঞান', 'ঢাকা', 2023, 'pdf', NULL),
('নমুনা প্রশ্ন - রসায়ন', 'রসায়ন', 'ঢাকা', 2023, 'pdf', NULL),
('নমুনা প্রশ্ন - জীববিজ্ঞান', 'জীববিজ্ঞান', 'ঢাকা', 2023, 'pdf', NULL),
('নমুনা প্রশ্ন - ইতিহাস', 'ইতিহাস', 'ঢাকা', 2023, 'pdf', NULL),
('নমুনা প্রশ্ন - ভূগোল', 'ভূগোল', 'ঢাকা', 2023, 'pdf', NULL),
('নমুনা প্রশ্ন - পৌরনীতি', 'পৌরনীতি', 'ঢাকা', 2023, 'pdf', NULL),
('নমুনা প্রশ্ন - অর্থনীতি', 'অর্থনীতি', 'ঢাকা', 2023, 'pdf', NULL),
('নমুনা প্রশ্ন - ইসলাম শিক্ষা', 'ইসলাম শিক্ষা', 'ঢাকা', 2023, 'pdf', NULL),
('নমুনা প্রশ্ন - হিন্দু ধর্ম', 'হিন্দু ধর্ম', 'ঢাকা', 2023, 'pdf', NULL),
('নমুনা প্রশ্ন - বৌদ্ধ ধর্ম', 'বৌদ্ধ ধর্ম', 'ঢাকা', 2023, 'pdf', NULL),
('নমুনা প্রশ্ন - খ্রিস্টান ধর্ম', 'খ্রিস্টান ধর্ম', 'ঢাকা', 2023, 'pdf', NULL),
('নমুনা প্রশ্ন - কৃষিশিক্ষা', 'কৃষিশিক্ষা', 'ঢাকা', 2023, 'pdf', NULL),
('নমুনা প্রশ্ন - গার্হস্থ্য বিজ্ঞান', 'গার্হস্থ্য বিজ্ঞান', 'ঢাকা', 2023, 'pdf', NULL)
ON CONFLICT (id) DO NOTHING;
