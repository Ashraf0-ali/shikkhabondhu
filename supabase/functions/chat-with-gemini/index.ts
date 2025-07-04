
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callGeminiAPI } from './geminiApi.ts';

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
      console.error('Gemini API key not found');
      return new Response(JSON.stringify({ 
        error: 'AI সেবা বর্তমানে উপলব্ধ নয়।'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const requestBody = await req.json();
    const { message } = requestBody;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return new Response(JSON.stringify({ 
        error: 'অনুগ্রহ করে একটি বার্তা লিখুন।'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing message:', message.substring(0, 50));

    const context = `তুমি একজন বাংলাদেশী শিক্ষা সহায়ক AI। সংক্ষিপ্ত এবং সহায়ক উত্তর দাও।

প্রশ্ন: ${message}`;

    const reply = await callGeminiAPI(context, geminiApiKey);

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Function error:', error);
    
    let errorMessage = 'AI সেবায় সমস্যা। আবার চেষ্টা করুন।';
    if (error.message) {
      errorMessage = error.message;
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
