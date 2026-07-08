
import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';

const CampusScoreBadge = ({ score, size = 'normal' }) => {
  let color = 'bg-gray-100 text-gray-500';
  let label = 'New Member';

  if (score >= 90) {
    color = 'bg-green-100 text-green-700';
    label = 'Highly Trusted';
  } else if (score >= 70) {
    color = 'bg-blue-100 text-blue-700';
    label = 'Trusted';
  } else if (score >= 40) {
    color = 'bg-yellow-100 text-yellow-700';
    label = 'Building Trust';
  } else if (score > 0) {
    color = 'bg-orange-100 text-orange-700';
    label = 'New Seller';
  }

  const isSmall = size === 'small';

  return (
    <div className={'inline-flex items-center gap-1.5 rounded-full font-semibold ' + color + (isSmall ? ' px-2 py-1 text-xs' : ' px-3 py-1.5 text-sm')}>
      <FaShieldAlt size={isSmall ? 10 : 12} />
      <span>{score} Campus Score</span>
      {!isSmall && <span className="opacity-70">· {label}</span>}
    </div>
  );
};

export default CampusScoreBadge;
