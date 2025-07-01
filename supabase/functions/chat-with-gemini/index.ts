
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

    // Fetch relevant context from database
    const [mcqResult, boardResult, nctbResult, notesResult] = await Promise.all([
      supabase.from('mcq_questions').select('*').limit(50),
      supabase.from('board_questions').select('*').limit(20),
      supabase.from('nctb_books').select('*').limit(20),
      supabase.from('notes').select('*').limit(20)
    ]);

    console.log('Database context fetched:', {
      mcq: mcqResult.data?.length || 0,
      board: boardResult.data?.length || 0,
      nctb: nctbResult.data?.length || 0,
      notes: notesResult.data?.length || 0
    });

    // Build context for AI
    let context = `আপনি একজন বাংলাদেশি শিক্ষা সহায়ক AI। আপনার কাজ হলো ছাত্রছাত্রীদের পড়াশোনায় সাহায্য করা।

উপলব্ধ শিক্ষা উপকরণ:

MCQ প্রশ্ন (${mcqResult.data?.length || 0}টি):`;

    if (mcqResult.data && mcqResult.data.length > 0) {
      context += `\n${mcqResult.data.slice(0, 10).map(mcq => 
        `- ${mcq.subject}: ${mcq.question?.substring(0, 100)}...`
      ).join('\n')}`;
    }

    context += `\n\nবোর্ড প্রশ্ন (${boardResult.data?.length || 0}টি):`;
    if (boardResult.data && boardResult.data.length > 0) {
      context += `\n${boardResult.data.slice(0, 5).map(q => 
        `- ${q.subject} (${q.board} বোর্ড ${q.year}): ${q.title}`
      ).join('\n')}`;
    }

    context += `\n\nNCTB বই (${nctbResult.data?.length || 0}টি):`;
    if (nctbResult.data && nctbResult.data.length > 0) {
      context += `\n${nctbResult.data.slice(0, 5).map(book => 
        `- ${book.subject} (${book.class_level} শ্রেণি): ${book.title}`
      ).join('\n')}`;
    }

    context += `\n\nনোট (${notesResult.data?.length || 0}টি):`;
    if (notesResult.data && notesResult.data.length > 0) {
      context += `\n${notesResult.data.slice(0, 5).map(note => 
        `- ${note.subject}: ${note.title}`
      ).join('\n')}`;
    }

    context += `\n\nগুরুত্বপূর্ণ নির্দেশনা:
1. সর্বদা বাংলায় উত্তর দিন
2. শিক্ষার্থীদের সাথে বন্ধুত্বপূর্ণ ও উৎসাহব্যঞ্জক ভাষা ব্যবহার করুন
3. MCQ প্রশ্নের উত্তর দেওয়ার সময় ব্যাখ্যাসহ দিন
4. জটিল বিষয়গুলো সহজ ভাষায় বুঝিয়ে দিন
5. পড়াশোনার টিপস ও পরামর্শ দিন
6. বাংলাদেশের শিক্ষা ব্যবস্থা অনুযায়ী উত্তর দিন
7. বিজ্ঞান, মানবিক, ব্যবসায় শিক্ষা, আলিম ও দাখিল বিভাগের সব বিষয়ে সাহায্য করুন

ছাত্রছাত্রীর প্রশ্ন: ${message}`;

    console.log('Calling Gemini API...');

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
          topP: 0.9,
          maxOutputTokens: 1000,
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
    console.log('Gemini API response structure:', JSON.stringify(data, null, 2));
    
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

    console.log('Successfully generated reply');

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
