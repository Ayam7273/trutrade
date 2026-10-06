import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import RequireAuth from './components/routing/RequireAuth.jsx';
import RequireVerified from './components/routing/RequireVerified.jsx';
import RequireRole from './components/routing/RequireRole.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Store from './pages/Store.jsx';
import Contact from './pages/Contact.jsx';
import Blog from './pages/Blog.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Verify from './pages/Verify.jsx';
import Marketplace from './pages/Marketplace.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/store" element={<Store />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route element={<RequireAuth />}>
            <Route path="/verify" element={<Verify />} />

            <Route element={<RequireVerified />}>
              <Route element={<RequireRole role="buyer" />}>
                <Route path="/marketplace" element={<Marketplace />} />
              </Route>
              <Route element={<RequireRole role="seller" />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
