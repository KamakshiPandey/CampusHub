
import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => (
  <div className="max-w-md mx-auto px-4 py-24 text-center">
    <FaExclamationTriangle size={48} className="text-accent-500 mx-auto mb-4" />
    <h1 className="font-display text-3xl font-bold text-dark mb-2">Page Not Found</h1>
    <p className="text-gray-500 mb-6">The page you're looking for doesn't exist or was moved.</p>
    <Link to="/" className="btn-primary">Back to Home</Link>
  </div>
);

export default NotFound;
