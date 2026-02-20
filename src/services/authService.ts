import { api } from '../utils/axiosInstance';
import endPointApi from '../utils/endPointApi';

export interface LoginRegisterResponse<T = any> {
    status: number;
    message: string;
    success?: boolean;
    data?: T;
}

export interface SendOtpParams {
    number: string;
    country_id: string;
}

export interface VerifyOtpParams {
    number: string;
    otp: string;
    country_id: string;
    name?: string;
    email?: string;
}

class AuthService {
    async sendOtp(params: SendOtpParams): Promise<LoginRegisterResponse> {
        const formData = new FormData();
        formData.append('number', params.number);
        formData.append('country_id', params.country_id);
        const res = await api.post(endPointApi.webLoginRegister, formData);
        return res.data;
    }

    async verifyOtp(params: VerifyOtpParams): Promise<LoginRegisterResponse> {
        const formData = new FormData();
        formData.append('number', params.number);
        formData.append('otp', params.otp);
        formData.append('country_id', params.country_id);
        if (params.name) {
            formData.append('name', params.name);
        }
        if (params.email) {
            formData.append('email', params.email);
        }
        const res = await api.post(endPointApi.webLoginRegister, formData);
        return res.data;
    }
}

export const authService = new AuthService();

