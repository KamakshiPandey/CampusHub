
import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaSort } from 'react-icons/fa';
import api from '../utils/api';
import { UPLOADS_URL } from '../utils/constants';
import { GridSkeleton } from '../components/Skeleton';
import RecentlyViewed from '../components/RecentlyViewed';

const PAGE_SIZE = 8;

const Listings = () => {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [type, setType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);

  const fetchListings = async (overrideSort) => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (type) params.type = type;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      params.sort = overrideSort || sort;
      const res = await api.get('/listings', { params });
      setListings(res.data);
      setPage(1);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line
  }, []);

  const handleSearchChange = (val) => {
    setSearch(val);
    setShowSuggestions(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get('/listings/suggestions', { params: { q: val } });
        setSuggestions(res.data);
      } catch (err) {
        setSuggestions([]);
      }
    }, 300);
  };

  const handleSortChange = (val) => {
    setSort(val);
    fetchListings(val);
  };

  const totalPages = Math.ceil(listings.length / PAGE_SIZE) || 1;
  const paginated = listings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-dark mb-2">Buy & Sell</h1>
      <p className="text-gray-500 mb-8">Find items from students near your campus.</p>

      <RecentlyViewed />

      <div className="card p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-2 relative">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400 z-10" />
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search items..."
              className="input-field pl-9"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-20 overflow-hidden">
                {suggestions.map((s) => (
                  <Link
                    key={s.id}
                    to={'/listings/' + s.id}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 border-b border-gray-50 last:border-0"
                  >
                    <span className="font-medium">{s.title}</span>
                    <span className="text-gray-400 text-xs ml-2">{s.category}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
            <option value="">All Categories</option>
            <option value="Furniture">Furniture</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="Bikes">Bikes</option>
            <option value="Rooms">Rooms</option>
            <option value="Other">Other</option>
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className="input-field">
            <option value="">Buy or Rent</option>
            <option value="sell">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
          <button onClick={() => fetchListings()} className="btn-primary flex items-center justify-center gap-2">
            <FaFilter /> Apply
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min Price" className="input-field" />
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max Price" className="input-field" />
          <select value={sort} onChange={(e) => handleSortChange(e.target.value)} className="input-field md:col-span-2 flex items-center">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <GridSkeleton count={8} />
      ) : listings.length === 0 ? (
        <p className="text-center text-gray-500 py-20">No listings found. Try adjusting your filters.</p>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <FaSort /> Showing {listings.length} result{listings.length !== 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginated.map((item) => (
              <Link to={'/listings/' + item.id} key={item.id} className="card overflow-hidden">
                <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img src={UPLOADS_URL + item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{item.title}</h3>
                    <span className="bg-primary-50 text-primary-600 text-xs font-medium px-2 py-1 rounded whitespace-nowrap">
                      {item.type === 'rent' ? 'Rent' : 'Sale'}
                    </span>
                  </div>
                  <p className="text-primary-600 font-bold mt-1">₹{item.price}</p>
                  <p className="text-gray-400 text-xs mt-1">{item.location || 'Campus area'}</p>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="p-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50">
                <FaChevronLeft />
              </button>
              <span className="text-gray-600 text-sm">Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="p-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50">
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Listings;
