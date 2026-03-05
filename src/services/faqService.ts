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
    private faqList: FAQ[] | null = null;

    async getFAQList(): Promise<FAQ[]> {
        if (this.faqList) {
            return this.faqList;
        }
        try {
            const res = await api.get(endPointApi.faqList);
            const payload = res.data;
            const data = Array.isArray(payload?.data)
                ? payload.data
                : Array.isArray(payload)
                ? payload
                : [];
            this.faqList = data;
            return data;
        } catch (error) {
            console.error('Error fetching FAQ list:', error);
            return [];
        }
    }
}

export const faqService = new FAQService();
