import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Redirect, Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ShadowKhan from "./pages/ShadowKhan";
import DragonFistX from "./pages/DragonFistX";
import DragonFistXGameLocal from "./pages/DragonFistXGameLocal";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/shadowkhantcg"} component={ShadowKhan} />
      <Route path={"/dfx"} component={DragonFistX} />
      <Route path={"/dragonfistx"} component={DragonFistXGameLocal} />
      <Route path={"/dfx/demo"}><Redirect to="/dragonfistx" replace /></Route>
      <Route path={"/privacy-policy"} component={PrivacyPolicy} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isGameRoute = location === "/dragonfistx";

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          {!isGameRoute && <Navbar />}
          <Router />
          {!isGameRoute && <Footer />}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
