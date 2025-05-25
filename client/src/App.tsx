import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import { UserProvider } from "@/contexts/user-context";
import { Navigation } from "@/components/navigation";
import { FloatingIcons } from "@/components/floating-icons";

// Import all pages
import Landing from "@/pages/landing";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import TopicInput from "@/pages/topic-input";
import Story from "@/pages/story";
import History from "@/pages/history";
import Achievements from "@/pages/achievements";
import Textbook from "@/pages/textbook";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/signup" component={Signup} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/learn/:subject" component={TopicInput} />
      <Route path="/story/:id" component={Story} />
      <Route path="/history" component={History} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/textbook" component={Textbook} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-white font-baloo">
              <FloatingIcons />
              <Navigation />
              <main className="relative z-10">
                <Router />
              </main>
              <Toaster />
            </div>
          </TooltipProvider>
        </UserProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
