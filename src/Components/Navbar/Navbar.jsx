import React from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom';
const Navbar = () => {
  return (
    <div className='navbar'>
      <div className='navbar-logo'>
        <img src={logo} alt="logo" />
        <p>CandyBliss</p>
      </div>
      <ul className='navbar-menu'>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/product'>Products</Link></li>
        <li>About us</li>
        <li><Link to='/cart'>Cart</Link></li>
      </ul>
      <div className='nav-login-cart'>
        <Link to='/login'><button>Login</button></Link>
        <Link to='/cart'><img src={cart} alt="cart" /></Link>
      </div>
    </div>
  )
}

export default Navbar
