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
        const res = await api.post(endPointApi.businessRegister, {
            full_name: payload.full_name,
            business_name: payload.business_name,
            email: payload.email,
            number: payload.number,
            alternate_number: payload.alternate_number || '',
            country: payload.country,
            otp: payload.otp,
        });
        return res.data;
    }
}

export const partnerService = new PartnerService();
