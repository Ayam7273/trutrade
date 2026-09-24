import Navbar from '../components/home/Navbar.jsx';
import Footer from '../components/home/Footer.jsx';
import ContactHero from '../components/contact/ContactHero.jsx';
import ContactInfoSection from '../components/contact/ContactInfoSection.jsx';
import FaqSection from '../components/contact/FaqSection.jsx';

export default function Contact() {
  return (
    <>
      <Navbar />
      <main>
        <ContactHero />
        <ContactInfoSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
