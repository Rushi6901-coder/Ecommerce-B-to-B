export const categories = [
  {
    id: 1,
    name: 'Electronics',
    subcategories: [
      {
        id: 1,
        name: 'Mobile',
        products: [
          { 
            id: 1, 
            name: 'iPhone 15', 
            price: 79999, 
            originalPrice: 89999,
            discount: 11,
            vendor: 'Apple Store', 
            description: 'Latest iPhone with A17 chip',
            image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop'
          },
          { 
            id: 2, 
            name: 'Samsung Galaxy S24', 
            price: 74999, 
            originalPrice: 79999,
            discount: 6,
            vendor: 'Samsung Store', 
            description: 'Flagship Android phone',
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop'
          }
        ]
      },
      {
        id: 2,
        name: 'Laptop',
        products: [
          { 
            id: 3, 
            name: 'MacBook Air M3', 
            price: 114900, 
            originalPrice: 124900,
            discount: 8,
            vendor: 'Apple Store', 
            description: '13-inch laptop with M3 chip',
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop'
          },
          { 
            id: 4, 
            name: 'Dell XPS 13', 
            price: 89999, 
            originalPrice: 94999,
            discount: 5,
            vendor: 'Dell Store', 
            description: 'Premium ultrabook',
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Fashion',
    subcategories: [
      {
        id: 3,
        name: 'Clothing',
        products: [
          { 
            id: 5, 
            name: 'Formal Shirt', 
            price: 1999, 
            originalPrice: 2499,
            discount: 20,
            vendor: 'Fashion Hub', 
            description: 'Cotton formal shirt',
            image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=300&fit=crop'
          }
        ]
      }
    ]
  }
];

export const users = [
  { id: 1, name: 'John Doe', email: 'john@shop.com', role: 'shopkeeper' },
  { id: 2, name: 'Jane Smith', email: 'jane@vendor.com', role: 'vendor' },
  { id: 3, name: 'Admin User', email: 'admin@system.com', role: 'admin' }
];

export const contactQueries = [
  { id: 1, name: 'Customer 1', email: 'customer1@email.com', message: 'Need help with order' },
  { id: 2, name: 'Customer 2', email: 'customer2@email.com', message: 'Product inquiry' }
];