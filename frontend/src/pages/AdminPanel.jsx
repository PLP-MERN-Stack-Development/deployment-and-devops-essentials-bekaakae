import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, CheckCircle, Clock, Package, Truck, Home, XCircle, ArrowLeft, Bell } from 'lucide-react';
import { ordersAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [error, setError] = useState('');
  const [newOrders, setNewOrders] = useState([]); // ✅ Track new orders
  const [showNotifications, setShowNotifications] = useState(false); // ✅ Notification panel
  const [lastOrderCount, setLastOrderCount] = useState(0); // ✅ Track previous order count
  const navigate = useNavigate();
  const audioRef = useRef(null); // ✅ For notification sound

  const statusIcons = {
    pending: Clock,
    confirmed: CheckCircle,
    preparing: Package,
    ready: CheckCircle,
    'out-for-delivery': Truck,
    delivered: Home,
    cancelled: XCircle
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    preparing: 'bg-orange-100 text-orange-800 border-orange-200',
    ready: 'bg-green-100 text-green-800 border-green-200',
    'out-for-delivery': 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };

  // Show message function
  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  // ✅ Play notification sound
  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  // ✅ Check for new orders
  const checkForNewOrders = (currentOrders) => {
    if (lastOrderCount === 0) return []; // First load, no new orders
    
    const newOrderCount = currentOrders.length - lastOrderCount;
    if (newOrderCount > 0) {
      const newOrders = currentOrders.slice(0, newOrderCount);
      
      // Show notification
      playNotificationSound();
      showMessage(`🎉 ${newOrderCount} new order${newOrderCount > 1 ? 's' : ''} received!`, 'success');
      
      // Highlight new orders temporarily
      setNewOrders(newOrders.map(order => order._id));
      setTimeout(() => {
        setNewOrders([]); // Remove highlight after 10 seconds
      }, 10000);
      
      return newOrders;
    }
    return [];
  };

  // fetchOrders function
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Fetching orders from API...');
      const response = await ordersAPI.getAll();
      console.log('✅ Orders loaded:', response.data);
      
      const currentOrders = response.data;
      
      // ✅ Check for new orders before updating state
      checkForNewOrders(currentOrders);
      
      setOrders(currentOrders);
      setLastOrderCount(currentOrders.length); // Update order count
      
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
      console.error('Error details:', err.response?.data);
      setError(err.message || 'Failed to load orders');
      showMessage('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // ✅ Auto-refresh every 30 seconds to check for new orders
    const interval = setInterval(fetchOrders, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const response = await ordersAPI.updateStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order._id === orderId ? response.data : order
      ));
      showMessage(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating order:', err);
      showMessage('Failed to update order status', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusOptions = (currentStatus) => {
    const statusFlow = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['out-for-delivery', 'cancelled'],
      'out-for-delivery': ['delivered'],
      delivered: [],
      cancelled: []
    };
    return statusFlow[currentStatus] || [];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ✅ Format time ago for notifications
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Simple LoadingSpinner component
  const LoadingSpinner = ({ size = 'medium' }) => {
    const sizeClasses = {
      small: 'h-4 w-4',
      medium: 'h-8 w-8', 
      large: 'h-12 w-12'
    };

    return (
      <div className={`animate-spin rounded-full border-b-2 border-primary-500 ${sizeClasses[size]}`}></div>
    );
  };

  // ✅ Added error display
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
        <div className="bg-red-100 p-4 rounded">
          <p className="text-red-700">Error: {error}</p>
          <p className="text-red-600 mt-2">Check browser console for details</p>
          <button
            onClick={fetchOrders}
            className="mt-4 btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
          <span className="ml-4 text-gray-600">Loading orders...</span>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const newOrdersCount = pendingOrders.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ✅ Hidden audio element for notifications */}
      <audio ref={audioRef} preload="auto">
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3" type="audio/mpeg" />
      </audio>

      {/* Message Alert */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium min-w-64 max-w-md ${
          messageType === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-primary-600 hover:text-primary-700 mr-4"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600">Manage and update order statuses</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* ✅ Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Bell size={24} />
              {newOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {newOrdersCount}
                </span>
              )}
            </button>

            {/* ✅ Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Recent Orders</h3>
                  <p className="text-sm text-gray-600">{newOrdersCount} pending orders</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {pendingOrders.slice(0, 5).map(order => (
                    <div 
                      key={order._id} 
                      className={`p-4 border-b hover:bg-gray-50 transition-colors ${
                        newOrders.includes(order._id) ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Order #{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">{order.customer?.name}</p>
                          <p className="text-xs text-gray-500">{getTimeAgo(order.createdAt)}</p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          ${order.totalAmount}
                        </span>
                      </div>
                    </div>
                  ))}
                  {pendingOrders.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      No pending orders
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={fetchOrders}
            className="btn-secondary flex items-center"
            disabled={loading}
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* ✅ New Orders Alert Banner */}
      {newOrders.length > 0 && (
        <div className="mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-4 rounded-lg shadow-lg animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell size={20} className="mr-2" />
              <span className="font-semibold">
                🎉 {newOrders.length} new order{newOrders.length > 1 ? 's' : ''} just came in!
              </span>
            </div>
            <button
              onClick={() => setNewOrders([])}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="card p-4 text-center relative">
          {pendingOrders.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
              {pendingOrders.length}
            </span>
          )}
          <div className="text-2xl font-bold text-yellow-600">
            {pendingOrders.length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {orders.filter(o => ['preparing', 'ready', 'out-for-delivery'].includes(o.status)).length}
          </div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === 'delivered').length}
          </div>
          <div className="text-sm text-gray-600">Delivered</div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items & Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => {
                const StatusIcon = statusIcons[order.status] || Clock;
                const statusOptions = getStatusOptions(order.status);
                const isNewOrder = newOrders.includes(order._id);
                
                return (
                  <tr 
                    key={order._id} 
                    className={`hover:bg-gray-50 transition-all duration-300 ${
                      isNewOrder ? 'bg-yellow-50 border-l-4 border-l-yellow-400 animate-pulse' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </div>
                        {isNewOrder && (
                          <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(order.createdAt)}
                      </div>
                      {order.estimatedDelivery && (
                        <div className="text-xs text-gray-400">
                          Est: {formatDate(order.estimatedDelivery)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customer?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customer?.phone || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.customer?.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items?.length || 0} items
                      </div>
                      <div className="text-xs text-gray-500 max-w-xs truncate">
                        {order.items?.map(item => item.name || 'Unnamed Item').join(', ')}
                      </div>
                      <div className="text-sm font-semibold text-primary-600">
                        ${order.totalAmount?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                        <StatusIcon size={12} className="mr-1" />
                        {order.status.replace(/-/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {statusOptions.length > 0 ? (
                          <select
                            value=""
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            disabled={updating === order._id}
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                          >
                            <option value="">Update Status</option>
                            {statusOptions.map(status => (
                              <option key={status} value={status}>
                                Mark as {status.replace(/-/g, ' ')}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-gray-400 text-sm">Completed</span>
                        )}
                        {updating === order._id && (
                          <LoadingSpinner size="small" />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No orders found</p>
            <p className="text-gray-400 text-sm mt-2">Orders will appear here once customers place them</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => navigate('/menu')}
          className="btn-primary text-sm"
        >
          View Menu
        </button>
        <button
          onClick={() => navigate('/order-tracking')}
          className="btn-secondary text-sm"
        >
          Track Orders
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;