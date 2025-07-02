
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

  const handleCSVImport = async () => {
    if (!selectedFile) {
      toast({
        title: "ফাইল নির্বাচন করুন",
        description: "প্রথমে একটি CSV ফাইল নির্বাচন করুন",
        variant: "destructive"
      });
      return;
    }

    const text = await selectedFile.text();
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',');
    
    const mcqs = lines.slice(1).map(line => {
      const values = line.split(',');
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
        year: parseInt(values[9]) || new Date().getFullYear()
      };
    });

    importMCQsFromCSV.mutate(mcqs);
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
        <div className="text-sm text-gray-600 bangla-text">
          <p>CSV ফরম্যাট: question,option_a,option_b,option_c,option_d,correct_answer,subject,chapter,board,year</p>
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
