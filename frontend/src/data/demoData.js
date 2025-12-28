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
      },
      {
        id: 8,
        name: 'Headphones',
        products: [
          { 
            id: 11, 
            name: 'AirPods Pro', 
            price: 24900, 
            originalPrice: 27900,
            discount: 11,
            vendor: 'Apple Store', 
            description: 'Wireless earbuds with ANC',
            image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop'
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
      },
      {
        id: 9,
        name: 'Footwear',
        products: [
          { 
            id: 12, 
            name: 'Running Shoes', 
            price: 4999, 
            originalPrice: 6999,
            discount: 29,
            vendor: 'Sport Zone', 
            description: 'Lightweight running shoes',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop'
          }
        ]
      },
      {
        id: 10,
        name: 'Accessories',
        products: [
          { 
            id: 13, 
            name: 'Leather Watch', 
            price: 8999, 
            originalPrice: 12999,
            discount: 31,
            vendor: 'Time Master', 
            description: 'Premium leather strap watch',
            image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&h=300&fit=crop'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Home & Kitchen',
    subcategories: [
      {
        id: 4,
        name: 'Appliances',
        products: [
          { 
            id: 6, 
            name: 'Air Fryer', 
            price: 8999, 
            originalPrice: 12999,
            discount: 31,
            vendor: 'Kitchen Pro', 
            description: 'Digital air fryer 4L capacity',
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop'
          },
          { 
            id: 7, 
            name: 'Coffee Maker', 
            price: 15999, 
            originalPrice: 18999,
            discount: 16,
            vendor: 'Brew Master', 
            description: 'Automatic drip coffee maker',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop'
          }
        ]
      },
      {
        id: 11,
        name: 'Furniture',
        products: [
          { 
            id: 14, 
            name: 'Office Chair', 
            price: 12999, 
            originalPrice: 16999,
            discount: 24,
            vendor: 'Comfort Zone', 
            description: 'Ergonomic office chair',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop'
          }
        ]
      },
      {
        id: 12,
        name: 'Decor',
        products: [
          { 
            id: 15, 
            name: 'Table Lamp', 
            price: 2999, 
            originalPrice: 3999,
            discount: 25,
            vendor: 'Light House', 
            description: 'Modern LED table lamp',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop'
          }
        ]
      }
    ]
  },
  {
    id: 4,
    name: 'Sports & Fitness',
    subcategories: [
      {
        id: 5,
        name: 'Gym Equipment',
        products: [
          { 
            id: 8, 
            name: 'Dumbbells Set', 
            price: 4999, 
            originalPrice: 6999,
            discount: 29,
            vendor: 'Fit Zone', 
            description: 'Adjustable dumbbells 20kg',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop'
          }
        ]
      },
      {
        id: 13,
        name: 'Outdoor Sports',
        products: [
          { 
            id: 16, 
            name: 'Football', 
            price: 1299, 
            originalPrice: 1799,
            discount: 28,
            vendor: 'Sports Pro', 
            description: 'Professional football size 5',
            image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=300&h=300&fit=crop'
          }
        ]
      },
      {
        id: 14,
        name: 'Yoga & Fitness',
        products: [
          { 
            id: 17, 
            name: 'Yoga Mat', 
            price: 899, 
            originalPrice: 1299,
            discount: 31,
            vendor: 'Zen Fitness', 
            description: 'Non-slip yoga mat 6mm',
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop'
          }
        ]
      }
    ]
  },
  {
    id: 5,
    name: 'Books & Stationery',
    subcategories: [
      {
        id: 6,
        name: 'Office Supplies',
        products: [
          { 
            id: 9, 
            name: 'Notebook Set', 
            price: 599, 
            originalPrice: 799,
            discount: 25,
            vendor: 'Paper Plus', 
            description: 'Premium ruled notebooks pack of 5',
            image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop'
          }
        ]
      },
      {
        id: 15,
        name: 'Books',
        products: [
          { 
            id: 18, 
            name: 'Business Guide', 
            price: 999, 
            originalPrice: 1299,
            discount: 23,
            vendor: 'Knowledge Hub', 
            description: 'Complete business management guide',
            image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop'
          }
        ]
      },
      {
        id: 16,
        name: 'Art Supplies',
        products: [
          { 
            id: 19, 
            name: 'Sketch Pad', 
            price: 399, 
            originalPrice: 599,
            discount: 33,
            vendor: 'Art World', 
            description: 'A4 sketch pad 100 sheets',
            image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop'
          }
        ]
      }
    ]
  },
  {
    id: 6,
    name: 'Automotive',
    subcategories: [
      {
        id: 7,
        name: 'Car Accessories',
        products: [
          { 
            id: 10, 
            name: 'Car Phone Mount', 
            price: 1299, 
            originalPrice: 1999,
            discount: 35,
            vendor: 'Auto Tech', 
            description: 'Magnetic car phone holder',
            image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=300&h=300&fit=crop'
          }
        ]
      },
      {
        id: 17,
        name: 'Car Care',
        products: [
          { 
            id: 20, 
            name: 'Car Shampoo', 
            price: 499, 
            originalPrice: 699,
            discount: 29,
            vendor: 'Clean Car', 
            description: 'Premium car wash shampoo 500ml',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop'
          }
        ]
      },
      {
        id: 18,
        name: 'Tools',
        products: [
          { 
            id: 21, 
            name: 'Tool Kit', 
            price: 2999, 
            originalPrice: 3999,
            discount: 25,
            vendor: 'Tool Master', 
            description: '50-piece automotive tool kit',
            image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=300&h=300&fit=crop'
          }
        ]
      }
    ]
  }
];

export const users = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john@shop.com', 
    role: 'shopkeeper',
    phone: '+1-555-0101',
    company: 'Doe Electronics Store'
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane@vendor.com', 
    role: 'vendor',
    phone: '+1-555-0102',
    company: 'Smith Tech Supplies'
  },
  { 
    id: 3, 
    name: 'Admin User', 
    email: 'admin@system.com', 
    role: 'admin',
    phone: '+1-555-0100',
    company: 'B2B Commerce Platform'
  }
];

export const contactQueries = [
  { id: 1, name: 'John Smith', email: 'john@example.com', message: 'Need help with order tracking' },
  { id: 2, name: 'Sarah Wilson', email: 'sarah@example.com', message: 'Product inquiry about bulk orders' }
];