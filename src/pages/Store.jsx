import Navbar from '../components/home/Navbar.jsx';
import Footer from '../components/home/Footer.jsx';
import StoreHero from '../components/store/StoreHero.jsx';
import WhyStoreHelps from '../components/store/WhyStoreHelps.jsx';
import EssentialsSection from '../components/store/EssentialsSection.jsx';
import StoreTestimonials from '../components/store/StoreTestimonials.jsx';

export default function Store() {
  return (
    <>
      <Navbar />
      <main>
        <StoreHero />
        <WhyStoreHelps />
        <EssentialsSection />
        <StoreTestimonials />
      </main>
      <Footer />
    </>
  );
}
