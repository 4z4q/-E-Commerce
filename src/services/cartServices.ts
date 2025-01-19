import { ICartItem } from "../models/cartModel";
import { cartModel } from "../models/cartModel";
import productModel from "../models/productModel";
import { IOrderItem, orderModel } from "../models/orderModel";

interface CreateCartForUser {
  userId: string;
}

const createCartForUser = async ({ userId }: CreateCartForUser) => {
  const cart = await cartModel.create({ userId });
  await cart.save();
  return cart;
};

interface GetActiveCartForUser {
  userId: string;
  populateProduct?: boolean; //
}

export const getActiveCartForUser = async ({
  userId,
  populateProduct,
}: GetActiveCartForUser) => {
  let cart;

  if (populateProduct) {
    cart = await cartModel
      .findOne({ userId, status: "active" })
      .populate("items.product");
  } else {
    cart = await cartModel.findOne({ userId, status: "active" });
  }

  if (!cart) cart = await createCartForUser({ userId });

  return cart;
};

interface AddItemToCart {
  productId: any;
  quantity: number;
  userId: string;
}

interface CleatCart {
  userId: string;
}
export const clearCart = async ({ userId }: CleatCart) => {
  const cart = await getActiveCartForUser({ userId });
  cart.items = [];
  cart.totalAmount = 0;
  const update = await cart.save();

  return { data: update, statusCode: 200 };
};
export const addItemToCart = async ({
  productId,
  quantity,
  userId,
}: AddItemToCart) => {
  const cart = await getActiveCartForUser({ userId });

  // Does the item exist in the cart ?
  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId
  );

  if (existsInCart) {
    return { data: "Item already exists in cart!", statusCode: 400 };
  }

  // Fetch the product
  const product = await productModel.findById(productId);

  if (!product) {
    return { data: "Product not found!", statusCode: 400 };
  }

  if (product.stock < quantity) {
    return { data: "Low Stock for item!", statusCode: 400 };
  }

  cart.items.push({
    product: productId,
    unitPrice: product.price,
    quantity,
  });

  // update the total number for the cart
  cart.totalAmount += product.price * quantity;

  await cart.save();

  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 201,
  };
};

interface UpdateItemInCart {
  productId: any;
  quantity: number;
  userId: string;
}

export const updateItemInCart = async ({
  productId,
  userId,
  quantity,
}: UpdateItemInCart) => {
  const cart = await getActiveCartForUser({ userId });

  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId
  );

  if (!existsInCart) {
    return { data: "Item dose not exists in cart!", statusCode: 400 };
  }

  const product = await productModel.findById(productId);

  if (!product) {
    return { data: "Product not found!", statusCode: 400 };
  }

  if (product.stock < quantity) {
    return { data: "Low Stock for item!", statusCode: 400 };
  }

  existsInCart.quantity = quantity;

  const otherCartItem = cart.items.filter(
    (p) => p.product.toString() !== productId
  );

  let total = calculateCartTotalItems({ cartItems: otherCartItem });

  total += existsInCart.quantity * existsInCart.unitPrice;
  console.log(total);

  cart.totalAmount = total;
  await cart.save();

  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 201,
  };
};

interface DeleteItemInCart {
  productId: any;
  userId: string;
}

export const deleteItemIncart = async ({
  productId,
  userId,
}: DeleteItemInCart) => {
  const cart = await getActiveCartForUser({ userId });

  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId
  );

  if (!existsInCart) {
    return { data: "Item dose not exists in cart!", statusCode: 400 };
  }

  const otherCartItem = cart.items.filter(
    (p) => p.product.toString() !== productId
  );

  const total = calculateCartTotalItems({ cartItems: otherCartItem });

  cart.items = otherCartItem;
  cart.totalAmount = total;

  await cart.save();

  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 201,
  };
};

const calculateCartTotalItems = ({ cartItems }: { cartItems: ICartItem[] }) => {
  const total = cartItems.reduce((sum, product) => {
    sum += product.quantity * product.unitPrice;
    return sum;
  }, 0);

  return total;
};

// Start Order

interface CheckOut {
  userId: string;
  address: string;
}

export const checkout = async ({ userId, address }: CheckOut) => {
  if (!address) return { data: "Plase Insert Address ", statusCode: 400 };

  const cart = await getActiveCartForUser({ userId });

  const orderItems: IOrderItem[] = [];

  // Loop cartItem and create orderItems
  for (const item of cart.items) {
    const product = await productModel.findById(item.product);

    if (!product) return { data: "Product Not Found", statusCode: 400 };

    const orderItem: IOrderItem = {
      productTitle: product.title,
      productImage: product.image,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    };

    orderItems.push(orderItem);
  }

  const order = await orderModel.create({
    userId,
    orderItems,
    address,
    total: cart.totalAmount,
  });

  await order.save();

  cart.status = "completed";

  await cart.save();

  return { data: order, statusCode: 200 };
};
