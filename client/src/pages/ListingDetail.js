
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaTag, FaUserCircle, FaComments, FaCheckCircle } from 'react-icons/fa';
import api from '../utils/api';
import { UPLOADS_URL } from '../utils/constants';
import { addRecentlyViewed } from '../utils/recentlyViewed';
import { AuthContext } from '../context/AuthContext';
import ListingMap from '../components/ListingMap';
import CampusScoreBadge from '../components/CampusScoreBadge';
import FeedbackModal from '../components/FeedbackModal';

const ListingDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sellerScore, setSellerScore] = useState(0);
  const [eligible, setEligible] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    api.get('/listings/' + id).then((res) => {
      setListing(res.data);
      addRecentlyViewed(res.data);
      if (res.data.seller?.id) {
        api.get('/reviews/user/' + res.data.seller.id).then((r) => setSellerScore(r.data.campusScore));
      }
      if (user && res.data.seller?.id !== user.id && res.data.status !== 'available') {
        api.get('/reviews/eligibility', { params: { listingId: res.data.id, revieweeId: res.data.seller.id } })
          .then((r) => setEligible(r.data.eligible));
      }
    }).finally(() => setLoading(false));
  }, [id, user]);

  const handleContact = async () => {
    if (!user) {
      toast.error('Please login to message the seller');
      return navigate('/login');
    }
    if (!listing?.seller?.id) {
      toast.error('Seller info not loaded yet, try again');
      return;
    }
    setSending(true);
    try {
      const res = await api.post('/chats', { otherUserId: listing.seller.id, listingId: listing.id });
      toast.success('Chat started!');
      navigate('/chats?chatId=' + res.data.id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not start chat');
    }
    setSending(false);
  };

  if (loading) return <p className="text-center py-20 text-gray-500 animate-pulse">Loading...</p>;
  if (!listing) return <p className="text-center py-20 text-gray-500">Listing not found.</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="h-96 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center"
          >
            {listing.image ? (
              <img src={UPLOADS_URL + listing.image} alt={listing.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400">No Image Available</span>
            )}
          </motion.div>

          {listing.latitude && listing.longitude && (
            <ListingMap latitude={listing.latitude} longitude={listing.longitude} title={listing.title} />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-primary-50 text-primary-600 text-xs font-semibold px-3 py-1 rounded-full">
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            {listing.status !== 'available' && (
              <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                {listing.status}
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl font-bold text-dark mt-3">{listing.title}</h1>
          <p className="text-3xl font-bold text-primary-600 mt-2">₹{listing.price}</p>

          <div className="flex items-center gap-4 text-gray-500 text-sm mt-4">
            <span className="flex items-center gap-1"><FaTag /> {listing.category}</span>
            <span className="flex items-center gap-1"><FaMapMarkerAlt /> {listing.location || 'Campus area'}</span>
          </div>

          <p className="text-gray-700 mt-6 leading-relaxed">{listing.description}</p>

          {eligible && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 mt-6 flex items-center justify-between gap-3">
              <p className="text-sm text-green-700">Did you receive this item? Let others know how it went.</p>
              <button
                onClick={() => setFeedbackOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1 whitespace-nowrap"
              >
                <FaCheckCircle size={12} /> Leave a Review
              </button>
            </div>
          )}

          <div className="card p-4 mt-6 flex items-center justify-between flex-wrap gap-3">
            <Link to={'/users/' + listing.seller?.id} className="flex items-center gap-3">
              <FaUserCircle size={36} className="text-gray-400" />
              <div>
                <p className="font-semibold text-gray-800 hover:text-primary-600">{listing.seller?.name || 'Unknown seller'}</p>
                <CampusScoreBadge score={sellerScore} size="small" />
              </div>
            </Link>
            {user?.id !== listing.seller?.id && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleContact}
                disabled={sending}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <FaComments /> {sending ? 'Starting...' : 'Message'}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {listing.seller && (
        <FeedbackModal
          open={feedbackOpen}
          onClose={() => { setFeedbackOpen(false); setEligible(false); }}
          revieweeId={listing.seller.id}
          revieweeName={listing.seller.name}
          listingId={listing.id}
          label="Rate Your Purchase"
        />
      )}
    </motion.div>
  );
};

export default ListingDetail;
