
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaUserCircle, FaUniversity, FaCalendarAlt } from 'react-icons/fa';
import api from '../utils/api';
import { StarDisplay } from '../components/StarRating';
import CampusScoreBadge from '../components/CampusScoreBadge';

const UserProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [count, setCount] = useState(0);
  const [campusScore, setCampusScore] = useState(0);
  const [loading, setLoading] = useState(true);

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
      setCampusScore(reviewsRes.data.campusScore);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [userId]);

  if (loading) return <p className="text-center py-20 text-gray-500">Loading...</p>;
  if (!profile) return <p className="text-center py-20 text-gray-500">User not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="card p-8 mb-8">
        <div className="flex items-center gap-6 flex-wrap">
          <FaUserCircle size={72} className="text-primary-400" />
          <div className="flex-grow">
            <h1 className="font-display text-2xl font-bold text-dark">{profile.name}</h1>
            {profile.college && (
              <p className="text-gray-500 flex items-center gap-2 mt-1"><FaUniversity size={13} /> {profile.college}</p>
            )}
            <p className="text-gray-400 text-xs flex items-center gap-2 mt-1">
              <FaCalendarAlt size={11} /> Joined {new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6 flex-wrap">
          <CampusScoreBadge score={campusScore} />
          <div className="flex items-center gap-2">
            <StarDisplay rating={avgRating} />
            <span className="text-sm text-gray-500">{avgRating} ({count} review{count !== 1 ? 's' : ''})</span>
          </div>
        </div>

        {campusScore === 0 && (
          <p className="text-xs text-gray-400 mt-3">
            This user has not completed any reviewed transactions yet.
          </p>
        )}
      </div>

      <h2 className="font-display text-lg font-bold text-dark mb-4">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No reviews yet. Reviews appear once a transaction is marked complete.</p>
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
