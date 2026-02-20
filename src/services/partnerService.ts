import { api } from '../utils/axiosInstance';
import endPointApi from '../utils/endPointApi';

export interface BusinessRegisterPayload {
    full_name: string;
    business_name: string;
    email: string;
    number: string;
    alternate_number?: string;
    country: string;
    otp?: string;
}

export interface ApiResponse<T = any> {
    status: number;
    message: string;
    data: T;
}

class PartnerService {
    async businessRegister(payload: BusinessRegisterPayload): Promise<ApiResponse> {
        const formData = new FormData();
        formData.append('full_name', payload.full_name);
        formData.append('business_name', payload.business_name);
        formData.append('email', payload.email);
        formData.append('number', payload.number);
        formData.append('alternate_number', payload.alternate_number || '');
        formData.append('country', payload.country);
        if (payload.otp) {
            formData.append('otp', payload.otp);
        }
        const res = await api.post(endPointApi.businessRegister, formData);
        return res.data;
    }
}

export const partnerService = new PartnerService();
