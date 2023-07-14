import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Home, Contact, Login, Register, Reset, Admin } from './pages'
import {Header, Footer} from './components'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminOnlyRoute from "./components/adminOnlyRoute/AdminOnlyRoute";
import ProductDetails from "./components/product/productDetails/ProductDetails";
import Cart from "./pages/cart/Cart";
import CheckoutDetails from "./pages/checkout/CheckoutDetails";
import Checkout from "./pages/checkout/Checkout";
import CheckoutSuccess from "./pages/checkout/CheckoutSuccess";
import ReviewProducts from "./components/reviewProducts/ReviewProducts";

function App() {
  return (
    <div>
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>} />
          <Route path="/reset" element={<Reset/>} />
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/checkout-details" element={<CheckoutDetails/>}/>
          <Route path="/checkout" element={<Checkout/>}/>
          <Route path="/checkout-success" element={<CheckoutSuccess/>} />
          <Route path="/review-product/:id" element={<ReviewProducts/>}/>
          <Route path="/admin/*" element={
          <AdminOnlyRoute>
            <Admin/>
            </AdminOnlyRoute>
          }/>
          <Route path="/product-details/:id" element={<ProductDetails/>} />
        </Routes>
        <Footer/>
      </Router>
      <ToastContainer/>
    </div>
  );
}

export default App;
