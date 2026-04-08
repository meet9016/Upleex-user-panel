import { api } from '../utils/axiosInstance';
import endPointApi from '../utils/endPointApi';

export interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    message: string;
}

export interface ContactResponse {
    success: boolean;
    message: string;
    data?: {
        id: string;
        name: string;
        email: string;
        message: string;
        createdAt: string;
    };
}

export interface ContactFormErrors {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    firstName?: string; 
    lastName?: string;
}

class ContactService {
    async submitContact(data: ContactFormData): Promise<ContactResponse> {
        const res = await api.post(`contacts/${endPointApi.createContact}`, data);
        return res.data;
    }
}

export const contactService = new ContactService();