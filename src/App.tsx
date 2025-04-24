import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/lib/AuthContext";
import { ProjectProvider } from "@/lib/ProjectContext";
import TestPage from "@/pages/TestPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ProjectProvider>
          <BrowserRouter>
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
                <Route path="/dashboard/project/:id" element={<AdminProjectEditor />} />
                {/* Speciale route voor Snotyoung project om URI encoding problemen te omzeilen */}
                <Route path="/dashboard/project/snotyoung" element={<AdminProjectEditor specialProjectId="1" />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ProjectProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
