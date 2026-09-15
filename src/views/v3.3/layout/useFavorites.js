import { ref } from 'vue';

const STORAGE_KEY = 'dm-v33.favorites';
const favorites = ref(loadFavorites());

function loadFavorites() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value.filter((path) => typeof path === 'string') : [];
  } catch {
    return [];
  }
}

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value)); } catch { /* ignore */ }
}

export function useFavorites() {
  const isFavorite = (path) => favorites.value.includes(path);
  function toggleFavorite(path) {
    if (!path) return;
    favorites.value = isFavorite(path)
      ? favorites.value.filter((item) => item !== path)
      : [...favorites.value, path];
    persist();
  }
  function removeFavorite(path) {
    favorites.value = favorites.value.filter((item) => item !== path);
    persist();
  }
  return { favorites, isFavorite, toggleFavorite, removeFavorite };
}
