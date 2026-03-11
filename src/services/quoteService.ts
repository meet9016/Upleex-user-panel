import { api } from '../utils/axiosInstance';

export interface CreateQuoteRequest {
  product_id: string;
  delivery_date?: string;
  number_of_days?: number;
  months_id?: string;
  qty?: number;
  note?: string;
}

export const quoteService = {
  createQuote: async (data: CreateQuoteRequest) => {
    const response = await api.post('/quote/create-quote', data);
    return response.data;
  },

  getUserQuotes: async (page = 1, limit = 10) => {
    const response = await api.get('/quote/quotes', { params: { page, limit } });
    return response.data;
  },

  getQuoteById: async (id: string) => {
    const response = await api.get(`/quote/quotes/${id}`);
    return response.data;
  }
};