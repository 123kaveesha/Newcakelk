 // App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Navbar from "./components/Navbar";
import Contact from "./pages/Contact"; // Import contact page
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";// Import checkout page

import Products from "./pages/Products";// Import product page
import Customize from "./pages/Customize";// Import Customize page
import Bakers from "./pages/Bakers";// Import Bakers page
import Browse from "./pages/Browse";// Import Browse page
import Cart from "./pages/Cart";
import Cakemaker from "./pages/Cakemaker";





 


 

function App() {
  return (
    <Router>
      <Navbar />
    
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} /> {/* 🆕 Contact route */}
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="/products" element={<Products />} />
        <Route path="/customize" element={<Customize/>} />
        <Route path="/bakers" element={<Bakers/>} />
        <Route path="/browse" element={<Browse/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/cakemaker" element={<Cakemaker/>} />
        
        
         
       
        
        
        
         
         
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
