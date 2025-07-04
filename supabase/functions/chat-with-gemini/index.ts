
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

    // Fetch comprehensive context from database with NCTB content prioritized
    const [mcqResult, boardResult, nctbResult, notesResult] = await Promise.all([
      supabase.from('mcq_questions').select('*').limit(100),
      supabase.from('board_questions').select('*').limit(30),
      supabase.from('nctb_books').select('*').order('created_at', { ascending: false }),
      supabase.from('notes').select('*').limit(20)
    ]);

    console.log('Database context fetched:', {
      mcq: mcqResult.data?.length || 0,
      board: boardResult.data?.length || 0,
      nctb: nctbResult.data?.length || 0,
      notes: notesResult.data?.length || 0
    });

    // Build enhanced teacher-friendly context with NCTB book content analysis
    let context = `আপনি একজন অভিজ্ঞ বাংলাদেশি শিক্ষক এবং AI সহায়ক। আপনার কাজ হলো ছাত্রছাত্রীদের পড়াশোনায় শিক্ষকের মতো করে সাহায্য করা।

🎓 আপনার বিশেষ দক্ষতা:
- NCTB বই বিশ্লেষণ করে প্রশ্ন প্যাটার্ন খুঁজে বের করা
- অধ্যায়ভিত্তিক প্রশ্ন ট্রেন্ড বিশ্লেষণ 
- বোর্ড পরীক্ষার প্রশ্ন প্যাটার্ন অনুযায়ী গাইড করা
- পাঠ্যবই থেকে গুরুত্বপূর্ণ পয়েন্ট চিহ্নিত করা

📚 NCTB বই কন্টেন্ট বিশ্লেষণ (${nctbResult.data?.length || 0}টি বই):`;

    // Add detailed NCTB content for AI analysis
    if (nctbResult.data && nctbResult.data.length > 0) {
      nctbResult.data.forEach(book => {
        context += `\n\n📖 ${book.title} (${book.class_level} শ্রেণী - ${book.subject})`;
        if (book.chapter) context += ` - অধ্যায়: ${book.chapter}`;
        
        // Include significant portions of text content for better analysis
        if (book.content && book.content.length > 0) {
          const contentPreview = book.content.length > 2000 
            ? book.content.substring(0, 2000) + "..."
            : book.content;
          context += `\n📝 বই এর কন্টেন্ট: ${contentPreview}`;
        }
        
        if (book.file_url) {
          context += `\n🔗 PDF লিংক: ${book.file_url}`;
        }
      });
    }

    context += `\n\n🎯 MCQ প্রশ্ন প্যাটার্ন বিশ্লেষণ (${mcqResult.data?.length || 0}টি প্রশ্ন):`;
    
    if (mcqResult.data && mcqResult.data.length > 0) {
      // Group MCQs by subject and chapter for pattern analysis
      const subjectGroups: Record<string, any[]> = {};
      mcqResult.data.forEach(mcq => {
        const key = `${mcq.subject}${mcq.chapter ? ` - ${mcq.chapter}` : ''}`;
        if (!subjectGroups[key]) subjectGroups[key] = [];
        subjectGroups[key].push(mcq);
      });

      Object.entries(subjectGroups).forEach(([subject, questions]) => {
        context += `\n\n📊 ${subject} (${questions.length}টি প্রশ্ন):`;
        questions.slice(0, 3).forEach(mcq => {
          context += `\n- ${mcq.question?.substring(0, 120)}... [${mcq.board || 'সাধারণ'} বোর্ড ${mcq.year || 'N/A'}]`;
        });
      });
    }

    context += `\n\n📋 বোর্ড প্রশ্ন ট্রেন্ড (${boardResult.data?.length || 0}টি প্রশ্ন):`;
    if (boardResult.data && boardResult.data.length > 0) {
      const yearGroups: Record<string, any[]> = {};
      boardResult.data.forEach(q => {
        const key = `${q.year}`;
        if (!yearGroups[key]) yearGroups[key] = [];
        yearGroups[key].push(q);
      });

      Object.entries(yearGroups)
        .sort(([a], [b]) => parseInt(b) - parseInt(a))
        .slice(0, 3)
        .forEach(([year, questions]) => {
          context += `\n\n🗓️ ${year} সালের প্রশ্ন (${questions.length}টি):`;
          questions.slice(0, 2).forEach(q => {
            context += `\n- ${q.subject} (${q.board} বোর্ড): ${q.title}`;
          });
        });
    }

    context += `\n\n📝 অতিরিক্ত নোট (${notesResult.data?.length || 0}টি):`;
    if (notesResult.data && notesResult.data.length > 0) {
      context += `\n${notesResult.data.slice(0, 3).map(note => 
        `- ${note.subject}: ${note.title}`
      ).join('\n')}`;
    }

    context += `\n\n🔥 বিশেষ শিক্ষকসুলভ নির্দেশনা:
1. 🎯 সর্বদা বাংলায় স্পষ্ট ও সহজ ভাষায় উত্তর দিন
2. 📚 NCTB বইয়ের কন্টেন্ট রেফারেন্স করে উত্তর দিন
3. 🔍 যখন কেউ "কোন অধ্যায় থেকে কি প্রশ্ন আসে" জিজ্ঞেস করে:
   - সেই অধ্যায়ের NCTB বই কন্টেন্ট বিশ্লেষণ করুন
   - আগের বছরের বোর্ড প্রশ্ন প্যাটার্ন দেখান
   - গুরুত্বপূর্ণ টপিক হাইলাইট করুন
4. 💡 MCQ প্রশ্নের উত্তর দেওয়ার সময়:
   - সঠিক উত্তর বলুন এবং ব্যাখ্যা করুন
   - NCTB বই থেকে রেফারেন্স দিন
   - কেন অন্য অপশনগুলো ভুল তা বুঝিয়ে দিন
5. 🧠 জটিল বিষয় ভেঙে ভেঙে সহজ করে বলুন
6. 🎓 পরীক্ষার কৌশল ও টিপস দিন
7. 📖 বাংলাদেশের শিক্ষাক্রম অনুযায়ী উত্তর দিন
8. 🌟 শিক্ষার্থীদের উৎসাহিত করুন
9. 📊 প্রশ্ন প্যাটার্ন ও ট্রেন্ড বিশ্লেষণ করুন
10. 🤝 বন্ধুত্বপূর্ণ কিন্তু সম্মানজনক ভাষা ব্যবহার করুন

আপনার শিক্ষার্থীর প্রশ্ন: ${message}`;

    console.log('Calling Gemini API with enhanced NCTB context...');

    // Call Gemini API with enhanced settings for educational content analysis
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
          maxOutputTokens: 2048,
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
    console.log('Gemini API response received for NCTB analysis');
    
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

    console.log('Successfully generated NCTB-enhanced educational reply');

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
