
export const buildBaseContext = (chatHistory: any[] = []) => {
  let context = `আপনি একজন অভিজ্ঞ বাংলাদেশি শিক্ষা বিশেষজ্ঞ এবং AI শিক্ষক। 

🎯 গুরুত্বপূর্ণ নির্দেশনা:
- সর্বদা পূর্ণাঙ্গ ও সম্পূর্ণ উত্তর দিন
- শিক্ষার্থীর প্রশ্নের সুনির্দিষ্ট উত্তর দিন
- MCQ প্রশ্ন চাইলে প্রশ্ন + সব অপশন + সঠিক উত্তর সহ সম্পূর্ণ MCQ দিন
- একাধিক প্রশ্ন চাইলে (যেমন ৫টা) ঠিক সেই সংখ্যক প্রশ্ন দিন
- পূর্বের কথোপকথন স্মরণ রাখুন
- বই চাইলে প্রথমে বলুন "হ্যাঁ, আমার কাছে আছে" তারপর "📚 বইনাম: URL" ফরম্যাটে লিংক দিন
- MCQ চাইলে "হ্যাঁ, আমার কাছে আছে" বলে তারপর সম্পূর্ণ MCQ দিন
- কখনো অসম্পূর্ণ উত্তর দেবেন না
- শিক্ষকের মত ধৈর্যশীল ও সহায়ক আচরণ করুন`;

  // Add chat history context for continuity
  if (chatHistory && chatHistory.length > 0) {
    context += `\n\n📜 পূর্বের কথোপকথনের ধারাবাহিকতা:`;
    const recentHistory = chatHistory.slice(-8);
    recentHistory.forEach((msg: any, index: number) => {
      const role = msg.role === 'user' ? 'শিক্ষার্থী' : 'শিক্ষক';
      context += `\n${role}: ${msg.content.substring(0, 200)}${msg.content.length > 200 ? '...' : ''}`;
    });
    context += `\n\n⚠️ উপরের কথোপকথনের ধারাবাহিকতায় নিচের প্রশ্নের সম্পূর্ণ উত্তর দিন।`;
  }

  return context;
};

export const buildBookContext = (books: any[], message: string) => {
  let context = `\n\n📚 উপলব্ধ বইসমূহ (মোট ${books.length}টি):`;
  
  books.slice(0, 15).forEach((book, index) => {
    context += `\n${index + 1}. ${book.title} (${book.class_level} শ্রেণী - ${book.subject})`;
    if (book.file_url) {
      context += `\n   📚 ${book.title}: ${book.file_url}`;
    }
  });
  
  context += `\n\n🎯 বই চাইলে অবশ্যই:
1. প্রথমে "হ্যাঁ, আমার কাছে আছে।" বলুন
2. তারপর "📚 বইয়ের নাম: URL" ফরম্যাটে লিংক দিন
3. এই ফরম্যাট অবশ্যই ব্যবহার করবেন: 📚 বইনাম: https://example.com/book.pdf`;
  
  return context;
};

export const buildMCQContext = (mcqData: any[]) => {
  let context = `\n\n📊 MCQ প্রশ্নের ভান্ডার (মোট ${mcqData.length}টি প্রশ্ন):`;
  
  // Show comprehensive examples
  mcqData.slice(0, 15).forEach((mcq, index) => {
    context += `\n\n${index + 1}. ${mcq.question}`;
    if (mcq.option_a) context += `\na) ${mcq.option_a}`;
    if (mcq.option_b) context += `\nb) ${mcq.option_b}`;
    if (mcq.option_c) context += `\nc) ${mcq.option_c}`;
    if (mcq.option_d) context += `\nd) ${mcq.option_d}`;
    context += `\n✅ সঠিক উত্তর: ${mcq.correct_answer}`;
    
    // Add metadata
    const metadata = [];
    if (mcq.subject) metadata.push(mcq.subject);
    if (mcq.board) metadata.push(mcq.board);
    if (mcq.year) metadata.push(mcq.year);
    if (metadata.length > 0) {
      context += ` [${metadata.join(' - ')}]`;
    }
  });
  
  // Add statistical summary
  const subjects = [...new Set(mcqData.map(mcq => mcq.subject).filter(s => s))];
  const boards = [...new Set(mcqData.map(mcq => mcq.board).filter(b => b))];
  const years = [...new Set(mcqData.map(mcq => mcq.year).filter(y => y))];
  
  context += `\n\n📈 ডেটাবেজ সারসংক্ষেপ:`;
  if (subjects.length > 0) context += `\n📚 বিষয়সমূহ: ${subjects.join(', ')}`;
  if (boards.length > 0) context += `\n🏛️ বোর্ডসমূহ: ${boards.join(', ')}`;
  if (years.length > 0) context += `\n📅 সালসমূহ: ${years.join(', ')}`;
  
  return context;
};

export const buildFinalInstructions = (message: string, foundBooks: any[] = []) => {
  let context = `\n\n📝 অবশ্যই পালনীয় নিয়মাবলী:

1. MCQ চাইলে:
   - প্রথমে বলুন "হ্যাঁ, আমার কাছে আছে।"
   - তারপর সম্পূর্ণ MCQ দিন (প্রশ্ন + সব অপশন + সঠিক উত্তর)
   - একাধিক চাইলে ঠিক সেই সংখ্যক দিন
   - কখনো অসম্পূর্ণ MCQ দেবেন না

2. বই চাইলে:
   - প্রথমে বলুন "হ্যাঁ, আমার কাছে আছে।"
   - তারপর এই ফরম্যাটে লিংক দিন: "📚 বইনাম: https://example.com/book.pdf"
   - অবশ্যই 📚 চিহ্ন ব্যবহার করবেন

3. উত্তরের মান:
   - সর্বদা পূর্ণাঙ্গ ও সম্পূর্ণ উত্তর দিন
   - কখনো অসম্পূর্ণ বা কাটাকাটা উত্তর দেবেন না
   - শিক্ষার্থীর চাহিদা অনুযায়ী সংখ্যা মিলান

4. শিক্ষক হিসেবে আচরণ:
   - ধৈর্যশীল ও সহায়ক হন
   - পূর্বের কথোপকথন মনে রাখুন
   - শিক্ষামূলক ব্যাখ্যা দিন

শিক্ষার্থীর বর্তমান প্রশ্ন: ${message}`;

  // Specific handling for MCQ requests
  const mcqKeywords = ['mcq', 'এমসিকিউ', 'প্রশ্ন', 'রাজশাহী', 'বোর্ড', 'বাংলা'];
  const isMCQRequest = mcqKeywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()));
  
  if (isMCQRequest) {
    // Check for quantity request
    const quantityMatch = message.match(/(\d+)\s*টা|(\d+)\s*টি/);
    const requestedCount = quantityMatch ? (quantityMatch[1] || quantityMatch[2]) : '1';
    
    context += `\n\n🚨 CRITICAL: MCQ প্রশ্ন চাওয়া হয়েছে!
- অবশ্যই "হ্যাঁ, আমার কাছে আছে।" বলুন
- ${requestedCount}টি সম্পূর্ণ MCQ দিন (প্রশ্ন + সব অপশন + সঠিক উত্তর)
- কোনো MCQ অসম্পূর্ণ রাখবেন না
- উপরের MCQ তালিকা থেকে প্রাসঙ্গিক প্রশ্ন বেছে নিন`;
  }

  // Specific handling for book requests
  const bookKeywords = ['বই', 'পিডিএফ', 'pdf', 'শ্রেণী', 'class', 'বুক', 'পাঠ্যবই'];
  const isBookRequest = bookKeywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()));
  
  if (isBookRequest && foundBooks.length > 0) {
    context += `\n\n🚨 CRITICAL: বই চাওয়া হয়েছে!
- অবশ্যই "হ্যাঁ, আমার কাছে আছে।" বলুন
- উপরের বইয়ের তালিকা থেকে সঠিক বই খুঁজুন
- এই ফরম্যাটে লিংক দিন: "📚 বইনাম: URL"
- 📚 চিহ্ন অবশ্যই ব্যবহার করবেন`;
  }
  
  return context;
};
