
import React from 'react';
import { FaHeart } from 'react-icons/fa';

const MatchBadge = ({ percentage }) => {
  if (percentage === null || percentage === undefined) return null;

  let color = 'bg-gray-100 text-gray-500';
  if (percentage >= 80) color = 'bg-green-100 text-green-700';
  else if (percentage >= 60) color = 'bg-yellow-100 text-yellow-700';
  else if (percentage >= 40) color = 'bg-orange-100 text-orange-700';
  else color = 'bg-red-100 text-red-600';

  return (
    <span className={'text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ' + color}>
      <FaHeart size={10} /> {percentage}% Match
    </span>
  );
};

export default MatchBadge;
