
import React from 'react';
import { Link } from 'react-router-dom';
import { getRecentlyViewed } from '../utils/recentlyViewed';
import { UPLOADS_URL } from '../utils/constants';
import { FaHistory } from 'react-icons/fa';

const RecentlyViewed = () => {
  const items = getRecentlyViewed();
  if (items.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
        <FaHistory /> Recently Viewed
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.map((item) => (
          <Link
            to={'/listings/' + item.id}
            key={item.id}
            className="flex-shrink-0 w-32 card overflow-hidden"
          >
            <div className="h-20 bg-gray-100 flex items-center justify-center overflow-hidden">
              {item.image ? (
                <img src={UPLOADS_URL + item.image} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-xs">No Image</span>
              )}
            </div>
            <div className="p-2">
              <p className="text-xs font-medium text-gray-700 line-clamp-1">{item.title}</p>
              <p className="text-xs text-primary-600 font-bold">₹{item.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
