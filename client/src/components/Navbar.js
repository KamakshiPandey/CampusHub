
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaComments, FaPlus, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-lg">C</span>
            </div>
            <span className="font-display font-bold text-xl text-dark">CampusHub</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/listings" className="text-gray-600 hover:text-primary-600 font-medium transition">
              Buy & Sell
            </Link>
            <Link to="/roommates" className="text-gray-600 hover:text-primary-600 font-medium transition">
              Find Roommates
            </Link>
            {user && (
              <Link to="/chats" className="text-gray-600 hover:text-primary-600 font-medium transition flex items-center gap-1">
                <FaComments /> Messages
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/create-listing" className="btn-primary flex items-center gap-2 text-sm">
                  <FaPlus /> Post Item
                </Link>
                <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-primary-600">
                  <FaUserCircle size={22} />
                  <span className="font-medium">{user.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 text-sm font-medium">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link to="/listings" className="block text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
            Buy & Sell
          </Link>
          <Link to="/roommates" className="block text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
            Find Roommates
          </Link>
          {user ? (
            <>
              <Link to="/chats" className="block text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
                Messages
              </Link>
              <Link to="/create-listing" className="block text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
                Post Item
              </Link>
              <Link to="/profile" className="block text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <button onClick={handleLogout} className="block text-red-500 font-medium">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="block text-primary-600 font-medium" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
