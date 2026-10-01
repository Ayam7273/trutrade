import Navbar from '../components/home/Navbar.jsx';
import Footer from '../components/home/Footer.jsx';
import ServicesHero from '../components/services/ServicesHero.jsx';
import ServicesGrid from '../components/services/ServicesGrid.jsx';
import HowItWorks from '../components/services/HowItWorks.jsx';
import ServicesTestimonials from '../components/services/ServicesTestimonials.jsx';
import CtaBanner from '../components/about/CtaBanner.jsx';
import { servicesCtaContent } from '../data/servicesContent';

export default function Services() {
  return (
    <>
      <Navbar />
      <main>
        <ServicesHero />
        <ServicesGrid />
        <HowItWorks />
        <ServicesTestimonials />
        <CtaBanner
          title={servicesCtaContent.title}
          body={servicesCtaContent.body}
          cta={servicesCtaContent.cta}
          ctaHref={servicesCtaContent.ctaHref}
        />
      </main>
      <Footer />
    </>
  );
}
