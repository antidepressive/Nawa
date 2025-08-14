import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./contexts/LanguageContext";
import { FinanceProvider } from "./contexts/FinanceContext";
import { useEffect } from "react";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import Home from "./pages/Home";
import NotFound from "@/pages/not-found";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NawaCareer from "./pages/programs/NawaCareer";
import NawaConferences from "./pages/programs/NawaConferences";
import SaudiMunAssociation from "./pages/programs/SaudiMunAssociation";
import ConsultingTrainingProgram from "./pages/programs/ConsultingTrainingProgram";
import NawaWorkshop from "./pages/programs/NawaWorkshop";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import FinanceDashboard from "./pages/FinanceDashboard";

// Protected Admin Route Component
function ProtectedAdminRoute() {
  const token = sessionStorage.getItem('adminToken');
  
  if (!token) {
    // Redirect to login
    window.location.href = '/admin/login';
    return null;
  }
  
  return <Admin />;
}

function Router() {
  // Track page views when routes change
  useAnalytics();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/programs/nawa-career" component={NawaCareer} />
      <Route path="/programs/nawa-conferences" component={NawaConferences} />
      <Route path="/programs/saudi-mun-association" component={SaudiMunAssociation} />
      <Route path="/programs/consulting-training-program" component={ConsultingTrainingProgram} />
      <Route path="/programs/nawa-workshop" component={NawaWorkshop} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={ProtectedAdminRoute} />
      <Route path="/finance" component={FinanceDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    // Verify required environment variable is present
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <FinanceProvider>
            <Router />
            <Toaster />
          </FinanceProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
