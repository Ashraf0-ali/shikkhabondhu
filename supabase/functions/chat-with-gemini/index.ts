
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleError } from './errorHandlers.ts';
import { createSupabaseClient, fetchBooks, fetchEducationalData } from './databaseQueries.ts';
import { buildBaseContext, buildBookContext, buildMCQContext, buildFinalInstructions } from './contextBuilders.ts';
import { callGeminiAPI } from './geminiApi.ts';
import { detectBookRequest, detectMCQRequest, validateRequest, validateApiKey } from './utils.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      console.error('Gemini API key not found');
      return new Response(JSON.stringify({ 
        error: 'AI সেবা বর্তমানে উপলব্ধ নয়। পরে চেষ্টা করুন।'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let requestBody;
    try {
      requestBody = await req.json();
    } catch (e) {
      console.error('JSON parse error:', e);
      return new Response(JSON.stringify({ 
        error: 'অবৈধ অনুরোধ। আবার চেষ্টা করুন।'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, chatHistory } = requestBody;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return new Response(JSON.stringify({ 
        error: 'অনুগ্রহ করে একটি বার্তা লিখুন।'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing chat request:', message.substring(0, 50) + '...');

    // সরাসরি AI কল করি ডেটাবেস ছাড়া - দ্রুত রেসপন্সের জন্য
    const context = `তুমি একজন বাংলাদেশী শিক্ষা সহায়ক AI। ছাত্রছাত্রীদের পড়াশোনায় সাহায্য কর।

প্রশ্ন: ${message}

সংক্ষিপ্ত এবং সহায়ক উত্তর দাও। বাংলায় উত্তর দাও।`;

    const reply = await callGeminiAPI(context, geminiApiKey);

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ 
      error: 'AI সেবায় সমস্যা। আবার চেষ্টা করুন।'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
