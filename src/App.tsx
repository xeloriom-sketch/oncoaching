import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";

import { Toaster }                    from "@/components/ui/toaster";
import { Toaster as Sonner }          from "@/components/ui/sonner";
import { TooltipProvider }            from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ScrollToTop from "./components/ScrollToTop";
import PageLoader  from "./components/PageLoader";

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
const Index               = lazy(() => import("./pages/Index"));
const About               = lazy(() => import("./pages/About"));
const Contact             = lazy(() => import("./pages/Contact"));
const NosTarifs           = lazy(() => import("./pages/NosTarifs"));
const CoachingScolaire    = lazy(() => import("./pages/Services/CoachingScolaire"));
const CoachingJeunes      = lazy(() => import("./pages/Services/CoachingJeunes"));
const CoachingNeurofeedback = lazy(() => import("./pages/Services/CoachingNeurofeedback"));
const CoachingEquipe      = lazy(() => import("./pages/Services/CoachingEquipe"));
const Partenaires         = lazy(() => import("./pages/Partenaires"));
const NotFound            = lazy(() => import("./pages/NotFound"));

// ─── Query client (content cached for entire session) ─────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime:    1000 * 60 * 60,
      retry:     1,
    },
  },
});

// ─── Suspense fallback minimal ─────────────────────────────────────────────────
const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-6 h-6 border-2 border-[#1ab5c7] border-t-transparent rounded-full animate-spin" />
  </div>
);

// ─── Lenis smooth scroll ──────────────────────────────────────────────────────
const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
};

// ─── App ──────────────────────────────────────────────────────────────────────
const App = () => {
  useLenis();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Loader Awwwards — affiché à chaque chargement */}
        <PageLoader />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <ScrollToTop />
          <Suspense fallback={<SuspenseFallback />}>
            <Routes>
              <Route path="/"                       element={<Index />} />
              <Route path="/about"                  element={<About />} />
              <Route path="/contact"                element={<Contact />} />
              <Route path="/NosTarifs"              element={<NosTarifs />} />
              <Route path="/coaching-scolaire"      element={<CoachingScolaire />} />
              <Route path="/coaching-jeunes"        element={<CoachingJeunes />} />
              <Route path="/coaching-neurofeedback" element={<CoachingNeurofeedback />} />
              <Route path="/coaching-equipe"        element={<CoachingEquipe />} />
              <Route path="/partenaires"            element={<Partenaires />} />
              <Route path="*"                       element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
