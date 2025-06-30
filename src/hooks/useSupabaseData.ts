
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

// Type definitions for our data
type MCQQuestion = Tables<'mcq_questions'>;
type BoardQuestion = Tables<'board_questions'>;
type NCTBBook = Tables<'nctb_books'>;
type Note = Tables<'notes'>;
type MotivationalQuote = Tables<'motivational_quotes'>;
type ApiKey = Tables<'api_keys'>;
type TipsFeedback = Tables<'tips_feedback'>;

export const useSupabaseData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // MCQ Questions
  const addMCQQuestion = useMutation({
    mutationFn: async (data: TablesInsert<'mcq_questions'>) => {
      const { error } = await supabase
        .from('mcq_questions')
        .insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate all related queries to refresh data everywhere
      queryClient.invalidateQueries({ queryKey: ['mcq_questions'] });
      queryClient.invalidateQueries({ queryKey: ['chat_context'] });
      queryClient.invalidateQueries({ queryKey: ['all_questions'] });
      
      toast({
        title: "MCQ যুক্ত হয়েছে ✅",
        description: "নতুন MCQ সফলভাবে যুক্ত হয়েছে এবং চ্যাটবটে উপলব্ধ",
      });
    },
    onError: (error) => {
      console.error('MCQ add error:', error);
      toast({
        title: "Error ❌",
        description: "MCQ যুক্ত করতে সমস্যা হয়েছে",
        variant: "destructive"
      });
    }
  });

  // Board Questions
  const addBoardQuestion = useMutation({
    mutationFn: async (data: TablesInsert<'board_questions'>) => {
      const { error } = await supabase
        .from('board_questions')
        .insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board_questions'] });
      queryClient.invalidateQueries({ queryKey: ['chat_context'] });
      
      toast({
        title: "বোর্ড প্রশ্ন যুক্ত হয়েছে ✅",
        description: "নতুন বোর্ড প্রশ্ন সফলভাবে যুক্ত হয়েছে এবং চ্যাটবটে উপলব্ধ",
      });
    },
    onError: (error) => {
      console.error('Board question add error:', error);
      toast({
        title: "Error ❌",
        description: "বোর্ড প্রশ্ন যুক্ত করতে সমস্যা হয়েছে",
        variant: "destructive"
      });
    }
  });

  // NCTB Books
  const addNCTBBook = useMutation({
    mutationFn: async (data: TablesInsert<'nctb_books'>) => {
      const { error } = await supabase
        .from('nctb_books')
        .insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nctb_books'] });
      queryClient.invalidateQueries({ queryKey: ['chat_context'] });
      
      toast({
        title: "NCTB বই যুক্ত হয়েছে ✅",
        description: "নতুন NCTB বই সফলভাবে যুক্ত হয়েছে এবং চ্যাটবটে উপলব্ধ",
      });
    },
    onError: (error) => {
      console.error('NCTB book add error:', error);
      toast({
        title: "Error ❌",
        description: "NCTB বই যুক্ত করতে সমস্যা হয়েছে",
        variant: "destructive"
      });
    }
  });

  // Notes
  const addNote = useMutation({
    mutationFn: async (data: TablesInsert<'notes'>) => {
      const { error } = await supabase
        .from('notes')
        .insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['chat_context'] });
      
      toast({
        title: "নোট যুক্ত হয়েছে ✅",
        description: "নতুন নোট সফলভাবে যুক্ত হয়েছে এবং চ্যাটবটে উপলব্ধ",
      });
    },
    onError: (error) => {
      console.error('Note add error:', error);
      toast({
        title: "Error ❌",
        description: "নোট যুক্ত করতে সমস্যা হয়েছে",
        variant: "destructive"
      });
    }
  });

  // Motivational Quotes
  const addMotivationalQuote = useMutation({
    mutationFn: async (data: TablesInsert<'motivational_quotes'>) => {
      const { error } = await supabase
        .from('motivational_quotes')
        .insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motivational_quotes'] });
      
      toast({
        title: "উদ্দীপনামূলক উক্তি যুক্ত হয়েছে ✅",
        description: "নতুন উক্তি সফলভাবে যুক্ত হয়েছে",
      });
    },
    onError: (error) => {
      console.error('Quote add error:', error);
      toast({
        title: "Error ❌",
        description: "উক্তি যুক্ত করতে সমস্যা হয়েছে",
        variant: "destructive"
      });
    }
  });

  // API Keys
  const addApiKey = useMutation({
    mutationFn: async (data: TablesInsert<'api_keys'>) => {
      const { error } = await supabase
        .from('api_keys')
        .insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api_keys'] });
      
      toast({
        title: "API Key সংরক্ষিত ✅",
        description: "API Key সফলভাবে সংরক্ষিত হয়েছে",
      });
    },
    onError: (error) => {
      console.error('API key add error:', error);
      toast({
        title: "Error ❌",
        description: "API Key সংরক্ষণ করতে সমস্যা হয়েছে",
        variant: "destructive"
      });
    }
  });

  // Bulk MCQ import
  const importMCQsFromCSV = useMutation({
    mutationFn: async (mcqs: TablesInsert<'mcq_questions'>[]) => {
      const { error } = await supabase
        .from('mcq_questions')
        .insert(mcqs);
      if (error) throw error;
      return mcqs.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['mcq_questions'] });
      queryClient.invalidateQueries({ queryKey: ['chat_context'] });
      
      toast({
        title: `${count}টি MCQ ইমপোর্ট হয়েছে ✅`,
        description: "CSV থেকে MCQ সফলভাবে ইমপোর্ট হয়েছে এবং চ্যাটবটে উপলব্ধ",
      });
    },
    onError: (error) => {
      console.error('CSV import error:', error);
      toast({
        title: "Import Error ❌",
        description: "CSV ইমপোর্ট করতে সমস্যা হয়েছে",
        variant: "destructive"
      });
    }
  });

  const handleMCQAdd = () => {
    // This function will be called from the component
  };

  const handleFileUpload = () => {
    // This function will be called from the component
  };

  const handleQuoteAdd = () => {
    // This function will be called from the component
  };

  const handleApiKeyAdd = () => {
    // This function will be called from the component
  };

  return {
    addMCQQuestion,
    addBoardQuestion,
    addNCTBBook,
    addNote,
    addMotivationalQuote,
    addApiKey,
    importMCQsFromCSV,
    handleMCQAdd,
    handleFileUpload,
    handleQuoteAdd,
    handleApiKeyAdd
  };
};
