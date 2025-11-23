import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Clock, Home, Utensils } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { getCartItemCount } = useCart();
  const location = useLocation();
  const cartItemCount = getCartItemCount();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/menu', label: 'Menu', icon: Utensils },
    { path: '/track-order', label: 'Track Order', icon: Clock },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-full"></div>
            <span className="text-xl font-bold text-gray-900">FastFood</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Cart */}
          <Link
            to="/cart"
            className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors relative"
          >
            <ShoppingCart size={20} />
            <span>Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;