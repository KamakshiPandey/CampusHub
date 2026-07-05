
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaRupeeSign, FaUserCircle, FaComments, FaCalendarAlt, FaVenusMars } from 'react-icons/fa';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import MatchBadge from '../components/MatchBadge';

const RoommateDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get('/roommates/' + id).then((res) => setPost(res.data)).finally(() => setLoading(false));
  }, [id]);

  const handleContact = async () => {
    if (!user) {
      toast.error('Please login to message this person');
      return navigate('/login');
    }
    if (!post?.poster?.id) return toast.error('Poster info not loaded');
    setSending(true);
    try {
      const res = await api.post('/chats', { otherUserId: post.poster.id, roommateId: post.id });
      toast.success('Chat started!');
      navigate('/chats?chatId=' + res.data.id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not start chat');
    }
    setSending(false);
  };

  if (loading) return <p className="text-center py-20 text-gray-500">Loading...</p>;
  if (!post) return <p className="text-center py-20 text-gray-500">Post not found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="h-96 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
          {post.image ? (
            <img src={'http://localhost:5000' + post.image} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400">No Image Available</span>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={'text-xs font-semibold px-3 py-1 rounded-full ' + (post.status === 'open' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500')}>
              {post.status === 'open' ? 'Looking for Roommate' : 'Closed'}
            </span>
            {post.matchPercentage !== null && post.matchPercentage !== undefined && (
              <MatchBadge percentage={post.matchPercentage} />
            )}
          </div>
          <h1 className="font-display text-3xl font-bold text-dark mt-3">{post.title}</h1>
          <p className="text-2xl font-bold text-primary-600 mt-2 flex items-center gap-1">
            <FaRupeeSign size={18} /> {post.budget}/month
          </p>

          <div className="flex items-center gap-4 text-gray-500 text-sm mt-4 flex-wrap">
            <span className="flex items-center gap-1"><FaMapMarkerAlt /> {post.location}</span>
            {post.moveInDate && (
              <span className="flex items-center gap-1"><FaCalendarAlt /> Move-in: {post.moveInDate}</span>
            )}
            <span className="flex items-center gap-1 capitalize"><FaVenusMars /> {post.genderPreference} preferred</span>
          </div>

          <p className="text-gray-700 mt-6 leading-relaxed">{post.description}</p>

          {post.matchPercentage === null && user && (
            <div className="bg-primary-50 border border-primary-100 rounded-lg p-3 mt-4 text-sm text-primary-700">
              Take the compatibility quiz to see your match percentage with this person.
            </div>
          )}

          <div className="card p-4 mt-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaUserCircle size={36} className="text-gray-400" />
              <div>
                <p className="font-semibold text-gray-800">{post.poster?.name || 'Unknown'}</p>
                <p className="text-xs text-gray-400">Posted by</p>
              </div>
            </div>
            {user?.id !== post.poster?.id && (
              <button onClick={handleContact} disabled={sending} className="btn-primary flex items-center gap-2 text-sm">
                <FaComments /> {sending ? 'Starting...' : 'Message'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoommateDetail;
