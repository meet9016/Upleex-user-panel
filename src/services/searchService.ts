import { api } from '../utils/axiosInstance';
import endPointApi from '../utils/endPointApi';

export interface CityItem {
    id: string;
    city_name: string;
}

export interface ProductSuggestionItem {
    id: string;
    product_name: string;
}

export interface SearchProductParams {
    city?: string | null;
    search: string;
    page: number;
}

class SearchService {
    async getCities(page: number, search?: string): Promise<CityItem[]> {
        const formData = new FormData();
        formData.append('page', String(page));
        if (search && search.trim()) {
            formData.append('search', search.trim());
        }
        const res = await api.post(endPointApi.webAllCityList, formData);
        return res.data?.data || [];
    }

    async getProductSuggestions(search: string, city?: string | null): Promise<ProductSuggestionItem[]> {
        const formData = new FormData();
        formData.append('search', search);
        if (city) {
            formData.append('city', city);
        }
        const res = await api.post(endPointApi.webProductSuggestionList, formData);
        return res.data?.data || [];
    }

    async searchProducts(params: SearchProductParams): Promise<any[]> {
        const formData = new FormData();
        if (params.city) {
            formData.append('city', params.city);
        }
        formData.append('search', params.search);
        formData.append('page', String(params.page));
        const res = await api.post(endPointApi.webSearchProductList, formData);
        const payload = res.data?.data;
        if (Array.isArray(payload)) {
            return payload;
        }
        const data = payload || {};
        return Array.isArray(data.product_data) ? data.product_data : [];
    }
}

export const searchService = new SearchService();

