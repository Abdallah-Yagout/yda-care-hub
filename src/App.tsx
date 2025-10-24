import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";

// Public Pages
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Programs from "./pages/Programs";
import ProgramDetail from "./pages/ProgramDetail";
import Resources from "./pages/Resources";
import ResourceDetail from "./pages/ResourceDetail";
import GetInvolved from "./pages/GetInvolved";
import Contact from "./pages/Contact";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set document direction and language based on current language
    const isRTL = i18n.language === "ar";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
    
    // Add RTL class to body for additional styling hooks
    if (isRTL) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  }, [i18n.language]);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Redirect root to Arabic (default) */}
              <Route path="/" element={<Navigate to="/ar" replace />} />
              
              {/* Public Routes - locale restricted to ar|en */}
              <Route path="/:locale(ar|en)" element={<Index />} />
              <Route path="/:locale(ar|en)/events" element={<Events />} />
              <Route path="/:locale(ar|en)/events/:slug" element={<EventDetail />} />
              <Route path="/:locale(ar|en)/programs" element={<Programs />} />
              <Route path="/:locale(ar|en)/programs/:slug" element={<ProgramDetail />} />
              <Route path="/:locale(ar|en)/resources" element={<Resources />} />
              <Route path="/:locale(ar|en)/resources/:slug" element={<ResourceDetail />} />
              <Route path="/:locale(ar|en)/get-involved" element={<GetInvolved />} />
              <Route path="/:locale(ar|en)/contact" element={<Contact />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
