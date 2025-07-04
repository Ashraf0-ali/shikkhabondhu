import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

export const createSupabaseClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  return createClient(supabaseUrl, supabaseKey);
};

export const fetchBooks = async (supabase: any) => {
  console.log('Book request detected, searching database...');
  
  const { data: books } = await supabase
    .from('nctb_books')
    .select('*')
    .order('created_at', { ascending: false });

  console.log('Books found:', books?.length || 0);
  return books || [];
};

export const fetchEducationalData = async (supabase: any) => {
  const [mcqResult, boardResult, notesResult] = await Promise.all([
    supabase.from('mcq_questions').select('*').limit(20),
    supabase.from('board_questions').select('*').limit(10),
    supabase.from('notes').select('*').limit(10)
  ]);

  return {
    mcq: mcqResult.data || [],
    board: boardResult.data || [],
    notes: notesResult.data || []
  };
};