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
<<<<<<< HEAD
import DashboardLayout from './components/dashboard/DashboardLayout.jsx';
import DashboardOverview from './pages/dashboard/DashboardOverview.jsx';
import DashboardProducts from './pages/dashboard/DashboardProducts.jsx';
import DashboardStore from './pages/dashboard/DashboardStore.jsx';
import DashboardStoreEdit from './pages/dashboard/DashboardStoreEdit.jsx';
import DashboardOrders from './pages/dashboard/DashboardOrders.jsx';
import DashboardOrderDetail from './pages/dashboard/DashboardOrderDetail.jsx';
import DashboardPayments from './pages/dashboard/DashboardPayments.jsx';
import DashboardPlaceholder from './pages/dashboard/DashboardPlaceholder.jsx';
import DashboardReviews from './pages/dashboard/DashboardReviews.jsx';
import DashboardNotifications from './pages/dashboard/DashboardNotifications.jsx';
import { withdrawalAccountPlaceholder } from './data/dashboardContent';
import DashboardWithdraw from './pages/dashboard/DashboardWithdraw.jsx';
import DashboardTransactionDetail from './pages/dashboard/DashboardTransactionDetail.jsx';
import DashboardProductNew from './pages/dashboard/DashboardProductNew.jsx';
import DashboardProductEdit from './pages/dashboard/DashboardProductEdit.jsx';

export default function App() {
  return (
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
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="store" element={<DashboardStore />} />
          <Route path="store/edit" element={<DashboardStoreEdit />} />
          <Route path="orders" element={<DashboardOrders />} />
          <Route path="orders/:orderId" element={<DashboardOrderDetail />} />
          <Route path="payments" element={<DashboardPayments />} />
          <Route path="reviews" element={<DashboardReviews />} />
          <Route path="notifications" element={<DashboardNotifications />} />
          <Route path="payments/withdraw" element={<DashboardWithdraw />} />
          <Route path="payments/transactions/:id" element={<DashboardTransactionDetail />} />
          <Route
            path="payments/account"
            element={<DashboardPlaceholder title={withdrawalAccountPlaceholder} />}
          />
          <Route path="products" element={<DashboardProducts />} />
          <Route path="products/new" element={<DashboardProductNew />} />
          <Route path="products/:id/edit" element={<DashboardProductEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
=======
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
>>>>>>> 22227f055407f199700b11871ce08e25cefd7c5c
  );
}
