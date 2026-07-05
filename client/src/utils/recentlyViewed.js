
const KEY = 'recently_viewed_listings';
const MAX_ITEMS = 8;

export const addRecentlyViewed = (listing) => {
  try {
    const existing = JSON.parse(localStorage.getItem(KEY) || '[]');
    const filtered = existing.filter((item) => item.id !== listing.id);
    const updated = [
      { id: listing.id, title: listing.title, price: listing.price, image: listing.image },
      ...filtered,
    ].slice(0, MAX_ITEMS);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Could not save recently viewed', err);
  }
};

export const getRecentlyViewed = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch (err) {
    return [];
  }
};
