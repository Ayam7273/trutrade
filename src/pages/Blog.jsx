import Navbar from '../components/home/Navbar.jsx';
import Footer from '../components/home/Footer.jsx';
import FaqSection from '../components/contact/FaqSection.jsx';
import BlogList from '../components/blog/BlogList.jsx';
import { blogFaqs } from '../data/blogContent';

export default function Blog() {
  return (
    <>
      <Navbar />
      <main>
        <BlogList />
        <FaqSection items={blogFaqs} />
      </main>
      <Footer />
    </>
  );
}
