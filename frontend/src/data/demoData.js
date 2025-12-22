export const categories = [
  {
    id: 1,
    name: 'Electronics',
    subcategories: [
      {
        id: 1,
        name: 'Mobile',
        products: [
          { id: 1, name: 'iPhone 15', price: 79999, vendor: 'Apple Store', description: 'Latest iPhone with A17 chip' },
          { id: 2, name: 'Samsung Galaxy S24', price: 74999, vendor: 'Samsung Store', description: 'Flagship Android phone' }
        ]
      },
      {
        id: 2,
        name: 'Laptop',
        products: [
          { id: 3, name: 'MacBook Air M3', price: 114900, vendor: 'Apple Store', description: '13-inch laptop with M3 chip' },
          { id: 4, name: 'Dell XPS 13', price: 89999, vendor: 'Dell Store', description: 'Premium ultrabook' }
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
          { id: 5, name: 'Formal Shirt', price: 1999, vendor: 'Fashion Hub', description: 'Cotton formal shirt' }
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