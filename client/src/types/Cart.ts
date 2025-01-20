interface Product {
  _id: string;
  title: string;
  image: string;
  category: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
}
export default CartItem;
