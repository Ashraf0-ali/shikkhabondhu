
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';

const ChatbotControl = () => {
  const [chatbotSettings, setChatbotSettings] = useState({
    is_enabled: true,
    max_daily_requests: 100,
    system_prompt: 'আপনি একজন বাংলাদেশি শিক্ষা সহায়ক AI।'
  });

  return (
    <Card className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-white/30 shadow-xl">
      <CardHeader>
        <CardTitle className="bangla-text">🤖 চ্যাটবট কন্ট্রোল</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <h3 className="text-sm font-medium bangla-text">চ্যাটবট চালু/বন্ধ</h3>
            <p className="text-xs text-gray-500 bangla-text">চ্যাটবট সেবা নিয়ন্ত্রণ করুন</p>
          </div>
          <Switch
            checked={chatbotSettings.is_enabled}
            onCheckedChange={(checked) => setChatbotSettings({...chatbotSettings, is_enabled: checked})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium bangla-text">দৈনিক সর্বোচ্চ অনুরোধ</label>
          <Input
            type="number"
            value={chatbotSettings.max_daily_requests}
            onChange={(e) => setChatbotSettings({...chatbotSettings, max_daily_requests: parseInt(e.target.value)})}
            placeholder="দৈনিক সর্বোচ্চ অনুরোধ"
            className="bangla-text"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium bangla-text">সিস্টেম প্রম্পট</label>
          <Textarea
            value={chatbotSettings.system_prompt}
            onChange={(e) => setChatbotSettings({...chatbotSettings, system_prompt: e.target.value})}
            placeholder="সিস্টেম প্রম্পট"
            className="bangla-text min-h-[100px]"
          />
        </div>
        <Button className="w-full bangla-text">
          <Settings className="w-4 h-4 mr-2" />
          সেটিংস সংরক্ষণ করুন
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChatbotControl;
