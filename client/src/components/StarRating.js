
import React from 'react';
import { FaStar } from 'react-icons/fa';

export const StarDisplay = ({ rating, size = 14 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <FaStar key={n} size={size} className={n <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'} />
    ))}
  </div>
);

export const StarInput = ({ value, onChange, size = 22 }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button type="button" key={n} onClick={() => onChange(n)}>
        <FaStar size={size} className={n <= value ? 'text-yellow-400' : 'text-gray-200'} />
      </button>
    ))}
  </div>
);
