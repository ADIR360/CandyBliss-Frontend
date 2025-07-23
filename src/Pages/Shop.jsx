// Add this state and functions to your ChocolateStore component

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Shop.css';
import logo from '../Components/Assets/logo.png';
import ProdImg1 from './ProdImg1.jpeg';
import ProdImg2 from './ProdImg2.jpeg';
import ProdImg3 from './ProdImg3.jpeg';
import ProdImg4 from './ProdImg4.jpeg';
import ProdImg5 from './ProdImg5.jpeg';
import ProdImg6 from './ProdImg6.jpeg';
import LVbro from './LVbro.jpeg';
import LVsis from './LVsis.jpeg';


const ChocolateStore = ({ 
  cartItems = [], 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  getTotalPrice, 
  getTotalItems 
}) => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showAddedToCartNotification, setShowAddedToCartNotification] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New state
  const lastScrollY = useRef(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current && window.scrollY > 40) {
        setIsNavbarHidden(true);
      } else {
        setIsNavbarHidden(false);
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside or on overlay
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-nav') && !event.target.closest('.hamburger')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
      document.addEventListener('click', handleClickOutside);
    } else {
      document.body.classList.remove('mobile-menu-open');
    }

    return () => {
      document.body.classList.remove('mobile-menu-open');
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const products = [
    {
      id: 1,
      name: "Strawberry Heart Chocolate Bar",
      description: "1 pcs - 80grms",
      price: 180.00,
      img: ProdImg2
    },
    {
      id: 2,
      name: "Rascality flavored bar",
      description: "1 pcs - 80grms",
      price: 160.00,
      img: ProdImg1
    },
    {
      id: 3,
      name: "Rakshabandhan Chocolate Bar - Love You Bro",
      description: "1 pcs - 100grms",
      price: 220.00,
      img: LVbro
    },
    {
      id: 4,
      name: "Rakshabandhan Chocolate Bar - Love You Sis",
      description: "1 pcs - 100grms",
      price: 220.00,
      img: LVsis
    },
    {
      id: 5,
      name: "Mango Chocolate Bar",
      description: "1 pcs - 80grms",
      price: 180.00,
      img: ProdImg6
    },
    {
      id: 6,
      name: "Exquisite Truffle Collection",
      description: "12 pcs - 250grms",
      price: 450.00,
      img: ProdImg3
    },
    {
      id: 7,
      name: "Premium Dry Fruit Chocolates",
      description: "1 Bar - 200grms, 6 mini bites - 15grms",
      price: 450.00,
      img: ProdImg4
    },
    {
      id: 8,
      name: "Dates Truffle Box assorted drizzled truffle",
      description: "12 pcs - 250grms",
      price: 450.00,
      img: ProdImg5
    }
  ];

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedProduct(product);
    setShowAddedToCartNotification(true);
    setTimeout(() => {
      setShowAddedToCartNotification(false);
      setAddedProduct(null);
    }, 2000);
  };

  const navigateToCart = () => {
    navigate('/cart');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNavClick = (section) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  const handleMobileCartClick = () => {
    setIsMobileMenuOpen(false);
    navigateToCart();
  };

  // Updated Header component with mobile menu
  const Header = () => (
    <>
      <header className={`header${isNavbarHidden ? ' header--hidden' : ''}`}>
        <div className="container">
          <nav className="nav">
            <div className="logo" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.2rem', 
              fontFamily: 'Montserrat, Poppins, Quicksand, sans-serif', 
              fontWeight: 700, 
              fontSize: '3.5rem', 
              letterSpacing: '1px' 
            }}>
              <img src={logo} alt="logo" className="navbar-logo-img" />
              <span>CandyBliss</span>
            </div>
            
            {/* Desktop Navigation */}
            <ul className="nav-links">
              <li 
                className={activeSection === 'home' ? 'active' : ''}
                onClick={() => setActiveSection('home')}
              >
                Home
              </li>
              <li 
                className={activeSection === 'products' ? 'active' : ''}
                onClick={() => setActiveSection('products')}
              >
                Products
              </li>
              <li 
                className={activeSection === 'about' ? 'active' : ''}
                onClick={() => setActiveSection('about')}
              >
                About
              </li>
              <li 
                className={activeSection === 'contact' ? 'active' : ''}
                onClick={() => setActiveSection('contact')}
              >
                Contact
              </li>
            </ul>
            
            {/* Desktop Cart Icon */}
            <div className="cart-icon" onClick={navigateToCart}>
              🛒
              {getTotalItems() > 0 && (
                <span className="cart-count">{getTotalItems()}</span>
              )}
            </div>
            
            {/* Mobile Hamburger Menu */}
            <div 
              className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} 
              onClick={toggleMobileMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </nav>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>
      
      {/* Mobile Navigation Menu */}
      <nav className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-header">
          <div className="mobile-nav-logo">
            <img src={logo} alt="logo" />
            <span>CandyBliss</span>
          </div>
          <button 
            className="mobile-nav-close"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ✕
          </button>
        </div>
        
        <ul className="mobile-nav-links">
          <li>
            <button 
              className={activeSection === 'home' ? 'active' : ''}
              onClick={() => handleMobileNavClick('home')}
            >
              🏠 Home
            </button>
          </li>
          <li>
            <button 
              className={activeSection === 'products' ? 'active' : ''}
              onClick={() => handleMobileNavClick('products')}
            >
              🍫 Products
            </button>
          </li>
          <li>
            <button 
              className={activeSection === 'about' ? 'active' : ''}
              onClick={() => handleMobileNavClick('about')}
            >
              ℹ️ About
            </button>
          </li>
          <li>
            <button 
              className={activeSection === 'contact' ? 'active' : ''}
              onClick={() => handleMobileNavClick('contact')}
            >
              📞 Contact
            </button>
          </li>
        </ul>
        
        <div className="mobile-cart-section">
          <button className="mobile-cart-button" onClick={handleMobileCartClick}>
            🛒 View Cart
            {getTotalItems() > 0 && (
              <span className="mobile-cart-count">{getTotalItems()}</span>
            )}
          </button>
        </div>
      </nav>
    </>
  );

  // Rest of your component remains the same...
  const Hero = () => (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">Indulge in Pure Chocolate Bliss</h1>
          <p className="hero-subtitle">
            Handcrafted chocolates made with love, using the finest ingredients from around the world
          </p>
          <button 
            className="cta-button"
            onClick={() => setActiveSection('products')}
          >
            🍫 Shop Now
          </button>
        </div>
        <div className="hero-decoration">
          <div className="floating-chocolate">🍫</div>
          <div className="floating-chocolate">🍪</div>
          <div className="floating-chocolate">🍰</div>
        </div>
      </div>
    </section>
  );

  const ProductCard = ({ product }) => (
    <div className="product-card">
      <div className="product-image">
        <img src={product.img} alt={product.name} className="product-img" />
        <div className="product-overlay">
          <button 
            className="quick-add"
            onClick={() => handleAddToCart(product)}
          >
            ✨ Quick Add
          </button>
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">₹{product.price}</span>
          <button 
            className="add-to-cart"
            onClick={() => handleAddToCart(product)}
          >
            Add to Cart 🛒
          </button>
        </div>
      </div>
    </div>
  );

  const Products = () => (
    <section className="products-section">
      <div className="container">
        <h2 className="section-title">Our Delicious Collection</h2>
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );

  const About = () => (
    <section className="about-section">
      <div className="container">
        <h2 className="section-title">About Choco Paradise</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
            I'm Meeta Dubey, founder of Candy Bliss - a handcrafted
            chocolate brand born out of my love for creativity and
            sweet indulgence. With 16 years of professional
            experience and a passion for personalized gifting, I started
            Candy Bliss in Dehradun to bring joy through beautifully
            crafted chocolates. Each piece is made with care, premium
            ingredients, and a touch of love - perfect for gifting or
            treating yourself. At Candy Bliss, we believe in making life
            a little sweeter, one bite at a time.
            </p>
            <p>
              Our chocolates are made using traditional techniques combined with 
              innovative flavors. We source our cocoa in  sustainable ways and 
              work directly to ensure the highest quality and fair trade practices.
            </p>
            <div className="features">
              <div className="feature">
                <span className="feature-icon">🌱</span>
                <h4>Sustainable Sourcing</h4>
                <p>Ethically sourced ingredients</p>
              </div>
              <div className="feature">
                <span className="feature-icon">👨‍🍳</span>
                <h4>Handcrafted</h4>
                <p>Made with love by expert chocolatiers</p>
              </div>
              <div className="feature">
                <span className="feature-icon">🏆</span>
                <h4>Heart Winning</h4>
                <p>Recognized for exceptional quality</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const Contact = () => (
    <section className="contact-section">
      <div className="container">
        <h2 className="section-title">Get in Touch</h2>
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <h4>Visit Us</h4>
                <p>Engineer's Enclave<br />GMS Road, Dehradun, 248001</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <h4>Call Us</h4>
                <p>+91 7453937763<br />Mon-Sat: 9AM-8PM</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <div>
                <h4>Email Us</h4>
                <p>meetadubey1205@gmail.com<br />We reply within 24 hours</p>
              </div>
            </div>
          </div>
          <div className="contact-form">
            <h3>Send us a Message</h3>
            <form>
              <input type="text" placeholder="Your Name" className="form-input" />
              <input type="email" placeholder="Your Email" className="form-input" />
              <textarea placeholder="Your Message" className="form-textarea"></textarea>
              <button type="submit" className="form-submit">Send Message 📨</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );

  const CartModal = ({ cartItems, updateQuantity, removeFromCart, getTotalPrice, onClose }) => (
    <div className="cart-modal" onClick={onClose}>
      <div className="cart-content" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h3 className="cart-title">Your Cart 🛒</h3>
          <button className="close-cart" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty 😢</p>
              <button 
                className="shop-now-btn"
                onClick={() => {
                  onClose();
                  setActiveSection('products');
                }}
              >
                Start Shopping 🛍️
              </button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <span className="item-emoji">{item.emoji}</span>
                  <div>
                    <h4>{item.name}</h4>
                    <p>₹{item.price} each</p>
                  </div>
                </div>
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button 
                  className="remove-item"
                  onClick={() => removeFromCart(item.id)}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <h3>Total: ₹{getTotalPrice()}</h3>
            </div>
            <button className="checkout-btn" onClick={navigateToCart}>
              View Full Cart 🛒
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const AddedToCartNotification = () => (
    <div className={`added-to-cart-notification ${showAddedToCartNotification ? 'show' : ''}`}>
      <div className="notification-content">
        <span className="notification-emoji">{addedProduct?.emoji}</span>
        <div className="notification-text">
          <p><strong>{addedProduct?.name}</strong></p>
          <p></p>
        </div>
      </div>
    </div>
  );

  const Footer = () => (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Candy Bliss</h4>
            <p>Making the world sweeter, one chocolate at a time.</p>
            <div className="social-links">
              <span>📘</span>
              <span>📷</span>
              <span>🐦</span>
            </div>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li onClick={() => setActiveSection('home')}>Home</li>
              <li onClick={() => setActiveSection('products')}>Products</li>
              <li onClick={() => setActiveSection('about')}>About</li>
              <li onClick={() => setActiveSection('contact')}>Contact</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Customer Care</h4>
            <ul>
              <li>Shipping Info</li>
              <li>Returns</li>
              <li>FAQ</li>
              <li>Support</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Candy Bliss. Made with ❤️ and lots of chocolate.</p>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="app">
      <Header />
      {activeSection === 'home' && (
        <>
          <Hero />
          <Products />
        </>
      )}
      {activeSection === 'products' && <Products />}
      {activeSection === 'about' && <About />}
      {activeSection === 'contact' && <Contact />}
      <Footer />
      {isCartOpen && (
        <CartModal
          cartItems={cartItems}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          getTotalPrice={getTotalPrice}
          onClose={() => setIsCartOpen(false)}
        />
      )}
      <AddedToCartNotification />
    </div>
  );
};

export default ChocolateStore;