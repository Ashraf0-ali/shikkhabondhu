
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
    const { message, chatHistory = [] } = requestBody;

    const requestError = validateRequest(message);
    if (requestError) {
      return new Response(JSON.stringify({ error: requestError }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing message:', message.substring(0, 100));
    console.log('Chat history length:', chatHistory.length);

    // Create Supabase client
    const supabase = createSupabaseClient();

    // Build comprehensive base context with chat history
    let context = buildBaseContext(chatHistory);

    // Check request types
    const isBookRequest = detectBookRequest(message);
    const isMCQRequest = detectMCQRequest(message);

    console.log('Request analysis:', { isBookRequest, isMCQRequest });

    let foundBooks = [];
    let mcqData = [];

    // Fetch books if requested
    if (isBookRequest) {
      console.log('Fetching books...');
      foundBooks = await fetchBooks(supabase);
      console.log('Books found:', foundBooks.length);
      
      if (foundBooks.length > 0) {
        context += buildBookContext(foundBooks, message);
      }
    }

    // Always fetch MCQ data for better context, especially for MCQ requests
    console.log('Fetching MCQ data...');
    
    const { data: allMCQs } = await supabase
      .from('mcq_questions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    mcqData = allMCQs || [];
    console.log('Total MCQ data found:', mcqData.length);
    
    if (mcqData.length > 0) {
      // Enhanced filtering for better matching
      let filteredMCQs = mcqData;
      const messageLower = message.toLowerCase();
      
      // Multi-criteria filtering
      if (messageLower.includes('রাজশাহী') || messageLower.includes('rajshahi')) {
        const rajshahiMCQs = filteredMCQs.filter(mcq => 
          mcq.board && mcq.board.toLowerCase().includes('রাজশাহী')
        );
        if (rajshahiMCQs.length > 0) filteredMCQs = rajshahiMCQs;
      }
      
      if (messageLower.includes('২০১৭') || messageLower.includes('2017')) {
        const year2017MCQs = filteredMCQs.filter(mcq => mcq.year === 2017);
        if (year2017MCQs.length > 0) filteredMCQs = year2017MCQs;
      }
      
      if (messageLower.includes('বাংলা') || messageLower.includes('bangla')) {
        const banglaMCQs = filteredMCQs.filter(mcq => 
          mcq.subject && mcq.subject.toLowerCase().includes('বাংলা')
        );
        if (banglaMCQs.length > 0) filteredMCQs = banglaMCQs;
      }

      // Use filtered MCQs if available, otherwise use all
      const mcqsToUse = filteredMCQs.length > 0 ? filteredMCQs : mcqData.slice(0, 50);
      context += buildMCQContext(mcqsToUse);
      
      // Add context summary
      context += `\n\n📊 প্রশ্ন ভান্ডার সারসংক্ষেপ:`;
      context += `\n🔢 মোট MCQ: ${mcqData.length}টি`;
      
      if (filteredMCQs.length > 0 && filteredMCQs.length < mcqData.length) {
        context += `\n🎯 প্রাসঙ্গিক MCQ: ${filteredMCQs.length}টি`;
      }
      
      if (isMCQRequest) {
        context += `\n\n⚠️ গুরুত্বপূর্ণ: শিক্ষার্থী MCQ প্রশ্ন চেয়েছে। উপরের তালিকা থেকে প্রাসঙ্গিক MCQ দিন।`;
      }
    } else {
      context += `\n\n⚠️ দুঃখিত, ডাটাবেজে কোন MCQ প্রশ্ন পাওয়া যায়নি।`;
    }

    // Add comprehensive final instructions
    context += buildFinalInstructions(message, foundBooks);

    console.log('Context prepared, calling Gemini API...');
    console.log('Context length:', context.length);

    const reply = await callGeminiAPI(context, geminiApiKey!);

    console.log('Response received, length:', reply.length);

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
