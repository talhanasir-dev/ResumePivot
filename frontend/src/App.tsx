import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MasterResume from "./pages/MasterResume";
import JobAnalysis from "./pages/JobAnalysis";
import ResumeVersions from "./pages/ResumeVersions";
import CreateVersion from "./pages/CreateVersion";
import CoverLetters from "./pages/CoverLetters";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/master-resume" element={<MasterResume />} />
          <Route path="/job-analysis" element={<JobAnalysis />} />
          <Route path="/versions" element={<ResumeVersions />} />
          <Route path="/create-version" element={<CreateVersion />} />
          <Route path="/cover-letters" element={<CoverLetters />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;