import { api } from '../utils/axiosInstance';
import endPointApi from '../utils/endPointApi';

export interface CityItem {
    id: string;
    city_name: string;
}

export interface CityListResponse {
    items: CityItem[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
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
    async getCities(page: number, search?: string): Promise<CityListResponse> {
      const body: any = { page: Number(page), limit: 10 };
      if (search && search.trim() !== '') {
        body.search = search.trim();
      }
      const res = await api.post(endPointApi.webAllCityList, body);
      const payload = res.data?.data || {};
      const items = Array.isArray(payload.data) ? payload.data : [];
      return {
        items,
        total: Number(payload.total ?? items.length) || items.length,
        page: Number(payload.page ?? page) || page,
        totalPages: Number(payload.totalPages ?? 1) || 1,
        limit: Number(payload.limit ?? 10) || 10,
      };
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

