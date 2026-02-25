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
        const res = await api.post(`/api/v1/auth/${endPointApi.webLoginRegister}`, params);
        return res.data;
    }

    async verifyOtp(params: VerifyOtpParams): Promise<LoginRegisterResponse> {
        const res = await api.post(`/api/v1/auth/${endPointApi.webLoginRegister}`, params);
        return res.data;
    }
}

export const authService = new AuthService();

