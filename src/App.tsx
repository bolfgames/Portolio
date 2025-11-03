import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { I18nProvider } from './contexts/I18nContext';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const TeamMemberPage = lazy(() => import('./pages/TeamMemberPage'));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/:name" element={<TeamMemberPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <I18nProvider>
      <HashRouter>
        <Suspense fallback={
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-bolf-black flex items-center justify-center"
          >
            <motion.div 
              className="text-bolf-neon-blue text-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Loading...
            </motion.div>
          </motion.div>
        }>
          <AnimatedRoutes />
        </Suspense>
      </HashRouter>
    </I18nProvider>
  );
}

export default App;
