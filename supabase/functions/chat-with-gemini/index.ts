
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
    
    // Validate API key
    const apiKeyError = validateApiKey(geminiApiKey);
    if (apiKeyError) {
      console.error('API key validation failed');
      return new Response(JSON.stringify({ 
        error: 'AI সেবা বর্তমানে উপলব্ধ নয়। পরে আবার চেষ্টা করুন।'
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

    console.log('Processing chat request...');
    console.log('Message length:', message?.length || 0);
    console.log('Chat history length:', chatHistory?.length || 0);

    // Initialize Supabase client with error handling
    let supabase;
    try {
      supabase = createSupabaseClient();
    } catch (e) {
      console.error('Database connection error:', e);
      return new Response(JSON.stringify({ 
        error: 'ডেটাবেস সংযোগে সমস্যা। আবার চেষ্টা করুন।'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build base context (smaller for faster processing)
    let context = buildBaseContext(chatHistory?.slice(-3) || []); // Only last 3 messages for speed

    // Handle book requests
    const bookRequest = detectBookRequest(message);
    let foundBooks: any[] = [];
    
    if (bookRequest) {
      try {
        foundBooks = await fetchBooks(supabase);
        
        if (foundBooks.length > 0) {
          context += buildBookContext(foundBooks.slice(0, 2), message); // Limit to 2 books for speed
        } else {
          context += `\n\n📚 দুঃখিত, আমার কাছে এই মুহূর্তে কোনো NCTB বই নেই। তবে আপনি চাইলে আমি অন্যভাবে সাহায্য করতে পারি।`;
        }
      } catch (e) {
        console.error('Book fetch error:', e);
        // Continue without books
      }
    }

    // Add other educational data (limited for speed)
    let mcq = [], board = [], notes = [];
    try {
      const eduData = await fetchEducationalData(supabase);
      mcq = eduData.mcq;
      board = eduData.board;
      notes = eduData.notes;
    } catch (e) {
      console.error('Educational data fetch error:', e);
      // Continue without additional data
    }

    console.log('Database context fetched:', {
      mcq: mcq.length,
      board: board.length,
      books: foundBooks.length,
      notes: notes.length
    });

    // Add MCQ context if requested (limited)
    if (detectMCQRequest(message) && mcq.length > 0) {
      context += buildMCQContext(mcq.slice(0, 3)); // Limit to 3 MCQs for speed
    }

    // Add final instructions
    context += buildFinalInstructions(message, foundBooks);

    // Call Gemini API with faster settings
    const reply = await callGeminiAPI(context, geminiApiKey!);

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Function error:', error);
    return handleError(error);
  }
});
