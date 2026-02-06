import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { MessageSquare } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
  loading: boolean;
  productName?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  productName,
}) => {
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    onSubmit(note);
  };

  // Reset note when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setNote('');
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Quote"
      className="max-w-lg"
    >
      <div className="space-y-5">
        {productName && (
          <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100 flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-600">
               <MessageSquare size={20} />
            </div>
            <div>
               <span className="text-xs text-orange-600 uppercase font-bold tracking-wider">Requesting For</span>
               <p className="text-gray-900 font-bold text-base leading-tight mt-0.5">{productName}</p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">
            Add a Note <span className="text-gray-400 font-normal ml-1">(Optional)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any specific requirements? (e.g., Preferred delivery time, installation needed, etc.)"
            className="w-full min-h-[140px] p-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none text-sm placeholder:text-gray-400"
          />
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Button 
            fullWidth 
            onClick={handleSubmit} 
            disabled={loading}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 shadow-lg shadow-orange-500/20 rounded-xl"
          >
            {loading ? 'Sending Request...' : 'Submit Quote Request'}
          </Button>
          
          <button 
            onClick={onClose}
            className="w-full text-center text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors py-2"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
