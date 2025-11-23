import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">FastFood</h3>
            <p className="text-gray-300 mb-4">
              Delicious food delivered fast to your doorstep. Quality and taste guaranteed.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <Phone size={16} />
              </div>
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <Mail size={16} />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-primary-500" />
                <span className="text-gray-300">+254716584236</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-primary-500" />
                <span className="text-gray-300">info@fastfood.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="text-primary-500 mt-1" />
                <span className="text-gray-300">Utawala, Nairobi along eastern bypass road.</span>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Opening Hours</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-primary-500" />
                <div>
                  <p className="text-gray-300">Mon - Fri: 9:00 AM - 10:00 PM</p>
                  <p className="text-gray-300">Sat - Sun: 10:00 AM - 11:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a href="/menu" className="block text-gray-300 hover:text-white transition-colors">
                Our Menu
              </a>
              <a href="/track-order" className="block text-gray-300 hover:text-white transition-colors">
                Track Order
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                About Us
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            &copy; 2025 FastFood App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;