
import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold">C</span>
              </div>
              <span className="font-display font-bold text-lg text-white">CampusHub</span>
            </div>
            <p className="text-sm text-gray-400">
              The marketplace built by students, for students. Buy, sell, rent, and find your next roommate.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/listings" className="hover:text-primary-400">Buy & Sell</Link></li>
              <li><Link to="/roommates" className="hover:text-primary-400">Find Roommates</Link></li>
              <li><Link to="/create-listing" className="hover:text-primary-400">Post an Item</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-primary-400">Login</Link></li>
              <li><Link to="/register" className="hover:text-primary-400">Sign Up</Link></li>
              <li><Link to="/profile" className="hover:text-primary-400">My Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Connect</h4>
            <div className="flex gap-4 text-lg">
              <a href="#" className="hover:text-primary-400"><FaGithub /></a>
              <a href="#" className="hover:text-primary-400"><FaLinkedin /></a>
              <a href="#" className="hover:text-primary-400"><FaEnvelope /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
          © 2026 CampusHub. Built for students, by a student.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
