import { api } from '../utils/axiosInstance';
import endPointApi from '../utils/endPointApi';

export interface CartItem {
    id: string;
    name: string;
    price: string;
    qty: string;
    sub_total: string;
    gst_per: string;
    gst_amount: string;
    final_amount: string;
    image: string;
    cart_id: string;
}

export interface CartListResponse {
    status: number;
    message: string;
    data: CartItem[];
}

export interface AddToCartResponse {
    status: number;
    message: string;
    data: any[];
}

class CartService {
    async addToCart(productId: string, qty: number): Promise<AddToCartResponse> {
        try {
            const formData = new FormData();
            formData.append('product_id', productId);
            formData.append('qty', qty.toString());

            const res = await api.post(endPointApi.webAddToCart, formData);
            return res.data;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    }

    async getCartList(): Promise<CartListResponse> {
        try {
            const res = await api.post(endPointApi.webCartList, {});
            return res.data;
        } catch (error) {
            console.error('Error fetching cart list:', error);
            throw error;
        }
    }
}

export const cartService = new CartService();
