
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleError } from './errorHandlers.ts';
import { createSupabaseClient, fetchBooks, fetchEducationalData } from './databaseQueries.ts';
import { buildBaseContext, buildBookContext, buildMCQContext, buildFinalInstructions } from './contextBuilders.ts';
import { callGeminiAPI } from './geminiApi.ts';
import { detectBookRequest, detectMCQRequest, validateRequest, validateApiKey } from './utils.ts';
import { checkRateLimit } from './rateLimiter.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    // Validate API key
    const apiKeyError = validateApiKey(geminiApiKey);
    if (apiKeyError) {
      return new Response(JSON.stringify({ 
        error: apiKeyError,
        details: 'GEMINI_API_KEY not configured'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, chatHistory } = await req.json();
    
    // Get user ID from auth header (if available)
    const authHeader = req.headers.get('Authorization');
    const userId = authHeader ? authHeader.split(' ')[1] : 'anonymous';

    // Check rate limit
    const rateLimitCheck = checkRateLimit(userId);
    if (!rateLimitCheck.allowed) {
      return new Response(JSON.stringify({ 
        error: rateLimitCheck.message 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate request
    const requestError = validateRequest(message);
    if (requestError) {
      return new Response(JSON.stringify({ 
        error: requestError 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabase = createSupabaseClient();

    console.log('Fetching context from database...');
    console.log('Chat history length:', chatHistory?.length || 0);
    console.log('User ID:', userId);

    // Build base context
    let context = buildBaseContext(chatHistory);

    // Handle book requests
    const bookRequest = detectBookRequest(message);
    let foundBooks: any[] = [];
    
    if (bookRequest) {
      foundBooks = await fetchBooks(supabase);
      
      if (foundBooks.length > 0) {
        context += buildBookContext(foundBooks, message);
      } else {
        context += `\n\n📚 দুঃখিত, আমার কাছে এই মুহূর্তে কোনো NCTB বই নেই। তবে আপনি চাইলে আমি অন্যভাবে সাহায্য করতে পারি।`;
      }
    }

    // Add other educational data
    const { mcq, board, notes } = await fetchEducationalData(supabase);

    console.log('Database context fetched:', {
      mcq: mcq.length,
      board: board.length,
      books: foundBooks.length,
      notes: notes.length
    });

    // Add MCQ context if requested
    if (detectMCQRequest(message) && mcq.length > 0) {
      context += buildMCQContext(mcq);
    }

    // Add final instructions
    context += buildFinalInstructions(message, foundBooks);

    // Call Gemini API with retry mechanism
    const reply = await callGeminiAPI(context, geminiApiKey!);

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return handleError(error);
  }
});
