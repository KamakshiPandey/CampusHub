import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaTimes, FaUserCircle, FaCheckCircle } from 'react-icons/fa';
import api from '../utils/api';

const SelectBuyerModal = ({ open, onClose, listingId, listingType, onConfirmed }) => {
  const [buyers, setBuyers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    api.get('/listings/' + listingId + '/buyers')
      .then((res) => setBuyers(res.data))
      .catch(() => toast.error('Could not load interested buyers'))
      .finally(() => setLoading(false));
  }, [open, listingId]);

  if (!open) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await api.put('/listings/' + listingId + '/sold', { buyerId: selected });
      toast.success('Marked as ' + (listingType === 'rent' ? 'rented' : 'sold') + '!');
      onConfirmed();
      onClose();
    } catch (err) {
      toast.error('Could not update listing');
    }
    setSubmitting(false);
  };

  const handleSkip = async () => {
    setSubmitting(true);
    try {
      await api.put('/listings/' + listingId + '/sold', { buyerId: null });
      toast.success('Marked as ' + (listingType === 'rent' ? 'rented' : 'sold') + '!');
      onConfirmed();
      onClose();
    } catch (err) {
      toast.error('Could not update listing');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-display font-bold text-lg text-dark">Who did you sell this to?</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-500 mb-4">
            Selecting the buyer lets them leave a verified review that affects their trust with future sellers.
          </p>

          {loading ? (
            <p className="text-center text-gray-400 py-6">Loading interested buyers...</p>
          ) : buyers.length === 0 ? (
            <p className="text-center text-gray-400 py-6 text-sm">
              No one has messaged you about this listing yet. You can still mark it sold without selecting a buyer.
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {buyers.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelected(b.id)}
                  className={'w-full flex items-center gap-3 p-3 rounded-lg border transition text-left ' +
                    (selected === b.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300')}
                >
                  <FaUserCircle size={28} className="text-gray-400" />
                  <span className="font-medium text-gray-700">{b.name}</span>
                  {selected === b.id && <FaCheckCircle className="text-primary-500 ml-auto" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 p-4 border-t border-gray-100">
          <button
            onClick={handleSkip}
            disabled={submitting}
            className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm"
          >
            Skip / Sold Outside App
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting || !selected}
            className="flex-1 btn-primary disabled:opacity-50 text-sm"
          >
            {submitting ? 'Saving...' : 'Confirm Buyer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectBuyerModal;
