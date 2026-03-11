import { api } from '../utils/axiosInstance';
import endPointApi from '../utils/endPointApi';

export interface QuoteParams {
    product_id: string;
    delivery_date: string;
    number_of_days: number;
    months_id: string;
    qty: number;
    note?: string;
}

export interface VendorProductParams {
    vendor_id: string;
    filter_rent_sell?: string;
    filter_tenure?: string;
    page: number;
}

export interface CategoryProductParams {
    category_id: string;
    sub_category_id?: string;
    filter_rent_sell?: string;
    filter_tenure?: string;
    page: number;
}

class ProductService {
    async getSingleProduct(productId: string): Promise<any> {
        const res = await api.get(`${endPointApi.webSingleProductList}/${productId}`);
        return res.data;
    }

    async getQuote(params: QuoteParams): Promise<any> {
        const formData = new FormData();
        formData.append('product_id', params.product_id);
        formData.append('delivery_date', params.delivery_date);
        formData.append('number_of_days', String(params.number_of_days));
        if (params.months_id && params.months_id.trim()) {
            formData.append('months_id', params.months_id);
        }
        formData.append('qty', String(params.qty));
        if (params.note && params.note.trim()) {
            formData.append('note', params.note.trim());
        }
        const res = await api.post(endPointApi.webGetQuote, formData);
        return res.data;
    }

    async getSubCategories(categoryId: string): Promise<any> {
        const res = await api.get(endPointApi.webSubCategoryList, {
            params: {
                categoryId,
                page: 1,
                limit: 1000,
            },
        });
        return res.data;
    }

    async getCategoryProducts(params: CategoryProductParams): Promise<any> {
        const query: Record<string, string | number> = {};

        if (params.category_id && params.category_id !== 'all') {
            query.category_id = params.category_id;
        }

        if (params.sub_category_id && params.sub_category_id !== 'all') {
            query.sub_category_id = params.sub_category_id;
        }

        if (params.filter_rent_sell && params.filter_rent_sell !== '0') {
            query.filter_rent_sell = params.filter_rent_sell;
        }

        if (params.filter_tenure && params.filter_tenure !== '0') {
            query.filter_tenure = params.filter_tenure;
        }

        if (params.page && params.page > 0) {
            query.page = params.page;
            query.limit = 12;
        }

        const res = await api.get(endPointApi.webCategoryProductList, {
            params: query,
        });

        return res.data;
    }

    async getVendorProducts(params: VendorProductParams): Promise<any> {
        const formData = new FormData();
        formData.append('vendor_id', params.vendor_id);
        if (params.filter_rent_sell && params.filter_rent_sell !== '0') {
            formData.append('filter_rent_sell', params.filter_rent_sell);
        }
        if (params.filter_tenure && params.filter_tenure !== '0') {
            formData.append('filter_tenure', params.filter_tenure);
        }
        formData.append('page', String(params.page));
        const res = await api.post(endPointApi.webVendorProductList, formData);
        return res.data;
    }
}

export const productService = new ProductService();

