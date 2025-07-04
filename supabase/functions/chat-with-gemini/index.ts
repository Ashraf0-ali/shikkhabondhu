
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

    // Check if user is asking for specific books
    const bookRequest = message.toLowerCase().includes('বই') || 
                       message.toLowerCase().includes('পিডিএফ') || 
                       message.toLowerCase().includes('pdf') ||
                       message.toLowerCase().includes('nctb') ||
                       message.toLowerCase().includes('শ্রেণী') ||
                       message.toLowerCase().includes('class');

    let foundBooks = [];
    let context = `আপনি একজন অভিজ্ঞত বাংলাদেশি শিক্ষক এবং AI সহায়ক। 

🎯 গুরুত্বপূর্ণ নির্দেশনা:
- শিক্ষার্থী যা জিজ্ঞেস করবে, ঠিক সেটারই উত্তর দিন
- বই চাইলে প্রথমে দেখুন আপনার কাছে আছে কিনা
- যদি বই থাকে তাহলে বলুন "হ্যাঁ, আমার কাছে আছে" এবং তারপর বিস্তারিত দিন
- যদি না থাকে তাহলে বিনয়ের সাথে বলুন "দুঃখিত, আমার কাছে এই বইটি নেই"
- MCQ চাইলে সরাসরি MCQ দিন
- ব্যাখ্যা সহজ ও সংক্ষিপ্ত রাখুন
- PDF লিংক দেওয়ার সময় এই ফরম্যাট ব্যবহার করুন: "🔗 PDF লিংক: [URL]"`;

    if (bookRequest) {
      console.log('Book request detected, searching database...');
      
      // Search for books in database
      const { data: books } = await supabase
        .from('nctb_books')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Books found:', books?.length || 0);

      if (books && books.length > 0) {
        foundBooks = books;
        context += `\n\n📚 আমার কাছে যে বইগুলো আছে:`;
        books.forEach(book => {
          context += `\n• ${book.title} (${book.class_level} শ্রেণী - ${book.subject})`;
          if (book.file_url) {
            context += `\n  🔗 PDF লিংক: ${book.file_url}`;
          }
          if (book.content) {
            context += `\n  📖 কন্টেন্ট উপলব্ধ`;
          }
        });
        
        // Specific search based on class level mentioned in the message
        const classNumbers = message.match(/(\d+)/g);
        if (classNumbers) {
          const matchingBooks = books.filter(book => 
            classNumbers.some(num => book.class_level.toString() === num)
          );
          
          if (matchingBooks.length > 0) {
            context += `\n\n🎯 আপনার চাহিদা মতো বই:`;
            matchingBooks.forEach(book => {
              context += `\n• ${book.title} (${book.class_level} শ্রেণী - ${book.subject})`;
              if (book.file_url) {
                context += `\n  🔗 PDF লিংক: ${book.file_url}`;
              }
            });
          }
        }
        
        context += `\n\nযদি আপনার চাহিদামতো বই উপরে না থাকে, তাহলে আমি দুঃখিত - আমার কাছে সেটি নেই।`;
      } else {
        context += `\n\n📚 দুঃখিত, আমার কাছে এই মুহূর্তে কোনো NCTB বই নেই। তবে আপনি চাইলে আমি অন্যভাবে সাহায্য করতে পারি।`;
      }
    }

    // Add other data contexts
    const [mcqResult, boardResult, notesResult] = await Promise.all([
      supabase.from('mcq_questions').select('*').limit(20),
      supabase.from('board_questions').select('*').limit(10),
      supabase.from('notes').select('*').limit(10)
    ]);

    console.log('Database context fetched:', {
      mcq: mcqResult.data?.length || 0,
      board: boardResult.data?.length || 0,
      books: foundBooks.length,
      notes: notesResult.data?.length || 0
    });

    // Add MCQ examples if user asks about MCQ
    if (message.toLowerCase().includes('mcq') || message.toLowerCase().includes('এমসিকিউ')) {
      if (mcqResult.data && mcqResult.data.length > 0) {
        context += `\n\n📊 MCQ উদাহরণ:`;
        mcqResult.data.slice(0, 3).forEach((mcq, index) => {
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

    context += `\n\n📝 উত্তর দেওয়ার নিয়ম:
1. বই চাইলে প্রথমে বলুন "হ্যাঁ আমার কাছে আছে" বা "দুঃখিত আমার কাছে নেই"
2. থাকলে লিংক বা কন্টেন্ট দিন, না থাকলে বিনয়ের সাথে বলুন
3. MCQ চাইলে অপশন সহ দিন
4. সহজ বাংলায় ব্যাখ্যা করুন
5. অপ্রাসঙ্গিক তথ্য দেবেন না
6. PDF লিংক দেওয়ার সময় "🔗 PDF লিংক: [URL]" ফরম্যাট ব্যবহার করুন

শিক্ষার্থীর প্রশ্ন: ${message}`;

    console.log('Calling Gemini API with enhanced book search context...');

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

    console.log('Successfully generated enhanced educational reply with book search');

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
