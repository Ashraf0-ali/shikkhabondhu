
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
      
      const mcqs = lines.slice(1).map((line, index) => {
        const values = parseCSVLine(line);
        console.log(`Row ${index + 1} values:`, values);
        
        // Parse admission_info if it exists and is valid JSON
        let admissionInfo = {};
        if (values[10]) { // admission_info column
          try {
            admissionInfo = JSON.parse(values[10]);
          } catch (e) {
            console.warn(`Invalid JSON in admission_info for row ${index + 1}:`, values[10]);
            admissionInfo = {};
          }
        }

        return {
          question: values[0] || '',
          option_a: values[1] || '',
          option_b: values[2] || '',
          option_c: values[3] || '',
          option_d: values[4] || '',
          correct_answer: (values[5] || 'A') as 'A' | 'B' | 'C' | 'D',
          subject: values[6] || '',
          chapter: values[7] || '',
          board: values[8] || '',
          year: parseInt(values[9]) || new Date().getFullYear(),
          class_level: values[10] || 'class_9_10', // Default to class_9_10
          admission_info: admissionInfo
        };
      });

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
            <p><strong>class_level:</strong> class_9_10, class_11_12, অথবা admission</p>
            <p><strong>admission_info:</strong> ভর্তি পরীক্ষার জন্য JSON (যেমন: {`{"university":"ঢাকা বিশ্ববিদ্যালয়","unit":"A"}`})</p>
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
