
import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FaMapMarkerAlt, FaSearch, FaTimes, FaCheck } from 'react-icons/fa';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ClickHandler = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 200);
  }, [map]);
  return null;
};

const FlyTo = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 15);
  }, [position, map]);
  return null;
};

const LocationPickerModal = ({ onConfirm, initialAddress }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState(initialAddress || '');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);

  const handleSearchChange = (val) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.length < 3) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(val)
        );
        const data = await res.json();
        setResults(data.slice(0, 5));
      } catch (err) {
        setResults([]);
      }
      setSearching(false);
    }, 400);
  };

  const selectResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setPosition([lat, lng]);
    setAddress(result.display_name);
    setResults([]);
    setQuery(result.display_name);
  };

  const handleMapClick = async (lat, lng) => {
    setPosition([lat, lng]);
    try {
      const res = await fetch(
        'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng
      );
      const data = await res.json();
      setAddress(data.display_name || (lat.toFixed(4) + ', ' + lng.toFixed(4)));
    } catch (err) {
      setAddress(lat.toFixed(4) + ', ' + lng.toFixed(4));
    }
  };

  const handleConfirm = () => {
    if (!position) return;
    onConfirm(position[0], position[1], address);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 flex items-center justify-center gap-2 text-gray-600 hover:border-primary-400 hover:text-primary-600 transition"
      >
        <FaMapMarkerAlt />
        {address ? address.slice(0, 50) + (address.length > 50 ? '...' : '') : 'Choose Pickup Location on Map'}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-display font-bold text-lg text-dark">Choose Pickup Location</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-4 relative">
              <div className="relative mb-3">
                <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search for area, landmark, or address..."
                  className="input-field pl-9"
                />
                {results.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-[10000] overflow-hidden max-h-48 overflow-y-auto">
                    {results.map((r, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => selectResult(r)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 border-b border-gray-50 last:border-0"
                      >
                        {r.display_name}
                      </button>
                    ))}
                  </div>
                )}
                {searching && <p className="text-xs text-gray-400 mt-1">Searching...</p>}
              </div>

              <div className="h-80 rounded-lg overflow-hidden border border-gray-300">
                <MapContainer center={position || [20.5937, 78.9629]} zoom={position ? 15 : 5} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <ClickHandler onSelect={handleMapClick} />
                  <MapResizer />
                  {position && <FlyTo position={position} />}
                  {position && <Marker position={position} />}
                </MapContainer>
              </div>

              <p className="text-xs text-gray-400 mt-2">Click anywhere on the map or search above to drop a pin.</p>
            </div>

            <div className="flex gap-3 p-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!position}
                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FaCheck /> Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LocationPickerModal;
