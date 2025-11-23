import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { menuAPI } from '../services/api'; // ✅ Use the API service
import toast from 'react-hot-toast';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart } = useCart();

  const categories = ['all', 'burgers', 'pizza', 'sides', 'drinks', 'desserts'];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      console.log('🔄 Fetching menu items...');
      const response = await menuAPI.getAll(); // ✅ Use menuAPI instead of axios
      console.log('✅ Menu items loaded:', response.data);
      setMenuItems(response.data);
    } catch (error) {
      console.error('❌ Error fetching menu:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full capitalize ${
              selectedCategory === category
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item._id} className="card p-6">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-primary-600">
                ${item.price}
              </span>
              <button
                onClick={() => {
                  addToCart(item);
                  toast.success(`${item.name} added to cart!`);
                }}
                className="btn-primary flex items-center space-x-1"
              >
                <Plus size={16} />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No items found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default Menu;