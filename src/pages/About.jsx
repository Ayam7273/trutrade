import Navbar from '../components/home/Navbar.jsx';
import Footer from '../components/home/Footer.jsx';
import AboutHero from '../components/about/AboutHero.jsx';
import MissionSection from '../components/about/MissionSection.jsx';
import ValuesGrid from '../components/about/ValuesGrid.jsx';
import CtaBanner from '../components/about/CtaBanner.jsx';
import { aboutCtaContent } from '../data/aboutContent';

export default function About() {
  return (
    <>
      <Navbar />
      <main>
        <AboutHero />
        <MissionSection />
        <ValuesGrid />
        <CtaBanner
          title={aboutCtaContent.title}
          body={aboutCtaContent.body}
          cta={aboutCtaContent.cta}
          ctaHref={aboutCtaContent.ctaHref}
        />
      </main>
      <Footer />
    </>
  );
}
