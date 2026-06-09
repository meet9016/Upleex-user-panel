import { api } from '../utils/axiosInstance';
import endPointApi from '../utils/endPointApi';

export interface SubCategory {
    subcategory_id: string;
    subcategory_name: string;
    slug?: string;
    image: string;
}

export interface CategorySeoBullet {
    label: string;
    text: string;
    plain?: boolean;
}

export interface CategorySeoSection {
    heading: string;
    heading_level: 'h2' | 'h3';
    bullets: CategorySeoBullet[];
}

export interface CategorySeoFaq {
    question: string;
    answer: string;
}

export interface CategorySeoContent {
    meta_title?: string;
    meta_description?: string;
    core_keyword?: string;
    secondary_keywords?: string;
    image_alt?: string;
    image_title?: string;
    anchor_tags?: string[];
    faqs?: CategorySeoFaq[];
    hero_title: string;
    hero_text: string;
    intro_heading: string;
    intro_paragraphs: string[];
    sections: CategorySeoSection[];
    main_text: string;
    sub_text: string;
}

export interface Category {
    categories_id: string;
    categories_name: string;
    slug?: string;
    image: string;
    product_count: string;
    subcategories: SubCategory[];
    seo_content?: CategorySeoContent;
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
    private homeDataPromises = new Map<string, Promise<HomeResponse>>();

    async getHomeData(city?: string | null): Promise<HomeResponse> {
        const cacheKey = city || 'all';
        if (this.homeDataPromises.has(cacheKey)) {
            return this.homeDataPromises.get(cacheKey)!;
        }

        const fetchPromise = (async () => {
        try {
            const params: any = {
                page: 1,
                limit: 100,
            };
            if (city) {
                params.city = city;
            }
            const categoryRes = await api.get(endPointApi.home, {
                params,
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
                    slug: cat.slug || '',
                    image: buildImageUrl(cat.image),
                    product_count: cat.product_count ? String(cat.product_count) : '0',
                    subcategories: Array.isArray(cat.subcategories) 
                        ? cat.subcategories.map((sub: any) => ({
                            subcategory_id: sub.subcategory_id || sub.id || sub._id || '',
                            subcategory_name: sub.subcategory_name || sub.name || '',
                            slug: sub.slug || '',
                            image: buildImageUrl(sub.image),
                        }))
                        : [],
                    seo_content: cat.seo_content || undefined,
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

                return transformed;
            } catch (error) {
                // Clear the promise from cache if it fails so it can be retried
                this.homeDataPromises.delete(cacheKey);
                throw error;
            }
        })();

        this.homeDataPromises.set(cacheKey, fetchPromise);
        return fetchPromise;
    }

    async getCategories(city?: string | null): Promise<Category[]> {
        try {
            const data = await this.getHomeData(city);
            return data.data.all_categories || [];
        } catch (error) {
            return [];
        }
    }
}

export const categoryService = new CategoryService();
