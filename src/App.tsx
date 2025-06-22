
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import ChatInterface from "./components/ChatInterface";
import AdminPanel from "./components/AdminPanel";
import MCQSection from "./components/MCQSection";
import TipsSection from "./components/TipsSection";
import QuizSection from "./components/QuizSection";
import BottomNavigation from "./components/BottomNavigation";
import DarkModeToggle from "./components/DarkModeToggle";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen">
          <DarkModeToggle />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/mcqs" element={<MCQSection />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/tips" element={<TipsSection />} />
            <Route path="/quiz" element={<QuizSection />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNavigation />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
