import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, Truck, Package, Home } from 'lucide-react';
import { ordersAPI } from '../services/api'; // ✅ Use ordersAPI instead of axios
import toast from 'react-hot-toast';

const OrderTracking = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ FIX: Get order ID from multiple sources for persistence
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('orderId');
    const idFromState = location.state?.orderId;
    const idFromStorage = localStorage.getItem('lastOrderId');

    const finalOrderId = idFromUrl || idFromState || idFromStorage;
    
    if (finalOrderId) {
      setOrderId(finalOrderId);
      localStorage.setItem('lastOrderId', finalOrderId); // ✅ Persist for refresh
      fetchOrder(finalOrderId);
    } else {
      setLoading(false);
    }
  }, [location]);

  const fetchOrder = async (id) => {
    try {
      setLoading(true);
      console.log('🔄 Fetching order:', id);
      
      // ✅ FIX: Use ordersAPI instead of direct axios
      const response = await ordersAPI.getById(id);
      console.log('✅ Order data:', response.data);
      setOrder(response.data);
    } catch (error) {
      console.error('❌ Error fetching order:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Order not found');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: Auto-refresh order status every 10 seconds
  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing order status...');
      fetchOrder(orderId);
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [orderId]);

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (orderId.trim()) {
      localStorage.setItem('lastOrderId', orderId.trim()); // ✅ Persist
      fetchOrder(orderId.trim());
    }
  };

  const getStatusIndex = (status) => {
    const statusSteps = [
      'pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered'
    ];
    return statusSteps.findIndex(step => step === status);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <span className="ml-4 text-gray-600">Loading order status...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Track Your Order</h2>
          <form onSubmit={handleTrackOrder} className="max-w-md mx-auto mb-6">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your order ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
              required
            />
            <button type="submit" className="w-full btn-primary">
              Track Order
            </button>
          </form>
          <p className="text-gray-600">Please check your order ID and try again.</p>
        </div>
      </div>
    );
  }

  const currentStatusIndex = getStatusIndex(order.status);
  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'preparing', label: 'Preparing', icon: Package },
    { key: 'ready', label: 'Ready', icon: CheckCircle },
    { key: 'out-for-delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Home }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Order Tracking</h1>
      <p className="text-gray-600 mb-8">Order #: {order.orderNumber}</p>

      {/* Status Timeline */}
      <div className="card p-6 mb-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-semibold">Order Status</h3>
            <p className="text-primary-600 font-bold capitalize">{order.status.replace(/-/g, ' ')}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="font-semibold">
              {new Date(order.updatedAt || order.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="relative">
          {/* Progress Line */}
          <div 
            className="absolute top-5 left-0 h-1 bg-primary-500 transition-all duration-500"
            style={{ 
              width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` 
            }}
          ></div>
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-200"></div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;

              return (
                <div key={step.key} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      isCompleted
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-primary-200' : ''}`}
                  >
                    <Icon size={20} />
                  </div>
                  <span
                    className={`text-xs mt-2 text-center ${
                      isCompleted ? 'text-primary-600 font-semibold' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
          <div className="space-y-2">
            <p><strong>Name:</strong> {order.customer.name}</p>
            <p><strong>Email:</strong> {order.customer.email}</p>
            <p><strong>Phone:</strong> {order.customer.phone}</p>
            <p><strong>Address:</strong> {order.customer.address}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/menu')}
          className="btn-primary"
        >
          Order Again
        </button>
      </div>
    </div>
  );
};

export default OrderTracking;