import productModel from "../models/productModel";

export const getAllProducts = async () => {
  return await productModel.find();
};

export const seedInitialProducts = async () => {
  try {
    const products = [
      // Smartphones
      {
        title: "iPhone 14 Pro Max",
        image:
          "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-max-1.jpg",
        price: 1099,
        stock: 20,
        category: "smartphones",
      },
      {
        title: "Samsung Galaxy S23 Ultra",
        image:
          "https://images.samsung.com/ca/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-common-introduction-banner.jpg",
        price: 1199,
        stock: 30,
        category: "smartphones",
      },
      {
        title: "Google Pixel 7 Pro",
        image:
          "https://m.media-amazon.com/images/I/615rI0PoyOL._AC_UF894,1000_QL80_.jpg",
        price: 899,
        stock: 40,
        category: "smartphones",
      },

      // Laptops
      {
        title: "Dell XPS 13",
        image:
          "https://microless.com/cdn/products/fb66a4b2b937becc69c7898fb6f5770d-hi.jpg",
        price: 1299,
        stock: 15,
        category: "laptops",
      },
      {
        title: "Apple MacBook Air M2",
        image:
          "https://m.media-amazon.com/images/I/71f5Eu5lJSL._AC_SL1500_.jpg",
        price: 1199,
        stock: 25,
        category: "laptops",
      },
      {
        title: "HP Spectre x360",
        image: "https://m.media-amazon.com/images/I/71AgpORJXXL.jpg",
        price: 1399,
        stock: 10,
        category: "laptops",
      },

      // Tablets
      {
        title: 'Apple iPad Pro 12.9"',
        image:
          "https://m.media-amazon.com/images/I/81c+9BOQNWL._AC_SL1500_.jpg",
        price: 1099,
        stock: 20,
        category: "tablets",
      },
      {
        title: "Samsung Galaxy Tab S8",
        image:
          "https://m.media-amazon.com/images/I/61f41zCQfKL._AC_UF894,1000_QL80_.jpg",
        price: 899,
        stock: 25,
        category: "tablets",
      },
      {
        title: "Microsoft Surface Pro 9",
        image:
          "https://m.media-amazon.com/images/I/61U6oC65TTL._AC_SL1500_.jpg",
        price: 1199,
        stock: 30,
        category: "tablets",
      },

      // Accessories
      {
        title: "Logitech MX Master 3S Mouse",
        image:
          "https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_UF1000,1000_QL80_.jpg",
        price: 99,
        stock: 50,
        category: "accessories",
      },
      {
        title: "Apple AirPods Pro (2nd Gen)",
        image:
          "https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg",
        price: 249,
        stock: 40,
        category: "accessories",
      },
      {
        title: "Samsung Galaxy Buds 2 Pro",
        image:
          "https://m.media-amazon.com/images/I/61lKQWyMdDL._AC_SL1500_.jpg",
        price: 199,
        stock: 30,
        category: "accessories",
      },
    ];

    const existingProduct = await productModel.find();
    if (existingProduct.length === 0) {
      await productModel.insertMany(products);
    }
  } catch (error) {
    console.log(error);
  }
};
