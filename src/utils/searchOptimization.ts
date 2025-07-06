
// Enhanced search optimization utilities for better SEO and multilingual search

interface SearchTerms {
  bangla: string[];
  english: string[];
  phonetic: string[];
  synonyms: string[];
}

// Comprehensive subject mappings
const subjectMappings: Record<string, SearchTerms> = {
  'বাংলা': {
    bangla: ['বাংলা', 'বাংলা ভাষা', 'বাংলা সাহিত্য'],
    english: ['bangla', 'bengali', 'bangla language', 'bengali literature'],
    phonetic: ['bangla', 'bengali', 'banla'],
    synonyms: ['মাতৃভাষা', 'mother tongue', 'native language']
  },
  'ইংরেজি': {
    bangla: ['ইংরেজি', 'ইংরেজী', 'ইংলিশ'],
    english: ['english', 'eng', 'english language'],
    phonetic: ['english', 'ingriji', 'inglish'],
    synonyms: ['বিদেশী ভাষা', 'foreign language']
  },
  'গণিত': {
    bangla: ['গণিত', 'গনিত', 'ম্যাথ'],
    english: ['math', 'mathematics', 'maths'],
    phonetic: ['gonit', 'math', 'mathematics'],
    synonyms: ['সংখ্যা', 'অঙ্ক', 'number', 'calculation']
  },
  'পদার্থবিজ্ঞান': {
    bangla: ['পদার্থবিজ্ঞান', 'পদার্থ', 'ফিজিক্স'],
    english: ['physics', 'physical science'],
    phonetic: ['physics', 'podartho biggan'],
    synonyms: ['প্রাকৃতিক বিজ্ঞান', 'natural science']
  },
  'রসায়ন': {
    bangla: ['রসায়ন', 'কেমিস্ট্রি', 'রাসায়নিক'],
    english: ['chemistry', 'chemical science'],
    phonetic: ['chemistry', 'roshayon'],
    synonyms: ['রাসায়নিক বিজ্ঞান', 'chemical science']
  },
  'জীববিজ্ঞান': {
    bangla: ['জীববিজ্ঞান', 'জীববিদ্যা', 'বায়োলজি'],
    english: ['biology', 'biological science'],
    phonetic: ['biology', 'jibbobiggan'],
    synonyms: ['প্রাণীবিদ্যা', 'উদ্ভিদবিদ্যা', 'zoology', 'botany']
  }
};

// Class level mappings
const classLevelMappings: Record<string, string[]> = {
  '৬': ['৬', '6', 'ছয়', 'six', 'class 6', 'grade 6', 'ষষ্ঠ', 'sixth'],
  '৭': ['৭', '7', 'সাত', 'seven', 'class 7', 'grade 7', 'সপ্তম', 'seventh'],
  '৮': ['৮', '8', 'আট', 'eight', 'class 8', 'grade 8', 'অষ্টম', 'eighth'],
  '৯': ['৯', '9', 'নয়', 'nine', 'class 9', 'grade 9', 'নবম', 'ninth'],
  '১০': ['১০', '10', 'দশ', 'ten', 'class 10', 'grade 10', 'দশম', 'tenth', 'ssc']
};

// Paper/Part mappings
const paperMappings: Record<string, string[]> = {
  '১ম': ['১ম', '1st', 'প্রথম', 'first', 'prothom', 'potro', 'paper 1'],
  '২য়': ['২য়', '2nd', 'দ্বিতীয়', 'second', 'ditiyo', 'paper 2'],
  '৩য়': ['৩য়', '3rd', 'তৃতীয়', 'third', 'tritiyo', 'paper 3']
};

// Board mappings
const boardMappings: Record<string, string[]> = {
  'ঢাকা': ['ঢাকা', 'dhaka', 'dhaka board'],
  'চট্টগ্রাম': ['চট্টগ্রাম', 'chittagong', 'chattogram', 'ctg'],
  'রাজশাহী': ['রাজশাহী', 'rajshahi', 'raj'],
  'যশোর': ['যশোর', 'jessore', 'jashore'],
  'কুমিল্লা': ['কুমিল্লা', 'cumilla', 'comilla'],
  'বরিশাল': ['বরিশাল', 'barisal', 'barishal'],
  'সিলেট': ['সিলেট', 'sylhet'],
  'দিনাজপুর': ['দিনাজপুর', 'dinajpur']
};

export const generateSearchTerms = (originalTerm: string): string[] => {
  const searchTerms = new Set<string>();
  const lowerTerm = originalTerm.toLowerCase().trim();
  
  // Add original term
  searchTerms.add(lowerTerm);
  
  // Add subject variations
  Object.entries(subjectMappings).forEach(([key, mapping]) => {
    const allTerms = [...mapping.bangla, ...mapping.english, ...mapping.phonetic, ...mapping.synonyms];
    if (allTerms.some(term => lowerTerm.includes(term.toLowerCase()))) {
      allTerms.forEach(term => searchTerms.add(term.toLowerCase()));
    }
  });
  
  // Add class level variations
  Object.entries(classLevelMappings).forEach(([key, variations]) => {
    if (variations.some(variation => lowerTerm.includes(variation.toLowerCase()))) {
      variations.forEach(variation => searchTerms.add(variation.toLowerCase()));
    }
  });
  
  // Add paper variations
  Object.entries(paperMappings).forEach(([key, variations]) => {
    if (variations.some(variation => lowerTerm.includes(variation.toLowerCase()))) {
      variations.forEach(variation => searchTerms.add(variation.toLowerCase()));
    }
  });
  
  // Add board variations
  Object.entries(boardMappings).forEach(([key, variations]) => {
    if (variations.some(variation => lowerTerm.includes(variation.toLowerCase()))) {
      variations.forEach(variation => searchTerms.add(variation.toLowerCase()));
    }
  });
  
  // Handle common patterns
  const patterns = [
    // Bangla first paper variations
    { pattern: /বাংলা.*১ম.*পত্র|বাংলা.*প্রথম.*পত্র/i, terms: ['বাংলা ১ম পত্র', 'bangla 1st paper', 'bangla prothom potro', 'bengali first paper'] },
    { pattern: /বাংলা.*২য়.*পত্র|বাংলা.*দ্বিতীয়.*পত্র/i, terms: ['বাংলা ২য় পত্র', 'bangla 2nd paper', 'bangla ditiyo potro', 'bengali second paper'] },
    
    // English variations
    { pattern: /ইংরেজি.*১ম.*পত্র|english.*1st.*paper/i, terms: ['ইংরেজি ১ম পত্র', 'english 1st paper', 'english first paper'] },
    { pattern: /ইংরেজি.*২য়.*পত্র|english.*2nd.*paper/i, terms: ['ইংরেজি ২য় পত্র', 'english 2nd paper', 'english second paper'] },
    
    // Math variations
    { pattern: /গণিত|math|mathematics/i, terms: ['গণিত', 'math', 'mathematics', 'গনিত', 'ম্যাথ'] },
    
    // Physics variations
    { pattern: /পদার্থবিজ্ঞান|physics/i, terms: ['পদার্থবিজ্ঞান', 'physics', 'পদার্থ', 'ফিজিক্স'] },
    
    // Chemistry variations
    { pattern: /রসায়ন|chemistry/i, terms: ['রসায়ন', 'chemistry', 'কেমিস্ট্রি', 'রাসায়নিক'] },
    
    // Biology variations
    { pattern: /জীববিজ্ঞান|biology/i, terms: ['জীববিজ্ঞান', 'biology', 'জীববিদ্যা', 'বায়োলজি'] }
  ];
  
  patterns.forEach(({ pattern, terms }) => {
    if (pattern.test(lowerTerm)) {
      terms.forEach(term => searchTerms.add(term.toLowerCase()));
    }
  });
  
  return Array.from(searchTerms);
};

export const optimizeSearchQuery = (query: string): string => {
  const searchTerms = generateSearchTerms(query);
  // Return the most comprehensive search term that includes variations
  return searchTerms.join(' ');
};

export const buildSearchConditions = (searchTerms: string[], tableName: string): string => {
  const conditions: string[] = [];
  
  searchTerms.forEach(term => {
    const cleanTerm = term.replace(/['"]/g, ''); // Remove quotes to prevent SQL injection
    
    // Search in multiple fields based on table
    switch (tableName) {
      case 'nctb_books':
        conditions.push(`title.ilike.%${cleanTerm}%`);
        conditions.push(`subject.ilike.%${cleanTerm}%`);
        conditions.push(`content.ilike.%${cleanTerm}%`);
        break;
      case 'mcq_questions':
        conditions.push(`question.ilike.%${cleanTerm}%`);
        conditions.push(`subject.ilike.%${cleanTerm}%`);
        conditions.push(`chapter.ilike.%${cleanTerm}%`);
        conditions.push(`board.ilike.%${cleanTerm}%`);
        break;
      case 'board_questions':
        conditions.push(`title.ilike.%${cleanTerm}%`);
        conditions.push(`subject.ilike.%${cleanTerm}%`);
        conditions.push(`board.ilike.%${cleanTerm}%`);
        break;
      case 'notes':
        conditions.push(`title.ilike.%${cleanTerm}%`);
        conditions.push(`subject.ilike.%${cleanTerm}%`);
        conditions.push(`content.ilike.%${cleanTerm}%`);
        break;
    }
  });
  
  return conditions.join(',');
};

export const getSEOTags = (content: string): string[] => {
  const searchTerms = generateSearchTerms(content);
  const seoTags = new Set<string>();
  
  // Add generated search terms as SEO tags
  searchTerms.forEach(term => seoTags.add(term));
  
  // Add common educational tags
  const educationalTags = [
    'শিক্ষা', 'education', 'বই', 'book', 'প্রশ্ন', 'question',
    'MCQ', 'এমসিকিউ', 'পরীক্ষা', 'exam', 'পাঠ্যবই', 'textbook',
    'বোর্ড', 'board', 'NCTB', 'এনসিটিবি'
  ];
  
  educationalTags.forEach(tag => seoTags.add(tag));
  
  return Array.from(seoTags);
};
