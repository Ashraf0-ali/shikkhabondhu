
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';

const CSVImport = () => {
  const { importMCQsFromCSV } = useSupabaseData();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const handleCSVImport = async () => {
    if (!selectedFile) {
      toast({
        title: "ফাইল নির্বাচন করুন",
        description: "প্রথমে একটি CSV ফাইল নির্বাচন করুন",
        variant: "destructive"
      });
      return;
    }

    try {
      const text = await selectedFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast({
          title: "ভুল ফরম্যাট",
          description: "CSV ফাইলে কমপক্ষে হেডার এবং একটি ডাটা লাইন থাকতে হবে",
          variant: "destructive"
        });
        return;
      }

      const headers = parseCSVLine(lines[0]);
      console.log('CSV Headers:', headers);
      
      const mcqs = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        console.log(`Row ${i} values:`, values);
        
        // Skip empty rows
        if (values.length === 0 || values.every(val => !val.trim())) {
          continue;
        }

        // Parse admission_info if it exists and is valid JSON
        let admissionInfo = {};
        if (values[11] && values[11].trim()) {
          try {
            admissionInfo = JSON.parse(values[11]);
          } catch (e) {
            console.warn(`Invalid JSON in admission_info for row ${i}:`, values[11]);
            admissionInfo = {};
          }
        }

        // Clean and validate correct_answer - ensure it's exactly one character
        let correctAnswer = (values[5] || 'A').toString().trim().toUpperCase();
        
        // Remove any extra characters, quotes, or spaces
        correctAnswer = correctAnswer.replace(/[^ABCD]/g, '');
        
        // If empty or invalid, default to A
        if (!correctAnswer || !['A', 'B', 'C', 'D'].includes(correctAnswer)) {
          correctAnswer = 'A';
        }
        
        // Take only the first character to be absolutely sure
        correctAnswer = correctAnswer.charAt(0);

        console.log(`Row ${i} - Original correct_answer: "${values[5]}", Cleaned: "${correctAnswer}"`);

        const mcqData = {
          question: (values[0] || '').toString().trim(),
          option_a: (values[1] || '').toString().trim(),
          option_b: (values[2] || '').toString().trim(),
          option_c: (values[3] || '').toString().trim(),
          option_d: (values[4] || '').toString().trim(),
          correct_answer: correctAnswer as 'A' | 'B' | 'C' | 'D',
          subject: (values[6] || '').toString().trim(),
          chapter: (values[7] || '').toString().trim(),
          board: (values[8] || '').toString().trim(),
          year: parseInt(values[9]) || new Date().getFullYear(),
          class_level: (values[10] || 'class_9_10').toString().trim(),
          admission_info: admissionInfo
        };

        // Only add if question is not empty
        if (mcqData.question) {
          mcqs.push(mcqData);
        }
      }

      if (mcqs.length === 0) {
        toast({
          title: "কোন বৈধ ডাটা পাওয়া যায়নি",
          description: "CSV ফাইলে কোন বৈধ প্রশ্ন পাওয়া যায়নি",
          variant: "destructive"
        });
        return;
      }

      console.log('Processed MCQs:', mcqs);
      importMCQsFromCSV.mutate(mcqs);
    } catch (error) {
      console.error('CSV processing error:', error);
      toast({
        title: "ফাইল প্রসেসিং এরর",
        description: "CSV ফাইল প্রসেস করতে সমস্যা হয়েছে",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
      <CardHeader>
        <CardTitle className="bangla-text">📊 CSV ফাইল ইমপোর্ট</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium bangla-text">CSV ফাইল নির্বাচন করুন</label>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="bangla-text"
          />
        </div>
        <div className="text-sm text-gray-600 bangla-text space-y-2">
          <p><strong>সব ধরনের প্রশ্নের জন্য CSV ফরম্যাট:</strong></p>
          <code className="block bg-gray-100 p-2 rounded text-xs">
            question,option_a,option_b,option_c,option_d,correct_answer,subject,chapter,board,year,class_level,admission_info
          </code>
          <div className="mt-2">
            <p><strong>গুরুত্বপূর্ণ নোট:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>correct_answer:</strong> অবশ্যই শুধুমাত্র A, B, C, বা D হতে হবে (একটি অক্ষর)</li>
              <li><strong>class_level:</strong> class_9_10, class_11_12, অথবা admission</li>
              <li><strong>admission_info:</strong> ভর্তি পরীক্ষার জন্য JSON (যেমন: {`{"university":"ঢাকা বিশ্ববিদ্যালয়","unit":"A"}`})</li>
              <li>সব কলাম পূরণ করুন, খালি রাখবেন না</li>
            </ul>
          </div>
        </div>
        <Button 
          onClick={handleCSVImport} 
          className="w-full bangla-text" 
          disabled={importMCQsFromCSV.isPending || !selectedFile}
        >
          {importMCQsFromCSV.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ইমপোর্ট করা হচ্ছে...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              CSV ইমপোর্ট করুন
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CSVImport;
