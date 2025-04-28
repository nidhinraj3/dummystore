import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const products = [
  { id: 1, name: 'Red T-Shirt', price: 19.99 },
  { id: 2, name: 'Blue Jeans', price: 49.99 },
  { id: 3, name: 'Sneakers', price: 89.99 },
];

function Navbar({ cart }) {
  return (
    <nav className="bg-white shadow mb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">DummyStore</Link>
          <div className="flex space-x-6">
            <Link to="/products" className="text-gray-600 hover:text-blue-600">Products</Link>
            <Link to="/cart" className="text-gray-600 hover:text-blue-600">Cart ({cart.length})</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Home() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to DummyStore</h1>
      <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">Browse Products</Link>
    </div>
  );
}

function Products({ cart, setCart }) {
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="border rounded-xl p-6 shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cart({ cart }) {
  const navigate = useNavigate();

  const checkout = () => {
    navigate('/checkout');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>
      {cart.length === 0 ? <p className="text-center text-gray-600">Your cart is empty.</p> : (
        <div className="space-y-4">
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between border-b pb-2">
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="text-center mt-6">
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700" onClick={checkout}>Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Checkout() {
  const navigate = useNavigate();

  const placeOrder = () => {
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: Math.random().toString(36).substring(2, 15),
        value: 159.97,
        currency: 'USD',
        items: products.map(p => ({ id: p.id, name: p.name, price: p.price }))
      });
    }
    navigate('/thank-you');
  };

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <button className="bg-purple-600 text-white px-8 py-3 rounded hover:bg-purple-700" onClick={placeOrder}>Place Order</button>
    </div>
  );
}

function ThankYou() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold mb-6">Thank you for your purchase!</h1>
      <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">Back to Home</Link>
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);

  return (
    <Router>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-BRBHQYKKPM"></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-BRBHQYKKPM');
        `}
      </script>

      <Navbar cart={cart} />

      <div className="max-w-6xl mx-auto font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products cart={cart} setCart={setCart} />} />
          <Route path="/cart" element={<Cart cart={cart} />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
      </div>
    </Router>
  );
}
