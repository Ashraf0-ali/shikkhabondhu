
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, BookOpen, Quote, Key, Upload, LogOut, Settings, Book } from 'lucide-react';
import AdminLogin from './AdminLogin';
import MCQForm from './admin/MCQForm';
import NCTBForm from './admin/NCTBForm';
import QuotesForm from './admin/QuotesForm';
import ApiKeyForm from './admin/ApiKeyForm';
import CSVImport from './admin/CSVImport';
import ChatbotControl from './admin/ChatbotControl';

const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('mcq');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('admin_logged_in');
    const loginTime = localStorage.getItem('admin_login_time');
    
    if (adminLoggedIn === 'true' && loginTime) {
      const currentTime = Date.now();
      const loginTimestamp = parseInt(loginTime);
      const timeDifference = currentTime - loginTimestamp;
      const hoursElapsed = timeDifference / (1000 * 60 * 60);
      
      if (hoursElapsed < 24) {
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem('admin_logged_in');
        localStorage.removeItem('admin_login_time');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_login_time');
    setIsLoggedIn(false);
    toast({
      title: "লগআউট সফল",
      description: "আপনি সফলভাবে লগআউট হয়েছেন",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'mcq':
        return <MCQForm />;
      case 'nctb':
        return <NCTBForm />;
      case 'quotes':
        return <QuotesForm />;
      case 'api':
        return <ApiKeyForm />;
      case 'csv':
        return <CSVImport />;
      case 'chatbot':
        return <ChatbotControl />;
      default:
        return <MCQForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-2xl">
          <CardHeader className="text-center py-6">
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent bangla-text">
                🛠️ এডমিন প্যানেল
              </CardTitle>
              <Button onClick={handleLogout} variant="outline" className="bangla-text">
                <LogOut className="w-4 h-4 mr-2" />
                লগআউট
              </Button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 bangla-text">
              শিক্ষা উপকরণ ম্যানেজমেন্ট সিস্টেম
            </p>
          </CardHeader>
        </Card>

        {/* Tab Navigation */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
          <CardContent className="p-2">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'mcq', label: '📝 MCQ প্রশ্ন', icon: FileText },
                { id: 'nctb', label: '📚 NCTB বই', icon: BookOpen },
                { id: 'quotes', label: '💭 উদ্ধৃতি', icon: Quote },
                { id: 'api', label: '🔑 API কী', icon: Key },
                { id: 'csv', label: '📊 CSV ইমপোর্ট', icon: Upload },
                { id: 'chatbot', label: '🤖 চ্যাটবট কন্ট্রোল', icon: Settings }
              ].map(tab => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 bangla-text"
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600 bangla-text">
              Developed by Ashraf | যেকোনো প্রয়োজনে মেসেজ করুন - 
              <a href="https://wa.me/8801825210571" className="text-blue-600 hover:underline ml-1">
                WhatsApp: 01825210571
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
