import { api } from '../utils/axiosInstance';
import endPointApi from '../utils/endPointApi';

export interface FAQ {
    id: string;
    question: string;
    answer: string;
}

export interface FAQListResponse {
    status: number;
    message: string;
    data: FAQ[];
}

class FAQService {
    async getFAQList(): Promise<FAQ[]> {
        try {
            const res = await api.post(endPointApi.faqList, {});
            return res.data.data || [];
        } catch (error) {
            console.error('Error fetching FAQ list:', error);
            return [];
        }
    }
}

export const faqService = new FAQService();
