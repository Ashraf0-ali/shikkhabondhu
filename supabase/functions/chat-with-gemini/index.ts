
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
    const { message, conversation } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get Gemini API key from database
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('api_key')
      .eq('provider', 'gemini')
      .eq('is_active', true)
      .single();

    if (apiKeyError || !apiKeyData) {
      throw new Error('Gemini API key not found');
    }

    // Get MCQ questions for context
    const { data: mcqData } = await supabase
      .from('mcq_questions')
      .select('*')
      .limit(50);

    // Get board questions for context
    const { data: boardData } = await supabase
      .from('board_questions')
      .select('*')
      .limit(20);

    // Get NCTB books for context
    const { data: booksData } = await supabase
      .from('nctb_books')
      .select('*')
      .limit(20);

    // Prepare context for Gemini
    let contextInfo = "আপনি একজন বাংলাদেশি শিক্ষা সহায়ক AI। আপনার কাছে নিম্নলিখিত তথ্য রয়েছে:\n\n";
    
    if (mcqData && mcqData.length > 0) {
      contextInfo += "MCQ প্রশ্নসমূহ:\n";
      mcqData.forEach((q, i) => {
        if (i < 10) { // Limit to prevent token overflow
          contextInfo += `- ${q.question} (${q.subject})\n`;
        }
      });
      contextInfo += "\n";
    }

    if (boardData && boardData.length > 0) {
      contextInfo += "বোর্ড প্রশ্নসমূহ:\n";
      boardData.forEach((q, i) => {
        if (i < 10) {
          contextInfo += `- ${q.title} (${q.subject}, ${q.board} বোর্ড, ${q.year})\n`;
        }
      });
      contextInfo += "\n";
    }

    if (booksData && booksData.length > 0) {
      contextInfo += "NCTB পাঠ্যবইসমূহ:\n";
      booksData.forEach((book, i) => {
        if (i < 10) {
          contextInfo += `- ${book.title} (ক্লাস ${book.class_level}, ${book.subject})\n`;
        }
      });
    }

    // Prepare conversation history
    const conversationHistory = conversation || [];
    const messages = [
      {
        role: "user",
        parts: [{
          text: `${contextInfo}\n\nআপনি শিক্ষার্থীদের সাহায্য করুন। বাংলায় উত্তর দিন। প্রশ্ন: ${message}`
        }]
      }
    ];

    // Add conversation history
    conversationHistory.forEach((msg: any) => {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    });

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKeyData.api_key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না।';

    return new Response(JSON.stringify({ 
      reply,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-with-gemini function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      reply: 'দুঃখিত, একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
