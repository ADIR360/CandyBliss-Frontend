// Add this state and functions to your ChocolateStore component

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import ProdImg7 from './ProdImg7.jpeg';
import ProdImg8 from './ProdImg8.jpeg';
import GiftBox1 from './gift-box1-1.jpg';
import GiftBox2 from './gift-box1-2.jpg';
import GiftBox3 from './gift-box2-1.jpg';
import GiftBox4 from './gift-box2-2.jpg';
import GiftBox5 from './gift-box3-1.jpg';
import GiftBox6 from './gift-box3-2.jpg';
import GiftBox7 from './gift-box4-1.jpg';
import GiftBox8 from './gift-box4-2.jpg';
import GiftBox9 from './gift-box5-1.jpg';
import GiftBox10 from './gift-box5-2.jpg';
import GiftBox11 from './gift-box6-1.jpg';
import GiftBox12 from './gift-box6-2.jpg';
import GiftBox13 from './gift-box7-1.jpg';
import GiftBox14 from './gift-box7-2.jpg';
import GiftBox15 from './gift-box8-1.jpg';
import GiftBox16 from './gift-box8-2.jpg';
import GiftBox17 from './gift-box9-1.jpg';
import GiftBox18 from './gift-box9-2.jpg';
import GiftBox19 from './gift-box10-1.jpg';
import GiftBox20 from './gift-box10-2.jpg';


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
  const [activeProductCategory, setActiveProductCategory] = useState('gift-hampers'); // Changed default to gift-hampers
  const [sortBy, setSortBy] = useState('default'); // Moved sort state to main component level
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
      price: 170.00,
      img: ProdImg2,
      category: "chocolates"
    },
    {
      id: 2,
      name: "Rascality flavored bar",
      description: "1 pcs - 80grms",
      price: 150.00,
      img: ProdImg1,
      category: "chocolates"
    },
    {
      id: 3,
      name: "Rakshabandhan Chocolate Bar - Love You Bro",
      description: "1 pcs - 100grms",
      price: 200.00,
      img: LVbro,
      category: "chocolates"
    },
    {
      id: 4,
      name: "Rakshabandhan Chocolate Bar - Love You Sis",
      description: "1 pcs - 100grms",
      price: 200.00,
      img: LVsis,
      category: "chocolates"
    },
    {
      id: 5,
      name: "Mango Chocolate Bar",
      description: "1 pcs - 80grms",
      price: 170.00,
      img: ProdImg6,
      category: "chocolates"
    },
    {
      id: 6,
      name: "Exquisite Truffle Collection",
      description: "12 pcs - 250grms",
      price: 450.00,
      img: ProdImg3,
      category: "chocolates"
    },
    {
      id: 7,
      name: "Premium Dry Fruit Chocolates",
      description: "1 Bar - 200grms, 6 mini bites - 15grms",
      price: 450.00,
      img: ProdImg4,
      category: "chocolates"
    },
    {
      id: 8,
      name: "Dates Truffle Box assorted drizzled truffle",
      description: "12 pcs - 250grms",
      price: 450.00,
      img: ProdImg5,
      category: "chocolates"
    },
    {
      id: 9,
      name: "Chocolate Coated Fox Nuts",
      description: "1 box - 250grms",
      price: 450.00,
      img: ProdImg7,
      category: "chocolates"
    },
    {
      id: 10,
      name: "Mango Bloom Chocolate Bar",
      description: "(customizable)1 pcs - 100grms",
      price: 220.00,
      img: ProdImg8,
      category: "chocolates"
    },
    // Gift Hampers - Reordered according to specified sequence
    // Row 1: id 17, id 19, id 15
    {
      id: 17,
      name: "Festival of Flavors",
      description: "Elegant packaging for business gifting",
      price: 2700.00,
      img: GiftBox1,
      category: "gift-hampers"
    },
    {
      id: 19,
      name: "Saffon Harvest",
      description: "Elegant packaging for business gifting",
      price: 2500.00,
      img: GiftBox1,
      category: "gift-hampers"
    },
    {
      id: 15,
      name: "Harvest Delight",
      description: "Elegant packaging for business gifting",
      price: 2200.00,
      img: GiftBox1,
      category: "gift-hampers"
    },
    // Row 2: id 14, id 18, id 12
    {
      id: 14,
      name: "Exotic Dry Fruit Medley",
      description: "Elegant packaging for business gifting",
      price: 1200.00,
      img: GiftBox1,
      category: "gift-hampers"
    },
    {
      id: 18,
      name: "Lumina Nut Wooden Crate",
      description: "Elegant packaging for business gifting",
      price: 3800.00,
      img: GiftBox1,
      category: "gift-hampers"
    },
    {
      id: 12,
      name: "Nutty Treats",
      description: "Perfect for anniversaries & special moments",
      price: 1200.00,
      img: GiftBox1,
      category: "gift-hampers"
    },
    // Row 3: id 20, id 11, id 13
    {
      id: 20,
      name: "Nutri Blossom",
      description: "Elegant packaging for business gifting",
      price: 1400.00,
      img: GiftBox1,
      category: "gift-hampers"
    },
    {
      id: 11,
      name: "Festive Bites",
      description: "Premium assortment with truffles, bars & dry fruits",
      price: 1200.00,
      img: GiftBox1,
      category: "gift-hampers"
    },
    {
      id: 13,
      name: "Grand Nutty",
      description: "Large collection for family gatherings & parties",
      price: 1600.00,
      img: GiftBox1,
      category: "gift-hampers"
    },
    // Row 4: id 16
    {
      id: 16,
      name: "Natures Delight",
      description: "Elegant packaging for business gifting",
      price: 1500.00,
      img: GiftBox1,
      category: "gift-hampers"
    }
  ];

  const handleAddToCart = useCallback((product) => {
    addToCart(product);
    setAddedProduct(product);
    setShowAddedToCartNotification(true);
    setTimeout(() => {
      setShowAddedToCartNotification(false);
      setAddedProduct(null);
    }, 2000);
  }, [addToCart]);

  const navigateToCart = useCallback(() => {
    navigate('/cart');
  }, [navigate]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((open) => !open);
  }, []);

  const handleMobileNavClick = useCallback((section) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  }, []);

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
              <li 
                className={activeSection === 'order-tracking' ? 'active' : ''}
                onClick={() => { setActiveSection('order-tracking'); navigate('/order-tracking'); }}
              >
                Order Tracking
              </li>
            </ul>
            
            {/* Desktop Cart Icon */}
            <div className="cart-icon desktop-only" onClick={navigateToCart}>
              🛒
              {getTotalItems() > 0 && (
                <span className="cart-count">{getTotalItems()}</span>
              )}
            </div>
            {/* Mobile Cart Icon (left of hamburger) */}
            <div className="cart-icon mobile-only" onClick={navigateToCart} style={{marginRight: '0.5rem'}}>
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
          <li>
            <button 
              className={activeSection === 'order-tracking' ? 'active' : ''}
              onClick={() => { setActiveSection('order-tracking'); setIsMobileMenuOpen(false); navigate('/order-tracking'); }}
            >
             🚚 Order Tracking
            </button>
          </li>
        </ul>
        
        {/* Removed mobile cart section from hamburger menu */}
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

  const ProductCard = React.memo(({ product }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // For gift hampers, use different images based on product ID
    const productImages = product.category === "gift-hampers" 
      ? product.id === 12 
        ? [GiftBox3, GiftBox4] // Product 2 (Romantic Couple's Gift Box) uses GiftBox3 and GiftBox4
        : product.id === 13
        ? [GiftBox5, GiftBox6] // Product 3 (Family Celebration Hamper) uses GiftBox5 and GiftBox6
        : product.id === 14
        ? [GiftBox7, GiftBox8] // Product 4 uses GiftBox7 and GiftBox8
        : product.id === 15
        ? [GiftBox9, GiftBox10] // Product 5 uses GiftBox9 and GiftBox10
        : product.id === 16
        ? [GiftBox11, GiftBox12] // Product 6 uses GiftBox11 and GiftBox12
        : product.id === 17
        ? [GiftBox13, GiftBox14] // Product 7 uses GiftBox13 and GiftBox14
        : product.id === 18
        ? [GiftBox15, GiftBox16] // Product 8 uses GiftBox15 and GiftBox16
        : product.id === 19
        ? [GiftBox17, GiftBox18] // Product 9 uses GiftBox17 and GiftBox18
        : product.id === 20
        ? [GiftBox19, GiftBox20] // Product 10 uses GiftBox19 and GiftBox20
        : [GiftBox1, GiftBox2] // Other gift hampers use GiftBox1 and GiftBox2
      : [product.img]; // Single image for chocolates
    
    const nextImage = useCallback(() => {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }, [productImages.length]);
    
    const prevImage = () => {
      setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
    };
    
    const goToImage = (index) => {
      setCurrentImageIndex(index);
    };

    return (
      <div className="product-card">
        <div className="product-image">
          <img 
            src={productImages[currentImageIndex]} 
            alt={product.name} 
            className="product-img" 
          />
          
          {/* Navigation arrows for gift hampers */}
          {product.category === "gift-hampers" && productImages.length > 1 && (
            <>
              <button 
                className="slide-arrow slide-arrow-left"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                ‹
              </button>
              <button 
                className="slide-arrow slide-arrow-right"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                ›
              </button>
            </>
          )}
          
          {/* Dots indicator for gift hampers */}
          {product.category === "gift-hampers" && productImages.length > 1 && (
            <div className="slide-dots">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  className={`slide-dot ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToImage(index);
                  }}
                />
              ))}
            </div>
          )}
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
  });

  const Products = () => {
    const chocolateProducts = products.filter(product => product.category === "chocolates");
    const giftHamperProducts = products.filter(product => product.category === "gift-hampers");

    const handleCategoryToggle = (category) => {
      setActiveProductCategory(category);
      setSortBy('default'); // Reset sort when changing categories
      
      // Auto-scroll to products section with 5ms delay
      setTimeout(() => {
        const productsSection = document.querySelector('.products-section');
        if (productsSection) {
          // Add offset for better visibility
          const targetScroll = productsSection.offsetTop - 100; // 100px offset from top
          
          window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
          });
        }
      }, 5);
    };

    const handleSort = (sortType) => {
      setSortBy(sortType);
    };

    const sortProducts = (productList) => {
      switch (sortBy) {
        case 'price-high-low':
          return [...productList].sort((a, b) => b.price - a.price);
        case 'price-low-high':
          return [...productList].sort((a, b) => a.price - b.price);
        default:
          return productList;
      }
    };

    const sortedChocolateProducts = sortProducts(chocolateProducts);
    const sortedGiftHamperProducts = sortProducts(giftHamperProducts);

    return (
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">Our Delicious Collection</h2>
          
          {/* Category Toggle */}
          <div className="category-toggle">
            <button 
              className={`toggle-btn ${activeProductCategory === 'gift-hampers' ? 'active' : ''}`}
              onClick={() => handleCategoryToggle('gift-hampers')}
            >
              🎁 Hampers
            </button>
            <button 
              className={`toggle-btn ${activeProductCategory === 'chocolates' ? 'active' : ''}`}
              onClick={() => handleCategoryToggle('chocolates')}
            >
              🍫 Chocolates
            </button>
          </div>

          {/* Sort By Tab */}
          <div className="sort-section">
            <div className="sort-label">Sort by:</div>
            <div className="sort-options">
              <button 
                className={`sort-btn ${sortBy === 'default' ? 'active' : ''}`}
                onClick={() => handleSort('default')}
              >
                Default
              </button>
              <button 
                className={`sort-btn ${sortBy === 'price-high-low' ? 'active' : ''}`}
                onClick={() => handleSort('price-high-low')}
              >
                Price: High to Low
              </button>
              <button 
                className={`sort-btn ${sortBy === 'price-low-high' ? 'active' : ''}`}
                onClick={() => handleSort('price-low-high')}
              >
                Price: Low to High
              </button>
            </div>
          </div>

          {/* Chocolates Section */}
          {activeProductCategory === 'chocolates' && (
            <div className="category-section">
              <h3 className="category-title">🍫 Handcrafted Chocolates</h3>
              <p className="category-description">Discover our premium selection of artisanal chocolates, each crafted with love and the finest ingredients.</p>
              <div className="products-grid">
                {sortedChocolateProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Gift Hampers Section */}
          {activeProductCategory === 'gift-hampers' && (
            <div className="category-section">
              <h3 className="category-title">🎁 Hampers Collections</h3>
              <p className="category-description">Perfect for every occasion - from romantic gestures to corporate gifting, our hampers are thoughtfully curated.</p>
              <div className="products-grid">
                {sortedGiftHamperProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  };

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

  const CartModal = React.memo(({ cartItems, updateQuantity, removeFromCart, getTotalPrice, onClose }) => (
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
  ));

  const AddedToCartNotification = React.memo(() => (
    <div className={`added-to-cart-notification ${showAddedToCartNotification ? 'show' : ''}`}>
      <div className="notification-content">
        <span className="notification-emoji">{addedProduct?.emoji}</span>
        <div className="notification-text">
          <p><strong>{addedProduct?.name}</strong></p>
          <p></p>
        </div>
      </div>
    </div>
  ));

  const Footer = React.memo(() => (
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
  ));

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