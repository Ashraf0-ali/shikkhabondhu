export const buildBaseContext = (chatHistory: any[] = []) => {
  let context = `আপনি একজন অভিজ্ঞত বাংলাদেশি শিক্ষক এবং AI সহায়ক। 

🎯 গুরুত্বপূর্ণ নির্দেশনা:
- আগের কথোপকথন মনে রাখুন এবং সেই অনুযায়ী উত্তর দিন
- শিক্ষার্থী যা জিজ্ঞেস করবে, ঠিক সেটারই উত্তর দিন
- যদি শিক্ষার্থী একাধিক প্রশ্ন চায় (যেমন ৫টা প্রশ্ন), তাহলে অবশ্যই সেই সংখ্যক প্রশ্ন দিন
- বই চাইলে প্রথমে দেখুন আপনার কাছে আছে কিনা
- যদি বই থাকে তাহলে বলুন "হ্যাঁ, আমার কাছে আছে" এবং তারপর বিস্তারিত দিন
- যদি না থাকে তাহলে বিনয়ের সাথে বলুন "দুঃখিত, আমার কাছে এই বইটি নেই"
- MCQ চাইলে সরাসরি MCQ দিন - অবশ্যই বলুন "হ্যাঁ, আমার কাছে আছে" যদি থাকে
- ব্যাখ্যা সহজ ও সংক্ষিপ্ত রাখুন
- PDF লিংক দেওয়ার সময় এই ফরম্যাট ব্যবহার করুন: "🔗 PDF লিংক: [URL]"
- বই থাকলে অবশ্যই PDF লিংক দিন`;

  // Add chat history context
  if (chatHistory && chatHistory.length > 0) {
    context += `\n\n📜 পূর্বের কথোপকথন:`;
    // Only include recent messages to avoid token limits
    const recentHistory = chatHistory.slice(-10);
    recentHistory.forEach((msg: any, index: number) => {
      const role = msg.role === 'user' ? 'শিক্ষার্থী' : 'AI শিক্ষক';
      context += `\n${role}: ${msg.content}`;
    });
    context += `\n\n⚠️ উপরের কথোপকথনের প্রেক্ষিতে নিচের নতুন প্রশ্নের উত্তর দিন। পূর্বের কথোপকথনে যদি কোনো নির্দেশনা থাকে (যেমন কতগুলো প্রশ্ন চেয়েছে), সেটা মনে রাখবেন।`;
  }

  return context;
};

export const buildBookContext = (books: any[], message: string) => {
  let context = `\n\n📚 উপলব্ধ বইসমূহ:`;
  
  books.forEach(book => {
    context += `\n• ${book.title} (${book.class_level} শ্রেণী - ${book.subject})`;
    if (book.file_url) {
      context += `\n  🔗 PDF লিংক: ${book.file_url}`;
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
      
      context += `\n\n📖 উপরের যেকোনো বই পড়তে চাইলে আমি PDF লিংক দিতে পারি।`;
    }
  }
  
  context += `\n\n⚠️ গুরুত্বপূর্ণ: বই চাইলে অবশ্যই "হ্যাঁ, আমার কাছে আছে" বলে তারপর PDF লিংক দিবেন।`;
  
  return context;
};

export const buildMCQContext = (mcqData: any[]) => {
  let context = `\n\n📊 MCQ প্রশ্নের উদাহরণ:`;
  
  // Show sample MCQs - more than before to give better context
  mcqData.slice(0, 10).forEach((mcq, index) => {
    context += `\n\n${index + 1}. ${mcq.question}`;
    if (mcq.option_a) context += `\na) ${mcq.option_a}`;
    if (mcq.option_b) context += `\nb) ${mcq.option_b}`;
    if (mcq.option_c) context += `\nc) ${mcq.option_c}`;
    if (mcq.option_d) context += `\nd) ${mcq.option_d}`;
    context += `\n✅ সঠিক উত্তর: ${mcq.correct_answer}`;
    
    // Add additional info if available
    if (mcq.subject) context += ` [${mcq.subject}`;
    if (mcq.board) context += ` - ${mcq.board}`;
    if (mcq.year) context += ` - ${mcq.year}`;
    if (mcq.subject || mcq.board || mcq.year) context += `]`;
  });
  
  // Add summary of available MCQs
  const subjects = [...new Set(mcqData.map(mcq => mcq.subject).filter(s => s))];
  const boards = [...new Set(mcqData.map(mcq => mcq.board).filter(b => b))];
  const years = [...new Set(mcqData.map(mcq => mcq.year).filter(y => y))];
  
  context += `\n\n📋 উপলব্ধ MCQ সমূহ:`;
  if (subjects.length > 0) context += `\n📚 বিষয়: ${subjects.join(', ')}`;
  if (boards.length > 0) context += `\n🏛️ বোর্ড: ${boards.join(', ')}`;
  if (years.length > 0) context += `\n📅 সাল: ${years.join(', ')}`;
  
  return context;
};

export const buildFinalInstructions = (message: string, foundBooks: any[] = []) => {
  let context = `\n\n📝 বাধ্যতামূলক উত্তর নিয়ম:
1. MCQ চাইলে অবশ্যই বলুন "হ্যাঁ, আমার কাছে আছে।" এবং তারপর MCQ দিন
2. যদি একাধিক MCQ চায় (যেমন ৫টা), তাহলে অবশ্যই সেই সংখ্যক MCQ দিন
3. বই চাইলে অবশ্যই প্রথমে বলুন "হ্যাঁ, আমার কাছে আছে।" তারপর সাথে সাথে PDF লিংক দিন
4. PDF লিংক ফরম্যাট: "🔗 PDF লিংক: [URL]" - এই ফরম্যাট অবশ্যই ব্যবহার করুন
5. বই/MCQ না থাকলে বলুন "দুঃখিত, আমার কাছে এটি নেই"
6. MCQ চাইলে অপশন সহ দিন এবং সঠিক উত্তর দিন
7. পূর্বের কথোপকথনের ভিত্তিতে উত্তর দিন
8. কখনো শুধু "হ্যাঁ আমার কাছে আছে" বলে থেমে যাবেন না - অবশ্যই MCQ/PDF লিংক দিন

⚠️ CRITICAL: যদি কোনো MCQ/বই চায় এবং উপরে দেখানো হয়েছে, তাহলে অবশ্যই সেটি দিতে হবে। কখনো শুধু "হ্যাঁ আছে" বলে থামবেন না!

শিক্ষার্থীর নতুন প্রশ্ন: ${message}`;

  // Specifically for MCQ requests, add the direct instruction
  const mcqRequest = message.toLowerCase().includes('mcq') || 
                    message.toLowerCase().includes('এমসিকিউ') ||
                    message.toLowerCase().includes('প্রশ্ন');
                     
  if (mcqRequest) {
    context += `\n\n🚨 গুরুত্বপূর্ণ: উপরে MCQ প্রশ্নের উদাহরণ দেওয়া আছে। অবশ্যই এই ধরনের MCQ দিন এবং "হ্যাঁ, আমার কাছে আছে" বলুন!`;
    
    // Check if user asked for multiple questions
    const numberMatch = message.match(/(\d+)\s*টা|(\d+)\s*টি/);
    if (numberMatch) {
      const requestedCount = numberMatch[1] || numberMatch[2];
      context += `\n\n🔢 গুরুত্বপূর্ণ: শিক্ষার্থী ${requestedCount}টি প্রশ্ন চেয়েছে। অবশ্যই ${requestedCount}টি প্রশ্ন দিন!`;
    }
  }

  // Specifically for book requests, add the direct instruction  
  const bookRequest = message.toLowerCase().includes('বই') || 
                     message.toLowerCase().includes('পিডিএফ') || 
                     message.toLowerCase().includes('pdf') ||
                     message.toLowerCase().includes('nctb') ||
                     message.toLowerCase().includes('শ্রেণী') ||
                     message.toLowerCase().includes('class');
                     
  if (bookRequest && foundBooks.length > 0) {
    context += `\n\n🚨 গুরুত্বপূর্ণ: উপরে বইগুলো ও তাদের PDF লিংক দেওয়া আছে। অবশ্যই এই লিংকগুলো দিন!`;
  }
  
  return context;
};
