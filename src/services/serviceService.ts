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

class ServiceService {
    async getServiceCategories(city?: string | null): Promise<ServiceCategory[]> {
        try {
            const params: any = {};
            if (city) {
                params.city = city;
            }
            const res = await api.get(endPointApi.serviceCategoryList, { params });
            return res.data?.data || [];
        } catch (error) {
            console.error('Error fetching service categories:', error);
            return [];
        }
    }

    async getServices(params?: { category_id?: string; vendor_id?: string; city?: string | null; search?: string; sortBy?: string; order?: 'asc' | 'desc' }): Promise<Service[]> {
        try {
            const res = await api.get(endPointApi.serviceList, { params });
            return res.data?.data || [];
        } catch (error) {
            console.error('Error fetching services:', error);
            return [];
        }
    }

    async getServiceDetails(id: string): Promise<Service | null> {
        try {
            const res = await api.get(`${endPointApi.serviceDetails}/${id}`);
            return res.data?.data || null;
        } catch (error) {
            console.error('Error fetching service details:', error);
            return null;
        }
    }
}

export const serviceService = new ServiceService();
