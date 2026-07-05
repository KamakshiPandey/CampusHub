
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaRupeeSign, FaHome, FaClipboardCheck } from 'react-icons/fa';
import api from '../utils/api';
import { UPLOADS_URL } from '../utils/constants';
import { GridSkeleton } from '../components/Skeleton';
import MatchBadge from '../components/MatchBadge';
import { AuthContext } from '../context/AuthContext';

const Roommates = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [quizStatus, setQuizStatus] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (location) params.location = location;
      const res = await api.get('/roommates', { params });
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    if (user) {
      api.get('/quiz').then((res) => setQuizStatus(res.data.quizCompleted)).catch(() => {});
    }
    // eslint-disable-next-line
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <h1 className="font-display text-3xl font-bold text-dark">Find Roommates</h1>
        {user && quizStatus === false && (
          <Link to="/roommate-quiz" className="btn-primary text-sm flex items-center gap-2">
            <FaClipboardCheck /> Take Compatibility Quiz
          </Link>
        )}
        {user && quizStatus === true && (
          <Link to="/roommate-quiz" className="btn-outline text-sm flex items-center gap-2">
            <FaClipboardCheck /> Update Preferences
          </Link>
        )}
      </div>
      <p className="text-gray-500 mb-8">Connect with students looking to share a place near campus.</p>

      {user && quizStatus === false && (
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 mb-8 flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-primary-700">
            Take our 30 second compatibility quiz to see match percentages with each roommate post.
          </p>
          <Link to="/roommate-quiz" className="btn-primary text-sm whitespace-nowrap">Start Quiz</Link>
        </div>
      )}

      <div className="card p-5 mb-8 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2 relative">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roommate posts..."
            className="input-field pl-9"
          />
        </div>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location / Area"
          className="input-field"
        />
        <motion.button whileTap={{ scale: 0.95 }} onClick={fetchPosts} className="btn-primary">
          Search
        </motion.button>
      </div>

      {loading ? (
        <GridSkeleton count={6} />
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <FaHome size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No roommate posts found.</p>
          <Link to="/create-listing" className="btn-primary">Post a Roommate Ad</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              whileHover={{ y: -4 }}
            >
              <Link to={'/roommates/' + post.id} className="card overflow-hidden block relative">
                <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {post.image ? (
                    <img src={UPLOADS_URL + post.image} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                  )}
                </div>
                {post.matchPercentage !== null && post.matchPercentage !== undefined && (
                  <div className="absolute top-2 right-2">
                    <MatchBadge percentage={post.matchPercentage} />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{post.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{post.description}</p>
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <span className="flex items-center gap-1 text-primary-600 font-bold">
                      <FaRupeeSign size={12} /> {post.budget}/mo
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <FaMapMarkerAlt size={12} /> {post.location}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Posted by {post.poster?.name}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Roommates;
