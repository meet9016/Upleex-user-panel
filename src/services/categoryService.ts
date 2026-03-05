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
    private homeData: HomeResponse | null = null;

    async getHomeData(): Promise<HomeResponse> {
        if (this.homeData) {
            return this.homeData;
        }
        try {
            const categoryRes = await api.get(endPointApi.home, {
                params: {
                    page: 1,
                    limit: 100,
                },
            });

            const categoryPayload = categoryRes.data || {};
            const rawCategories = Array.isArray(categoryPayload.data) ? categoryPayload.data : [];

            const buildImageUrl = (path: string | undefined | null): string => {
                if (!path) return '';
                const trimmed = path.trim();
                if (!trimmed) return '';
                if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
                    return trimmed;
                }
                const base = process.env.NEXT_PUBLIC_APP_URL || '';
                if (!base) return trimmed;
                if (trimmed.startsWith('/')) {
                    return `${base.replace(/\/+$/, '')}${trimmed}`;
                }
                return `${base.replace(/\/+$/, '')}/${trimmed.replace(/^\/+/, '')}`;
            };

            const mappedCategories: Category[] = rawCategories.map((cat: any) => {
                return {
                    categories_id: cat.categories_id || cat.id || cat._id || '',
                    categories_name: cat.categories_name || cat.name || '',
                    image: buildImageUrl(cat.image),
                    product_count: cat.product_count ? String(cat.product_count) : '0',
                    subcategories: Array.isArray(cat.subcategories) 
                        ? cat.subcategories.map((sub: any) => ({
                            subcategory_id: sub.subcategory_id || sub.id || sub._id || '',
                            subcategory_name: sub.subcategory_name || sub.name || '',
                            image: buildImageUrl(sub.image),
                        }))
                        : [],
                };
            });

            const transformed: HomeResponse = {
                status: categoryPayload.success === false ? 500 : 200,
                message: categoryPayload.message || '',
                data: {
                    slider: [],
                    banner: [],
                    all_categories: mappedCategories,
                },
            };

            this.homeData = transformed;
            return transformed;
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
