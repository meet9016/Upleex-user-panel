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
    // Stock information for validation
    product_type_name?: string;
    available_quantity?: number;
    is_out_of_stock?: boolean;
}

export interface CartSummary {
    total_items: number;
    subtotal: string;
    gst_amount: string;
    gst_percentage: string;
    delivery_charges: string;
    installation_charges: string;
    grand_total: string;
    currency: string;
}

export interface CartListResponse {
    status: number;
    message: string;
    data: CartItem[];
    summary?: CartSummary;
}

export interface AddToCartResponse {
    status: number;
    message: string;
    data: any[];
}

export interface CartUpdateResponse {
    status: number;
    message: string;
    data: CartItem;
    summary: CartSummary;
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
            throw error;
        }
    }

    async getCartList(): Promise<CartListResponse> {
        try {
            const res = await api.post(endPointApi.webCartList, {});
            return res.data;
        } catch (error) {
            throw error;
        }
    }

    async removeFromCart(cartId: string): Promise<AddToCartResponse> {
        try {
            const formData = new FormData();
            formData.append('cart_id', cartId);

            const res = await api.post(endPointApi.webRemoveCart, formData);
            return res.data;
        } catch (error) {
            throw error;
        }
    }

    async updateCartItem(cartId: string, qty: number): Promise<CartUpdateResponse> {
        try {
            const formData = new FormData();
            formData.append('cart_id', cartId);
            formData.append('qty', qty.toString());

            const res = await api.post(endPointApi.webUpdateCart, formData);
            return res.data;
        } catch (error) {
            throw error;
        }
    }

    async clearCart(): Promise<AddToCartResponse> {
        try {
            const res = await api.post(endPointApi.webClearCart, {});
            return res.data;
        } catch (error) {
            throw error;
        }
    }
}

export const cartService = new CartService();
