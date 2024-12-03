export const itemData = {
  seller: {
    name: "seller name",
    seller_id: "seller username",
    image: "https://tse3.mm.bing.net/th?id=OIP.Ijh2DJJVlAmhBAYABFwI-wAAAA&pid=Api&P=0&h=220",
    ratings: 5.0,
    address: "Crescent Way, Bab 2/4, New York City",
    phone: '+234 567 8910',
    email: 'selleremail@example.com',
    description: "Discover handcrafted jewelry and artisanal candles, available for purchase using Pi cryptocurrency. Elevate your space and style with our unique offerings today.",
    sale_items: "seller items placeholder",
    average_rating: 5.0,
    trust_meter_rating: 100,
    type: "pioneer",
    coordinates: [],
    order_online_enabled_pref: false,
  },
};

export const PiFestJson = {
  User: {
    user_id: 'pioneer123',
    user_name: 'pioneer name',
  },

  ReviewFeedback: {
    review_id: "rvid123",
    review_receiver_id: "rcvid456",
    review_giver_id: "gvid798",
    reply_to_review_id: "repid321",
    rating: 1, //this is enum object
    comment: "I am happy to let you all know that consumer to seller relationship is good.",
    image: "/images/shared/upload.png",
    review_date: "23 Oct. 2023 01:00pm",
  },

  Seller: {
    seller_id: 'user_id',
    name: 'User ID',
    description: 'I sell using pay with pi', //default value
    image: '/images/logo.svg',
    phone: '+234 567 8910',
    email: 'selleremail@example.com',
    address: 'Help your buyers find you by describing your address or whereabouts',
    sale_items: 'Describe your items for sale, pi prices etc',
    average_rating: {
      $numberDecimal: 5.0
    },
    trust_meter_rating: 100,
    coordinates: {
      type: "Point",
      coordinates: [
        [
            125.6,
            10.1
        ],
      ]
    },
    order_online_enabled_pref: true,
    _id: "666c84b9d77068c6efeeaa1a",
    __v: 0
  }
};

export const SellerItems = [
  {
    name: "Ham & cheese sandwich",
    item_id: "01",
    price: 4,
    quantity: 10,
    description: "A filling sandwich made with soft fresh-backed bread, tender, ham, cheese creamy slices, crisp lettuce, juicy tomato and mayo",
    photo: "/images/business/product.png",
    last_sold: "",
    status: 'Active',
  }, 
  {
    name: "Coffee",
    item_id: "02",
    price: 0.5,
    quantity: 10,
    description: "A nice refreshing coffee",
    photo: "/images/business/product.png",
    last_sold: "",
    status: 'expired',
  }, 
  {
    name: "Mobile phones",
    item_id: "03",
    price: 11,
    quantity: 20,
    description: "All kind of mobile phones",
    photo: "/images/business/product.png",
    last_sold: "",
    status: 'Active',
  }, 
];

