const mongoose = require('mongoose');
require('dotenv').config();

const menuItems = [
  // BURGERS (8 items)
  {
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with melted cheese, fresh lettuce, tomato, and special sauce",
    price: 8.99,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    preparationTime: 10
  },
  {
    name: "Bacon Deluxe Burger",
    description: "Double beef patty with crispy bacon, cheddar cheese, and smoky BBQ sauce",
    price: 11.99,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop",
    preparationTime: 12
  },
  {
    name: "Mushroom Swiss Burger",
    description: "Beef patty topped with sautéed mushrooms and melted Swiss cheese",
    price: 10.99,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop",
    preparationTime: 11
  },
  {
    name: "Spicy Chicken Burger",
    description: "Crispy chicken breast with spicy mayo, lettuce, and pickles",
    price: 9.99,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1606755962773-d324e38327dc?w=400&h=300&fit=crop",
    preparationTime: 9
  },
  {
    name: "Veggie Supreme Burger",
    description: "Plant-based patty with avocado, sprouts, and garlic aioli",
    price: 8.49,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1525059696034-4967a7290044?w=400&h=300&fit=crop",
    preparationTime: 8
  },
  {
    name: "BBQ Ranch Burger",
    description: "Beef patty with onion rings, BBQ sauce, and ranch dressing",
    price: 10.49,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop",
    preparationTime: 13
  },
  {
    name: "Double Stack Burger",
    description: "Two beef patties with double cheese, bacon, and special sauce",
    price: 12.99,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop",
    preparationTime: 14
  },
  {
    name: "Hawaiian Burger",
    description: "Beef patty with grilled pineapple, teriyaki glaze, and Swiss cheese",
    price: 11.49,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    preparationTime: 11
  },

  // PIZZA (6 items)
  {
    name: "Pepperoni Supreme",
    description: "Classic pizza with extra pepperoni and mozzarella cheese",
    price: 14.99,
    category: "pizza",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
    preparationTime: 15
  },
  {
    name: "Margherita Classic",
    description: "Fresh tomato sauce, mozzarella, and basil leaves",
    price: 12.99,
    category: "pizza",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop",
    preparationTime: 12
  },
  {
    name: "BBQ Chicken Pizza",
    description: "Grilled chicken, red onions, and BBQ sauce on crispy crust",
    price: 15.99,
    category: "pizza",
    image: "https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=400&h=300&fit=crop",
    preparationTime: 16
  },
  {
    name: "Vegetarian Delight",
    description: "Mushrooms, bell peppers, onions, olives, and fresh tomatoes",
    price: 13.99,
    category: "pizza",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop",
    preparationTime: 14
  },
  {
    name: "Meat Lovers Feast",
    description: "Pepperoni, sausage, ham, bacon, and ground beef",
    price: 16.99,
    category: "pizza",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
    preparationTime: 18
  },
  {
    name: "Hawaiian Pizza",
    description: "Ham, pineapple, and mozzarella cheese on tomato sauce",
    price: 13.49,
    category: "pizza",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop",
    preparationTime: 13
  },

  // SIDES (6 items)
  {
    name: "Crispy French Fries",
    description: "Golden fries with a pinch of sea salt",
    price: 3.99,
    category: "sides",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
    preparationTime: 8
  },
  {
    name: "Onion Rings",
    description: "Beer-battered onion rings with ranch dipping sauce",
    price: 4.99,
    category: "sides",
    image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop",
    preparationTime: 7
  },
  {
    name: "Mozzarella Sticks",
    description: "Breaded mozzarella sticks with marinara sauce",
    price: 5.49,
    category: "sides",
    image: "https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400&h=300&fit=crop",
    preparationTime: 6
  },
  {
    name: "Sweet Potato Fries",
    description: "Crispy sweet potato fries with cinnamon sugar",
    price: 4.49,
    category: "sides",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
    preparationTime: 9
  },
  {
    name: "Garlic Breadsticks",
    description: "Freshly baked breadsticks with garlic butter and parmesan",
    price: 4.99,
    category: "sides",
    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=300&fit=crop",
    preparationTime: 5
  },
  {
    name: "Loaded Nachos",
    description: "Tortilla chips with cheese, jalapeños, salsa, and sour cream",
    price: 7.99,
    category: "sides",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop",
    preparationTime: 10
  },

  // DRINKS (5 items)
  {
    name: "Chocolate Milkshake",
    description: "Creamy chocolate milkshake with whipped cream and cherry",
    price: 4.99,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop",
    preparationTime: 5
  },
  {
    name: "Strawberry Smoothie",
    description: "Fresh strawberry smoothie with yogurt and honey",
    price: 5.49,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1633508577444-80e31b79dc6c?w=400&h=300&fit=crop",
    preparationTime: 4
  },
  {
    name: "Iced Caramel Macchiato",
    description: "Espresso with vanilla syrup, milk, and caramel drizzle",
    price: 4.79,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1568649929103-28ffbefaca1e?w=400&h=300&fit=crop",
    preparationTime: 3
  },
  {
    name: "Fresh Lemonade",
    description: "Homemade lemonade with mint and lemon slices",
    price: 3.49,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop",
    preparationTime: 2
  },
  {
    name: "Craft Root Beer",
    description: "Premium root beer with vanilla notes, served ice cold",
    price: 3.99,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop",
    preparationTime: 1
  },

  // DESSERTS (5 items)
  {
    name: "Chocolate Brownie Sundae",
    description: "Warm chocolate brownie with ice cream and hot fudge",
    price: 6.99,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
    preparationTime: 3
  },
  {
    name: "New York Cheesecake",
    description: "Classic cheesecake with strawberry topping",
    price: 5.99,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=400&h=300&fit=crop",
    preparationTime: 2
  },
  {
    name: "Apple Pie",
    description: "Warm apple pie with cinnamon and vanilla ice cream",
    price: 4.99,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1535920527002-b35e96722206?w=400&h=300&fit=crop",
    preparationTime: 4
  },
  {
    name: "Chocolate Chip Cookies",
    description: "Freshly baked cookies with melty chocolate chips",
    price: 3.49,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop",
    preparationTime: 6
  },
  {
    name: "Tiramisu",
    description: "Italian dessert with coffee-soaked ladyfingers and mascarpone",
    price: 6.49,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
    preparationTime: 2
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fastfood', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Get the MenuItem model
    const MenuItem = require('./models/MenuItem');
    
    // Clear existing data
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');
    
    // Insert new data
    await MenuItem.insertMany(menuItems);
    
    console.log('Database seeded successfully!');
    console.log(`✅ Added ${menuItems.length} menu items`);
    console.log('📊 Category Breakdown:');
    console.log(`   🍔 Burgers: ${menuItems.filter(item => item.category === 'burgers').length}`);
    console.log(`   🍕 Pizza: ${menuItems.filter(item => item.category === 'pizza').length}`);
    console.log(`   🍟 Sides: ${menuItems.filter(item => item.category === 'sides').length}`);
    console.log(`   🥤 Drinks: ${menuItems.filter(item => item.category === 'drinks').length}`);
    console.log(`   🍰 Desserts: ${menuItems.filter(item => item.category === 'desserts').length}`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();