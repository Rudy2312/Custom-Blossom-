// In-memory shared state for database fallback mode
const mockUsers = [
  {
    _id: '65eb26d2e67ef1b2c456abcd',
    name: 'Admin Blossom',
    email: 'admin@blossom.com',
    password: '$2a$10$pLwF8.48rO6t1YQ7pLwF8.48rO6t1YQ7pLwF8.48rO6t1YQ7pLwF8.', // mock hash for testing
    role: 'admin',
    isPremium: true,
    wishlist: [],
    createdAt: new Date()
  }
];

const mockDesigns = [];
const mockOrders = [
  {
    _id: '65eb27aae67ef1b2c4561234',
    userId: '65eb26d2e67ef1b2c456abcd',
    items: [
      {
        productName: 'Phone Cover',
        themeName: 'Sakura Blossom',
        detail: '(iPhone 15 Pro)',
        price: 249,
        productIcon: 'images/logo.jpg',
        bg: '#F8C8DC',
        product: 'phone',
        mode: 'easy'
      }
    ],
    shippingAddress: {
      firstName: 'Admin',
      lastName: 'Blossom',
      address: '123 Blossom Boulevard, Suite 5',
      city: 'Delhi',
      zip: '110001'
    },
    paymentMethod: 'card',
    paymentStatus: 'Paid',
    orderStatus: 'Placed',
    totalAmount: 289,
    createdAt: new Date()
  }
];

const mockReviews = [
  {
    _id: '65eb28cce67ef1b2c4565678',
    userId: '65eb26d2e67ef1b2c456abcd',
    name: 'Admin Blossom',
    rating: 5,
    comment: 'Custom Blossom wraps are absolutely stunning! The satin finish is pure luxury and the fit is incredibly precise. Highly recommended!',
    productType: 'phone',
    createdAt: new Date()
  },
  {
    _id: '65eb28dde67ef1b2c4565679',
    name: 'Aisha Sharma',
    rating: 5,
    comment: 'The holographic material looks magical under direct light. The interactive rotation let me preview every single highlight correctly. Will buy again!',
    productType: 'laptop',
    createdAt: new Date()
  },
  {
    _id: '65eb28eee67ef1b2c4565680',
    name: 'Rohit K.',
    rating: 4,
    comment: 'Great customizer wizard. The steps are very easy to follow. Applying the bubble-free cast vinyl was a breeze on my earbuds case.',
    productType: 'earbuds',
    createdAt: new Date()
  }
];

module.exports = { mockUsers, mockDesigns, mockOrders, mockReviews };
