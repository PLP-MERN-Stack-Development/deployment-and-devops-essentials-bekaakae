import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Shield, Truck } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: 'Get your food delivered in 30 minutes or less'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure payment processing'
    },
    {
      icon: Truck,
      title: 'Live Tracking',
      description: 'Track your order in real-time'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Delicious Food, 
              <span className="block">Delivered Fast</span>
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Order your favorite meals from our restaurant and get them delivered 
              hot and fresh to your doorstep.
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Order Now
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-primary-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-gray-600 mb-8">
            Browse our menu and place your order now. Satisfaction guaranteed!
          </p>
          <Link
            to="/menu"
            className="btn-primary text-lg px-8 py-3"
          >
            View Full Menu
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;