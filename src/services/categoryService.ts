import { api } from '../utils/axiosInstance';
import endPointApi from '../utils/endPointApi';

export interface SubCategory {
    subcategory_id: string;
    subcategory_name: string;
    image: string;
}

export interface Category {
    categories_id: string;
    categories_name: string;
    image: string;
    product_count: string;
    subcategories: SubCategory[];
}

export interface HomeResponse {
    status: number;
    message: string;
    data: {
        slider: any[];
        banner: any[];
        all_categories: Category[];
    };
}

class CategoryService {
    async getHomeData(): Promise<HomeResponse> {
        try {
            const res = await api.post(endPointApi.home, {});
            return res.data;
        } catch (error) {
            console.error('Error fetching home data:', error);
            throw error;
        }
    }

    async getCategories(): Promise<Category[]> {
        try {
            const data = await this.getHomeData();
            return data.data.all_categories || [];
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }
}

export const categoryService = new CategoryService();
