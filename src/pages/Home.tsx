import { lazy, Suspense } from 'react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import Footer from '../components/sections/Footer';
import TubesCursorWrapper from '../components/common/TubesCursor';

// Lazy load sections for better performance
const ProjectsSection = lazy(() => import('../components/sections/ProjectsSection'));
const TeamSection = lazy(() => import('../components/sections/TeamSection'));

function Home() {
  return (
    <Layout>
      <TubesCursorWrapper />
      <HeroSection />
      <Suspense fallback={<div className="h-screen bg-bolf-black" />}>
        <TeamSection />
      </Suspense>
      <AboutSection />
      <Suspense fallback={<div className="h-screen bg-bolf-black" />}>
        <ProjectsSection />
      </Suspense>
      <Footer />
    </Layout>
  );
}

export default Home;

