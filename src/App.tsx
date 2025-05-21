import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Layout from "@/components/Layout";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminProjectEditor from "@/pages/AdminProjectEditor";
import ContactMessages from "@/pages/ContactMessages";
import MediaLibrary from "@/pages/MediaLibrary";
import HomeEditor from "@/pages/HomeEditor";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/lib/AuthContext";
import { ProjectProvider } from "@/lib/ProjectContext";
import { ContactProvider } from "@/lib/ContactContext";
import { HomeProvider } from "@/lib/HomeContext";
import TestPage from "@/pages/TestPage";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Wrapper component voor de refresh functionaliteit
const AppRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Functie om pagina's te refreshen bij specifieke problemen
    const handlePageRefresh = () => {
      // Luister naar een custom event dat kan worden gedispatched wanneer er een probleem is
      const refreshHandler = (event: CustomEvent) => {
        // We kunnen de route meegeven als detail als we naar een specifieke pagina willen navigeren
        const targetRoute = event.detail?.route || location.pathname;
        
        // Forceer een navigatie naar dezelfde of opgegeven route om een refresh te triggeren
        navigate(targetRoute, { replace: true });
      };

      // Voeg event listener toe
      window.addEventListener('app:refresh-page' as any, refreshHandler as EventListener);

      // Cleanup
      return () => {
        window.removeEventListener('app:refresh-page' as any, refreshHandler as EventListener);
      };
    };

    handlePageRefresh();
  }, [navigate, location]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
          
        {/* Test Routes */}
        <Route path="/test" element={<TestPage />} />
        
        {/* Admin Login Route (Buiten AuthProvider voor troubleshooting) */}
        <Route path="/admin" element={<AdminLogin />} />
        
        {/* Protected Admin Routes binnen AuthProvider */}
        <Route element={
          <AuthProvider>
            <ProtectedRoute />
          </AuthProvider>
        }>
          <Route path="/dashboard" element={<AdminDashboard />} />
          {/* Speciale route voor Snotyoung project om URI encoding problemen te omzeilen */}
          <Route path="/dashboard/project/snotyoung" element={<AdminProjectEditor specialProjectId="1" />} />
          {/* Andere project routes */}
          <Route path="/dashboard/project/:id" element={<AdminProjectEditor />} />
          {/* Homepage editor route */}
          <Route path="/dashboard/home-editor" element={<HomeEditor />} />
          {/* Contact en Media routes */}
          <Route path="/dashboard/contact" element={<ContactMessages />} />
          <Route path="/dashboard/media" element={<MediaLibrary />} />
        </Route>
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ProjectProvider>
          <ContactProvider>
            <HomeProvider>
              <BrowserRouter>
                <AppRouter />
              </BrowserRouter>
            </HomeProvider>
          </ContactProvider>
        </ProjectProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
