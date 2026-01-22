import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { RentCategory } from './pages/RentCategory';
import { ProductDetails } from './pages/ProductDetails';

function App() {
  return (
    <Router>
      <ScrollToTopComp /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/rent-category/:slug" element={<RentCategory />} />
        <Route path="/browse-ads/:id" element={<ProductDetails />} />
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center">Page Coming Soon</div>} />
      </Routes>
    </Router>
  );
}

// Simple internal ScrollToTop component
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTopComp = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default App;
