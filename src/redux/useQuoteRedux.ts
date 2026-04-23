import { useAppDispatch, useAppSelector } from './hooks';
import { fetchQuotes, createQuoteOrder, verifyQuotePayment, clearQuotes, setProcessingQuoteId } from './slices/quoteSlice';

export const useQuoteRedux = () => {
  const dispatch = useAppDispatch();
  const { quotes, loading, error, currentPage, totalPages, processingQuoteId } = useAppSelector((state) => state.quotes);

  const loadQuotes = (page = 1, limit = 10) => {
    dispatch(fetchQuotes({ page, limit }));
  };

  const createOrder = (quoteId: string, amount: number) => {
    return dispatch(createQuoteOrder({ quoteId, amount }));
  };

  const verifyPayment = (paymentData: any) => {
    return dispatch(verifyQuotePayment(paymentData));
  };

  const clearQuotesData = () => {
    dispatch(clearQuotes());
  };

  const setProcessing = (quoteId: string | null) => {
    dispatch(setProcessingQuoteId(quoteId));
  };

  return {
    quotes,
    loading,
    error,
    currentPage,
    totalPages,
    processingQuoteId,
    loadQuotes,
    createOrder,
    verifyPayment,
    clearQuotesData,
    setProcessing,
  };
};
