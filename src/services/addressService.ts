import { api } from '../utils/axiosInstance';
import endPointApi from '../utils/endPointApi';

export interface UserAddress {
    id: string;
    _id?: string;
    name: string;
    phone: string;
    alternate_phone?: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    is_default: boolean;
}

export interface AddressResponse {
    status: number;
    success: boolean;
    message: string;
    data: UserAddress;
}

export interface AddressListResponse {
    status: number;
    success: boolean;
    message: string;
    data: UserAddress[];
}

class AddressService {
    async addAddress(addressData: Omit<UserAddress, 'id' | 'is_default'> & { is_default?: boolean }): Promise<AddressResponse> {
        try {
            const res = await api.post(endPointApi.addAddress, addressData);
            return res.data;
        } catch (error) {
            throw error;
        }
    }

    async getAddresses(): Promise<AddressListResponse> {
        try {
            const res = await api.post(endPointApi.listAddresses, {});
            return res.data;
        } catch (error) {
            throw error;
        }
    }

    async updateAddress(addressId: string, addressData: Partial<UserAddress>): Promise<AddressResponse> {
        try {
            const res = await api.post(endPointApi.updateAddress, { id: addressId, ...addressData });
            return res.data;
        } catch (error) {
            throw error;
        }
    }

    async deleteAddress(addressId: string): Promise<{ status: number; success: boolean; message: string; data: { id: string } }> {
        try {
            const res = await api.post(endPointApi.deleteAddress, { address_id: addressId });
            return res.data;
        } catch (error) {
            throw error;
        }
    }

    async setDefaultAddress(addressId: string): Promise<AddressResponse> {
        try {
            const res = await api.post(endPointApi.setDefaultAddress, { address_id: addressId });
            return res.data;
        } catch (error) {
            throw error;
        }
    }
}

export const addressService = new AddressService();
