import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api'; // ✅ Use ordersAPI instead of axios
import toast from 'react-hot-toast';

const Cart = () => {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckout = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      toast.error('Please fill in all customer information');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('🔄 Creating order...');
      
      // Create order data
      const orderData = {
        items: items.map(item => ({
          menuItem: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        customer: customerInfo,
        totalAmount: total
      };

      console.log('📦 Order data:', orderData);

      // ✅ FIX: Use ordersAPI instead of direct axios
      const orderResponse = await ordersAPI.create(orderData);
      console.log('✅ Order created:', orderResponse.data);

      // ✅ FIX: Skip payment for now and go directly to tracking
      toast.success('Order placed successfully!');
      clearCart();
      
      // ✅ FIX: Save order ID to localStorage for persistence
      localStorage.setItem('lastOrderId', orderResponse.data._id);
      
      navigate('/order-tracking', { 
        state: { orderId: orderResponse.data._id } 
      });

    } catch (error) {
      console.error('❌ Checkout error:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious items from our menu!</p>
          <Link to="/menu" className="btn-primary">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/menu" className="flex items-center text-primary-600 mb-6">
        <ArrowLeft size={16} className="mr-2" />
        Continue Shopping
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cart Items */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Order</h2>
          <div className="space-y-4">
            {items.map(item => (
              <div key={item._id} className="card p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-primary-600 font-bold">${item.price}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    
                    <span className="font-semibold w-8 text-center">{item.quantity}</span>
                    
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                    
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-right mt-2">
                  <span className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-4 mt-6">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Delivery Information</h2>
          <div className="card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address *
              </label>
              <textarea
                name="address"
                value={customerInfo.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;