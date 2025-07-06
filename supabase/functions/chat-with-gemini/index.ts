
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createSupabaseClient, fetchBooks, fetchEducationalData } from './databaseQueries.ts';
import { callGeminiAPI } from './geminiApi.ts';
import { buildBaseContext, buildBookContext, buildMCQContext, buildFinalInstructions } from './contextBuilders.ts';
import { detectBookRequest, detectMCQRequest, validateRequest, validateApiKey } from './utils.ts';

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
    
    const apiKeyError = validateApiKey(geminiApiKey);
    if (apiKeyError) {
      return new Response(JSON.stringify({ error: apiKeyError }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const requestBody = await req.json();
    const { message } = requestBody;

    const requestError = validateRequest(message);
    if (requestError) {
      return new Response(JSON.stringify({ error: requestError }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing message:', message.substring(0, 50));

    // Create Supabase client
    const supabase = createSupabaseClient();

    // Build base context
    let context = buildBaseContext();

    // Check if user is asking for books
    const isBookRequest = detectBookRequest(message);
    
    // Check if user is asking for MCQ
    const isMCQRequest = detectMCQRequest(message);

    let foundBooks = [];
    let mcqData = [];

    // Fetch books if book request detected
    if (isBookRequest) {
      foundBooks = await fetchBooks(supabase);
      if (foundBooks.length > 0) {
        context += buildBookContext(foundBooks, message);
      }
    }

    // Always fetch MCQ data for context, especially if MCQ request detected
    if (isMCQRequest || message.toLowerCase().includes('প্রশ্ন') || message.toLowerCase().includes('mcq')) {
      console.log('MCQ request detected, fetching MCQ data...');
      
      const { data: allMCQs } = await supabase
        .from('mcq_questions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      mcqData = allMCQs || [];
      console.log('MCQ data found:', mcqData.length);
      
      if (mcqData.length > 0) {
        // Filter MCQs based on the request
        let filteredMCQs = mcqData;
        
        // Check for specific board, year, subject in the message
        const messageLower = message.toLowerCase();
        
        if (messageLower.includes('রাজশাহী') || messageLower.includes('rajshahi')) {
          filteredMCQs = filteredMCQs.filter(mcq => 
            mcq.board && mcq.board.toLowerCase().includes('রাজশাহী')
          );
        }
        
        if (messageLower.includes('২০১৷') || messageLower.includes('2017')) {
          filteredMCQs = filteredMCQs.filter(mcq => 
            mcq.year === 2017
          );
        }
        
        if (messageLower.includes('বাংলা') || messageLower.includes('bangla')) {
          filteredMCQs = filteredMCQs.filter(mcq => 
            mcq.subject && mcq.subject.toLowerCase().includes('বাংলা')
          );
        }

        context += buildMCQContext(filteredMCQs.length > 0 ? filteredMCQs : mcqData);
        
        // Add specific information about available MCQs
        context += `\n\n📊 ডাটাবেজে মোট ${mcqData.length}টি MCQ প্রশ্ন রয়েছে।`;
        
        if (filteredMCQs.length > 0 && filteredMCQs.length < mcqData.length) {
          context += `\n🎯 আপনার অনুরোধ অনুযায়ী ${filteredMCQs.length}টি প্রাসঙ্গিক MCQ পাওয়া গেছে।`;
        }
      } else {
        context += `\n\n⚠️ দুঃখিত, ডাটাবেজে কোন MCQ প্রশ্ন পাওয়া যায়নি।`;
      }
    }

    // Add final instructions
    context += buildFinalInstructions(message, foundBooks);

    const reply = await callGeminiAPI(context, geminiApiKey!);

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
