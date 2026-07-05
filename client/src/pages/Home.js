
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaCouch, FaLaptop, FaBook, FaBicycle, FaHome, FaArrowRight, FaBoxOpen } from 'react-icons/fa';
import api from '../utils/api';
import { UPLOADS_URL } from '../utils/constants';
import { GridSkeleton } from '../components/Skeleton';

const categories = [
  { name: 'Furniture', icon: <FaCouch />, value: 'Furniture' },
  { name: 'Electronics', icon: <FaLaptop />, value: 'Electronics' },
  { name: 'Books', icon: <FaBook />, value: 'Books' },
  { name: 'Bikes', icon: <FaBicycle />, value: 'Bikes' },
  { name: 'Rooms', icon: <FaHome />, value: 'Rooms' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/listings').then((res) => setListings(res.data.slice(0, 6))).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Buy, Sell & Room Up With Your Campus Community
          </h1>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            The easiest way for students to trade items, rent gear, and find roommates near campus — no middlemen, no hassle.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); window.location.href = '/listings?search=' + search; }}
            className="max-w-xl mx-auto flex bg-white rounded-lg overflow-hidden shadow-lg"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for textbooks, furniture, bikes..."
              className="flex-grow px-5 py-3 text-gray-800 focus:outline-none"
            />
            <motion.button whileTap={{ scale: 0.95 }} type="submit" className="bg-accent-500 hover:bg-accent-600 text-white px-6 flex items-center justify-center transition">
              <FaSearch />
            </motion.button>
          </form>
          <div className="flex gap-4 justify-center mt-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link to="/listings" className="bg-white text-primary-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition inline-block">
                Browse Marketplace
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link to="/roommates" className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-primary-700 transition inline-block">
                Find Roommates
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-2xl font-bold text-dark mb-8 text-center">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.value}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              whileHover={{ y: -6 }}
            >
              <Link
                to={'/listings?category=' + cat.value}
                className="card flex flex-col items-center justify-center py-8 gap-3 transition"
              >
                <div className="text-3xl text-primary-500">{cat.icon}</div>
                <span className="font-medium text-gray-700">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display text-2xl font-bold text-dark">Recently Listed</h2>
            <Link to="/listings" className="text-primary-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <FaArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <GridSkeleton count={3} />
          ) : listings.length === 0 ? (
            <div className="text-center py-16">
              <FaBoxOpen size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No listings yet — be the first to post!</p>
              <Link to="/create-listing" className="btn-primary">Post an Item</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {listings.map((item, i) => (
                <motion.div
                  key={item.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                >
                  <Link to={'/listings/' + item.id} className="card overflow-hidden block">
                    <div className="h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img src={UPLOADS_URL + item.image} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-800 line-clamp-1">{item.title}</h3>
                        <span className="bg-primary-50 text-primary-600 text-xs font-medium px-2 py-1 rounded">
                          {item.type === 'rent' ? 'Rent' : 'Sale'}
                        </span>
                      </div>
                      <p className="text-primary-600 font-bold mt-1">₹{item.price}</p>
                      <p className="text-gray-400 text-xs mt-1">{item.location}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-primary-50 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto px-4 text-center"
        >
          <h2 className="font-display text-2xl font-bold text-dark mb-3">Looking for a Roommate?</h2>
          <p className="text-gray-600 mb-6">Connect with verified students near your campus looking to split rent and share a space.</p>
          <Link to="/roommates" className="btn-primary">Explore Roommate Listings</Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
