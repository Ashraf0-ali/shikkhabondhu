export const buildBaseContext = (chatHistory: any[] = []) => {
  let context = `আপনি একজন অভিজ্ঞত বাংলাদেশি শিক্ষক এবং AI সহায়ক। 

🎯 গুরুত্বপূর্ণ নির্দেশনা:
- আগের কথোপকথন মনে রাখুন এবং সেই অনুযায়ী উত্তর দিন
- শিক্ষার্থী যা জিজ্ঞেস করবে, ঠিক সেটারই উত্তর দিন
- বই চাইলে প্রথমে দেখুন আপনার কাছে আছে কিনা
- যদি বই থাকে তাহলে বলুন "হ্যাঁ, আমার কাছে আছে" এবং তারপর বিস্তারিত দিন
- যদি না থাকে তাহলে বিনয়ের সাথে বলুন "দুঃখিত, আমার কাছে এই বইটি নেই"
- MCQ চাইলে সরাসরি MCQ দিন
- ব্যাখ্যা সহজ ও সংক্ষিপ্ত রাখুন
- PDF লিংক দেওয়ার সময় এই ফরম্যাট ব্যবহার করুন: "🔗 PDF লিংক: [URL]"
- বই থাকলে অবশ্যই PDF লিংক দিন`;

  // Add chat history context
  if (chatHistory && chatHistory.length > 0) {
    context += `\n\n📜 পূর্বের কথোপকথন:`;
    // Only include last 10 messages to avoid token limits
    const recentHistory = chatHistory.slice(-10);
    recentHistory.forEach((msg: any, index: number) => {
      const role = msg.role === 'user' ? 'শিক্ষার্থী' : 'AI শিক্ষক';
      context += `\n${role}: ${msg.content}`;
    });
    context += `\n\n⚠️ উপরের কথোপকথনের প্রেক্ষিতে নিচের নতুন প্রশ্নের উত্তর দিন।`;
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
  let context = `\n\n📊 MCQ উদাহরণ:`;
  
  mcqData.slice(0, 3).forEach((mcq, index) => {
    context += `\n\n${index + 1}. ${mcq.question}`;
    if (mcq.option_a) context += `\na) ${mcq.option_a}`;
    if (mcq.option_b) context += `\nb) ${mcq.option_b}`;
    if (mcq.option_c) context += `\nc) ${mcq.option_c}`;
    if (mcq.option_d) context += `\nd) ${mcq.option_d}`;
    context += `\n✅ সঠিক উত্তর: ${mcq.correct_answer}`;
    if (mcq.subject) context += ` [${mcq.subject}]`;
  });
  
  return context;
};

export const buildFinalInstructions = (message: string, foundBooks: any[] = []) => {
  let context = `\n\n📝 বাধ্যতামূলক উত্তর নিয়ম:
1. বই চাইলে অবশ্যই প্রথমে বলুন "হ্যাঁ, আমার কাছে আছে।" তারপর সাথে সাথে PDF লিংক দিন
2. PDF লিংক ফরম্যাট: "🔗 PDF লিংক: [URL]" - এই ফরম্যাট অবশ্যই ব্যবহার করুন
3. বই না থাকলে বলুন "দুঃখিত, আমার কাছে এই বইটি নেই"
4. MCQ চাইলে অপশন সহ দিন
5. পূর্বের কথোপকথনের ভিত্তিতে উত্তর দিন
6. কখনো শুধু "হ্যাঁ আমার কাছে আছে" বলে থেমে যাবেন না - অবশ্যই PDF লিংক দিন

⚠️ CRITICAL: যদি কোনো বই চায় এবং উপরে PDF লিংক দেখানো হয়েছে, তাহলে অবশ্যই সেই লিংক দিতে হবে। কখনো শুধু "হ্যাঁ আছে" বলে থামবেন না!

শিক্ষার্থীর নতুন প্রশ্ন: ${message}`;

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