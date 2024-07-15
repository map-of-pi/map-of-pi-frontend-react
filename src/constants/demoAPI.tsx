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
        trust_meter_rating: 5.0,
        type: "pioneer",
        coordinates: [],
        order_online_enabled_pref: false,
    },
    
    // items: [
    //     {
    //         id: 10,
    //         name: "Bicycle",
    //         price: 10,
    //     },
    //     {
    //         id: 9,
    //         name: 'Books',
    //         price: 4,
    //     },
    //     {
    //         id: 8,
    //         name: 'House',
    //         price: 5,
    //     },
    //     {
    //         id: 7,
    //         name: 'Two Shirt',
    //         price: 7,
    //     },
    // ]
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

// get emojis index
// count length of emojis for a user
