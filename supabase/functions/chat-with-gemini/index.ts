
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      console.error('Gemini API key not found in environment variables');
      return new Response(JSON.stringify({ 
        error: 'AI সেবা বর্তমানে উপলব্ধ নয়। পরে আবার চেষ্টা করুন।',
        details: 'GEMINI_API_KEY not configured'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ 
        error: 'অনুগ্রহ করে একটি বার্তা লিখুন।' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching context from database...');

    // Fetch comprehensive context from database
    const [mcqResult, boardResult, nctbResult, notesResult] = await Promise.all([
      supabase.from('mcq_questions').select('*').limit(50),
      supabase.from('board_questions').select('*').limit(20),
      supabase.from('nctb_books').select('*').order('created_at', { ascending: false }).limit(10),
      supabase.from('notes').select('*').limit(15)
    ]);

    console.log('Database context fetched:', {
      mcq: mcqResult.data?.length || 0,
      board: boardResult.data?.length || 0,
      nctb: nctbResult.data?.length || 0,
      notes: notesResult.data?.length || 0
    });

    // Enhanced context with focus on direct answers
    let context = `আপনি একজন অভিজ্ঞ বাংলাদেশি শিক্ষক এবং AI সহায়ক। আপনার কাজ হলো ছাত্রছাত্রীদের প্রশ্নের সরাসরি ও স্পষ্ট উত্তর দেওয়া।

🎯 গুরুত্বপূর্ণ নির্দেশনা:
- শিক্ষার্থী যা জিজ্ঞেস করবে, ঠিক সেটারই উত্তর দিন
- অপ্রয়োজনীয় লিংক বা অতিরিক্ত তথ্য দেবেন না
- MCQ চাইলে সরাসরি MCQ দিন
- সমাধান চাইলে সরাসরি সমাধান দিন
- ব্যাখ্যা সহজ ও সংক্ষিপ্ত রাখুন

🎓 আপনার বিশেষত্ব:
- MCQ প্রশ্ন ও উত্তর বিশ্লেষণ
- বোর্ড প্রশ্ন প্যাটার্ন
- NCTB বই কন্টেন্ট
- পাঠ্যবই সমাধান

📚 উপলব্ধ ডেটা:
- MCQ প্রশ্ন: ${mcqResult.data?.length || 0}টি
- বোর্ড প্রশ্ন: ${boardResult.data?.length || 0}টি  
- NCTB বই: ${nctbResult.data?.length || 0}টি
- নোট: ${notesResult.data?.length || 0}টি`;

    // Add MCQ examples if user asks about MCQ
    if (message.toLowerCase().includes('mcq') || message.toLowerCase().includes('এমসিকিউ')) {
      if (mcqResult.data && mcqResult.data.length > 0) {
        context += `\n\n📊 MCQ উদাহরণ:`;
        mcqResult.data.slice(0, 5).forEach((mcq, index) => {
          context += `\n\n${index + 1}. ${mcq.question}`;
          if (mcq.option_a) context += `\na) ${mcq.option_a}`;
          if (mcq.option_b) context += `\nb) ${mcq.option_b}`;
          if (mcq.option_c) context += `\nc) ${mcq.option_c}`;
          if (mcq.option_d) context += `\nd) ${mcq.option_d}`;
          context += `\n✅ সঠিক উত্তর: ${mcq.correct_answer}`;
          if (mcq.subject) context += ` [${mcq.subject}]`;
        });
      }
    }

    // Add NCTB content if user asks about books
    if (message.toLowerCase().includes('বই') || message.toLowerCase().includes('nctb') || message.toLowerCase().includes('পিডিএফ')) {
      if (nctbResult.data && nctbResult.data.length > 0) {
        context += `\n\n📖 NCTB বই তথ্য:`;
        nctbResult.data.forEach(book => {
          context += `\n• ${book.title} (${book.class_level} শ্রেণী - ${book.subject})`;
          if (book.file_url) {
            context += `\n  🔗 লিংক: ${book.file_url}`;
          }
        });
      }
    }

    context += `\n\n📝 উত্তর দেওয়ার নিয়ম:
1. সরাসরি প্রশ্নের উত্তর দিন
2. সহজ বাংলায় ব্যাখ্যা করুন  
3. প্রয়োজনে উদাহরণ দিন
4. MCQ চাইলে অপশন সহ দিন
5. অপ্রাসঙ্গিক তথ্য দেবেন না
6. লিংক শুধু চাইলেই দিন

শিক্ষার্থীর প্রশ্ন: ${message}`;

    console.log('Calling Gemini API with focused context...');

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: context
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          maxOutputTokens: 800,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      let errorMessage = 'AI সেবায় সমস্যা হয়েছে। আবার চেষ্টা করুন।';
      
      if (response.status === 401) {
        errorMessage = 'API কী সংক্রান্ত সমস্যা। অনুগ্রহ করে পরে চেষ্টা করুন।';
      } else if (response.status === 429) {
        errorMessage = 'অনেক অনুরোধ এসেছে। কিছুক্ষণ পর আবার চেষ্টা করুন।';
      } else if (response.status >= 500) {
        errorMessage = 'সার্ভার সমস্যা। কিছুক্ষণ পর আবার চেষ্টা করুন।';
      }
      
      return new Response(JSON.stringify({ 
        error: errorMessage,
        details: `HTTP ${response.status}` 
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Gemini API response received successfully');
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid Gemini API response structure:', data);
      return new Response(JSON.stringify({ 
        error: 'AI থেকে সঠিক উত্তর পাওয়া যায়নি। আবার চেষ্টা করুন।',
        details: 'Invalid API response structure'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const reply = data.candidates[0].content.parts[0].text;

    if (!reply || reply.trim().length === 0) {
      return new Response(JSON.stringify({ 
        error: 'AI থেকে কোনো উত্তর পাওয়া যায়নি। আবার চেষ্টা করুন।',
        details: 'Empty response from AI'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Successfully generated focused educational reply');

    return new Response(JSON.stringify({ reply: reply.trim() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-with-gemini function:', error);
    
    let errorMessage = 'চ্যাট সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।';
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage = 'ইন্টারনেট সংযোগ সমস্যা। আবার চেষ্টা করুন।';
    } else if (error.message.includes('JSON')) {
      errorMessage = 'ডেটা প্রক্রিয়াকরণে সমস্যা। আবার চেষ্টা করুন।';
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
