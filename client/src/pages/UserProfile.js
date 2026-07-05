
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUserCircle, FaUniversity, FaCalendarAlt } from 'react-icons/fa';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { StarDisplay, StarInput } from '../components/StarRating';

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileRes, reviewsRes] = await Promise.all([
        api.get('/reviews/profile/' + userId),
        api.get('/reviews/user/' + userId),
      ]);
      setProfile(profileRes.data);
      setReviews(reviewsRes.data.reviews);
      setAvgRating(reviewsRes.data.avgRating);
      setCount(reviewsRes.data.count);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [userId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please login to leave a review');
      return navigate('/login');
    }
    setSubmitting(true);
    try {
      await api.post('/reviews', { revieweeId: userId, rating, comment });
      toast.success('Review submitted!');
      setShowForm(false);
      setComment('');
      setRating(5);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    }
    setSubmitting(false);
  };

  if (loading) return <p className="text-center py-20 text-gray-500">Loading...</p>;
  if (!profile) return <p className="text-center py-20 text-gray-500">User not found.</p>;

  const isOwnProfile = currentUser?.id === parseInt(userId);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="card p-8 flex items-center gap-6 mb-8">
        <FaUserCircle size={72} className="text-primary-400" />
        <div className="flex-grow">
          <h1 className="font-display text-2xl font-bold text-dark">{profile.name}</h1>
          {profile.college && (
            <p className="text-gray-500 flex items-center gap-2 mt-1"><FaUniversity size={13} /> {profile.college}</p>
          )}
          <p className="text-gray-400 text-xs flex items-center gap-2 mt-1">
            <FaCalendarAlt size={11} /> Joined {new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <StarDisplay rating={avgRating} />
            <span className="text-sm text-gray-500">{avgRating} ({count} review{count !== 1 ? 's' : ''})</span>
          </div>
        </div>
        {!isOwnProfile && (
          <button onClick={() => setShowForm(!showForm)} className="btn-outline text-sm">
            {showForm ? 'Cancel' : 'Leave a Review'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmitReview} className="card p-6 mb-8 space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Your Rating</p>
            <StarInput value={rating} onChange={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this person..."
            rows="3"
            className="input-field"
          />
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      <h2 className="font-display text-lg font-bold text-dark mb-4">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FaUserCircle className="text-gray-400" size={24} />
                  <span className="font-medium text-gray-800 text-sm">{r.reviewer?.name}</span>
                </div>
                <StarDisplay rating={r.rating} />
              </div>
              {r.comment && <p className="text-gray-600 text-sm">{r.comment}</p>}
              <p className="text-xs text-gray-400 mt-2">{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
