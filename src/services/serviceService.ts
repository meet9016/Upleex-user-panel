import { api } from '../utils/axiosInstance';
import endPointApi from '../utils/endPointApi';

export interface ServiceCategory {
    categories_id: string;
    categories_name: string;
    image: string;
    service_count: string;
}

export interface Service {
    id: string;
    service_name: string;
    category_id: string;
    category_name: string;
    price: string;
    billing_type: 'day' | 'month' | 'hourly';
    location: string;
    description: string;
    image: string;
    sub_images: string[];
    vendor_id: string;
    vendor_name: string;
    vendor_address?: string;
    status: string;
    approval_status: string;
    createdAt: string;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

class ServiceService {
    private serviceCategoryPromises = new Map<string, Promise<ServiceCategory[]>>();

    async getServiceCategories(city?: string | null): Promise<ServiceCategory[]> {
        const cacheKey = city || 'all';
        if (this.serviceCategoryPromises.has(cacheKey)) {
            return this.serviceCategoryPromises.get(cacheKey)!;
        }

        const fetchPromise = (async () => {
            try {
                const params: any = {};
                if (city) {
                    params.city = city;
                }
                const res = await api.get(endPointApi.serviceCategoryList, { params });
                return res.data?.data || [];
            } catch (error) {
                this.serviceCategoryPromises.delete(cacheKey);
                return [];
            }
        })();

        this.serviceCategoryPromises.set(cacheKey, fetchPromise);
        return fetchPromise;
    }

    async getServices(params?: { 
        category_id?: string; 
        vendor_id?: string; 
        city?: string | null; 
        search?: string; 
        sortBy?: string; 
        order?: 'asc' | 'desc'; 
        limit?: number; 
        page?: number 
    }): Promise<{ data: Service[]; pagination: PaginationMeta }> {
        try {
            const res = await api.get(endPointApi.serviceList, { params });
            const data = res.data?.data || [];
            const total = res.data?.total || data.length;
            const page = params?.page || 1;
            const limit = params?.limit || 12;
            const totalPages = Math.ceil(total / limit);
            
            return {
                data,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages
                }
            };
        } catch (error) {
            return {
                data: [],
                pagination: {
                    total: 0,
                    page: 1,
                    limit: params?.limit || 12,
                    totalPages: 1
                }
            };
        }
    }

    async getServiceDetails(id: string): Promise<Service | null> {
        try {
            const res = await api.get(`${endPointApi.serviceDetails}/${id}`);
            return res.data?.data || null;
        } catch (error) {
            return null;
        }
    }
}

export const serviceService = new ServiceService();
