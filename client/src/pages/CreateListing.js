
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaImage, FaBoxOpen, FaHome } from 'react-icons/fa';
import api from '../utils/api';
import LocationPickerModal from '../components/LocationPickerModal';

const CreateListing = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('item');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  const [item, setItem] = useState({
    title: '', description: '', price: '', category: 'Furniture',
    type: 'sell', condition: 'used', location: '', image: null,
    latitude: null, longitude: null,
  });

  const [room, setRoom] = useState({
    title: '', description: '', budget: '', location: '',
    moveInDate: '', genderPreference: 'any', image: null,
  });

  const handleImage = (e, target) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    if (target === 'item') setItem({ ...item, image: file });
    else setRoom({ ...room, image: file });
  };

  const handleLocationConfirm = (lat, lng, address) => {
    setItem({ ...item, latitude: lat, longitude: lng, location: address });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = new FormData();
      const source = mode === 'item' ? item : room;
      Object.entries(source).forEach(([key, val]) => {
        if (val !== null && val !== '') data.append(key, val);
      });

      if (mode === 'item') {
        await api.post('/listings', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        navigate('/listings');
      } else {
        await api.post('/roommates', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        navigate('/roommates');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-dark mb-2">Create a Post</h1>
      <p className="text-gray-500 mb-6">List an item for sale/rent, or find a roommate.</p>

      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setMode('item')}
          className={'flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 border ' +
            (mode === 'item' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-300')}
        >
          <FaBoxOpen /> Sell / Rent Item
        </button>
        <button
          onClick={() => setMode('room')}
          className={'flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 border ' +
            (mode === 'room' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-300')}
        >
          <FaHome /> Find Roommate
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-400 transition">
          <input type="file" accept="image/*" hidden onChange={(e) => handleImage(e, mode)} />
          {preview ? (
            <img src={preview} alt="preview" className="h-40 mx-auto object-cover rounded-lg" />
          ) : (
            <div className="text-gray-400 flex flex-col items-center gap-2">
              <FaImage size={28} />
              <span>Click to upload a photo</span>
            </div>
          )}
        </label>

        {mode === 'item' ? (
          <>
            <input required placeholder="Title (e.g. Study Table, Bicycle)" className="input-field"
              value={item.title} onChange={(e) => setItem({ ...item, title: e.target.value })} />
            <textarea required placeholder="Description" rows="3" className="input-field"
              value={item.description} onChange={(e) => setItem({ ...item, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <input required type="number" placeholder="Price (₹)" className="input-field"
                value={item.price} onChange={(e) => setItem({ ...item, price: e.target.value })} />
              <select className="input-field" value={item.type} onChange={(e) => setItem({ ...item, type: e.target.value })}>
                <option value="sell">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select className="input-field" value={item.category} onChange={(e) => setItem({ ...item, category: e.target.value })}>
                <option>Furniture</option>
                <option>Electronics</option>
                <option>Books</option>
                <option>Bikes</option>
                <option>Rooms</option>
                <option>Other</option>
              </select>
              <select className="input-field" value={item.condition} onChange={(e) => setItem({ ...item, condition: e.target.value })}>
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="like-new">Like New</option>
              </select>
            </div>

            <LocationPickerModal onConfirm={handleLocationConfirm} initialAddress={item.location} />
          </>
        ) : (
          <>
            <input required placeholder="Title (e.g. Looking for roommate near campus)" className="input-field"
              value={room.title} onChange={(e) => setRoom({ ...room, title: e.target.value })} />
            <textarea required placeholder="Description" rows="3" className="input-field"
              value={room.description} onChange={(e) => setRoom({ ...room, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <input required type="number" placeholder="Budget (₹/month)" className="input-field"
                value={room.budget} onChange={(e) => setRoom({ ...room, budget: e.target.value })} />
              <input required placeholder="Location" className="input-field"
                value={room.location} onChange={(e) => setRoom({ ...room, location: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="date" className="input-field"
                value={room.moveInDate} onChange={(e) => setRoom({ ...room, moveInDate: e.target.value })} />
              <select className="input-field" value={room.genderPreference} onChange={(e) => setRoom({ ...room, genderPreference: e.target.value })}>
                <option value="any">Any Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Posting...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;
