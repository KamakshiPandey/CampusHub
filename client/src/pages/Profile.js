
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaUserCircle, FaUniversity, FaEnvelope, FaBoxOpen, FaTrash, FaCheckCircle, FaEye } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { UPLOADS_URL } from '../utils/constants';
import { GridSkeleton } from '../components/Skeleton';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMine = () => {
    setLoading(true);
    api.get('/listings/mine').then((res) => setMyListings(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) fetchMine();
    // eslint-disable-next-line
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing permanently?')) return;
    try {
      await api.delete('/listings/' + id);
      toast.success('Listing deleted');
      fetchMine();
    } catch (err) {
      toast.error('Could not delete listing');
    }
  };

  const handleMarkSold = async (id, type) => {
    try {
      await api.put('/listings/' + id, { status: type === 'rent' ? 'rented' : 'sold' });
      toast.success('Marked as ' + (type === 'rent' ? 'rented' : 'sold'));
      fetchMine();
    } catch (err) {
      toast.error('Could not update status');
    }
  };

  const totalViews = myListings.reduce((sum, item) => sum + (item.viewCount || 0), 0);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <p className="text-gray-500 mb-4">You need to be logged in to view your profile.</p>
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card p-8 flex items-center gap-6 mb-6"
      >
        <FaUserCircle size={72} className="text-primary-400" />
        <div>
          <h1 className="font-display text-2xl font-bold text-dark">{user.name}</h1>
          <p className="text-gray-500 flex items-center gap-2 mt-1"><FaEnvelope size={13} /> {user.email}</p>
          {user.college && (
            <p className="text-gray-500 flex items-center gap-2 mt-1"><FaUniversity size={13} /> {user.college}</p>
          )}
        </div>
      </motion.div>

      {myListings.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-primary-600">{myListings.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total Listings</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-primary-600">{totalViews}</p>
            <p className="text-xs text-gray-500 mt-1">Total Views</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-primary-600">
              {myListings.filter((l) => l.status !== 'available').length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Sold / Rented</p>
          </div>
        </div>
      )}

      <h2 className="font-display text-xl font-bold text-dark mb-4 flex items-center gap-2">
        <FaBoxOpen className="text-primary-500" /> My Listings
      </h2>

      {loading ? (
        <GridSkeleton count={3} />
      ) : myListings.length === 0 ? (
        <div className="text-center py-16">
          <FaBoxOpen size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">You haven't posted anything yet.</p>
          <Link to="/create-listing" className="btn-primary">Post Your First Item</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {myListings.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              className="card overflow-hidden"
            >
              <Link to={'/listings/' + item.id} className="relative block">
                <div className="h-36 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img src={UPLOADS_URL + item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                  )}
                </div>
                <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <FaEye size={10} /> {item.viewCount || 0}
                </span>
              </Link>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 line-clamp-1">{item.title}</h3>
                <p className="text-primary-600 font-bold mt-1">₹{item.price}</p>
                <span className={'text-xs capitalize font-medium ' + (item.status === 'available' ? 'text-green-600' : 'text-gray-400')}>
                  {item.status}
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  {item.viewCount || 0} view{item.viewCount !== 1 ? 's' : ''} this listing has received
                </p>
                <div className="flex gap-2 mt-3">
                  {item.status === 'available' && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMarkSold(item.id, item.type)}
                      className="flex-1 text-xs bg-green-50 text-green-600 py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-green-100"
                    >
                      <FaCheckCircle /> Mark {item.type === 'rent' ? 'Rented' : 'Sold'}
                    </motion.button>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 text-xs bg-red-50 text-red-600 py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-red-100"
                  >
                    <FaTrash /> Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
