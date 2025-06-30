
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Download, Eye, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Note {
  id: string;
  title: string;
  subject: string;
  chapter?: string;
  content?: string;
  file_url?: string;
  file_type?: string;
  created_at: string;
}

const NotesViewer = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const subjects = [
    'বাংলা', 'ইংরেজি', 'গণিত', 'বিজ্ঞান', 'পদার্থবিজ্ঞান', 'রসায়ন', 
    'জীববিজ্ঞান', 'ইতিহাস', 'ভূগোল', 'পৌরনীতি', 'অর্থনীতি', 
    'ইসলাম শিক্ষা', 'হিন্দু ধর্ম', 'বৌদ্ধ ধর্ম', 'খ্রিস্টান ধর্ম', 
    'কৃষিশিক্ষা', 'গার্হস্থ্য বিজ্ঞান'
  ];

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes', selectedSubject, searchTerm],
    queryFn: async () => {
      let query = supabase.from('notes').select('*');
      
      if (selectedSubject !== 'all') {
        query = query.eq('subject', selectedSubject);
      }
      
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Note[];
    },
  });

  const handleViewNote = (note: Note) => {
    if (note.file_url) {
      window.open(note.file_url, '_blank');
    }
  };

  const handleDownloadNote = (note: Note) => {
    if (note.file_url) {
      const link = document.createElement('a');
      link.href = note.file_url;
      link.download = `${note.title}.${note.file_type || 'pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg bangla-text">নোটস লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
          <CardHeader className="text-center py-6">
            <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 bangla-text">
              📚 নোটস ও পিডিএফ
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg bangla-text">
              সকল বিষয়ের নোটস এবং পিডিএফ ফাইল দেখুন
            </p>
          </CardHeader>
        </Card>

        {/* Filters */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex flex-col md:flex-row gap-3 flex-1">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-full md:w-48 bangla-text">
                    <SelectValue placeholder="বিষয় নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="bangla-text">সব বিষয়</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject} className="bangla-text">
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="নোটস খুঁজুন..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bangla-text"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 bangla-text">
                কোনো নোটস পাওয়া যায়নি
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 bangla-text">
                {selectedSubject === 'all' 
                  ? 'এখনো কোনো নোটস আপলোড করা হয়নি।' 
                  : `${selectedSubject} বিষয়ের কোনো নোটস পাওয়া যায়নি।`
                }
              </p>
              {selectedSubject !== 'all' && (
                <Button
                  onClick={() => setSelectedSubject('all')}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white bangla-text"
                >
                  সব বিষয় দেখুন
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Card key={note.id} className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white mb-2 bangla-text line-clamp-2">
                        {note.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs bangla-text">
                          {note.subject}
                        </span>
                        {note.chapter && (
                          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs bangla-text">
                            {note.chapter}
                          </span>
                        )}
                      </div>
                    </div>
                    <FileText className="w-6 h-6 text-gray-400 flex-shrink-0 ml-2" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {note.content && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 bangla-text line-clamp-3">
                      {note.content}
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    {note.file_url && (
                      <>
                        <Button
                          onClick={() => handleViewNote(note)}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white bangla-text"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          দেখুন
                        </Button>
                        <Button
                          onClick={() => handleDownloadNote(note)}
                          variant="outline"
                          className="flex-1 bangla-text"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          ডাউনলোড
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-500 dark:text-gray-400 bangla-text">
                      আপলোড: {new Date(note.created_at).toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesViewer;
