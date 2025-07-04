export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const handleError = (error: any) => {
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
};