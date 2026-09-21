import Navbar from '../components/home/Navbar.jsx';
import Hero from '../components/home/Hero.jsx';
import FeatureHighlights from '../components/home/FeatureHighlights.jsx';
import TrustedByLogos from '../components/home/TrustedByLogos.jsx';
import InfraSection from '../components/home/InfraSection.jsx';
import RecentActivitySection from '../components/home/RecentActivitySection.jsx';
import TestimonialsCarousel from '../components/home/TestimonialsCarousel.jsx';
import BlogPreview from '../components/home/BlogPreview.jsx';
import LoopSection from '../components/home/LoopSection.jsx';
import NewsletterCTA from '../components/home/NewsletterCTA.jsx';
import Footer from '../components/home/Footer.jsx';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeatureHighlights />
        <TrustedByLogos />
        <InfraSection />
        <RecentActivitySection />
        <TestimonialsCarousel />
        <BlogPreview />
        <LoopSection />
        <NewsletterCTA />
      </main>
      <Footer />
    </>
  );
}
