import axios from 'axios';

const ICONSCOUNT_CLIENT_ID = import.meta.env.VITE_ICONSCOUT_CLIENT_ID || '1086373010237';
const API_BASE_URL = 'https://api.iconscout.com/v3';

// Cache for IconScout assets
const assetCache = new Map();

/**
 * Search IconScout for 3D medical icons, vector graphics, and animations
 */
export const searchIconScoutAssets = async (query = 'medical', assetType = 'icon', style = '3d') => {
  const cacheKey = `${query}_${assetType}_${style}`;
  if (assetCache.has(cacheKey)) {
    return assetCache.get(cacheKey);
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: {
        query,
        asset: assetType,
        style,
        per_page: 8
      },
      headers: {
        'Client-ID': ICONSCOUNT_CLIENT_ID
      }
    });

    if (response.data && response.data.response && response.data.response.items) {
      const items = response.data.response.items.data.map(item => ({
        id: item.id,
        name: item.name,
        previewUrl: item.urls?.png_128 || item.urls?.png_64 || item.urls?.thumb,
        svgUrl: item.urls?.svg || item.urls?.png_256
      }));
      assetCache.set(cacheKey, items);
      return items;
    }
  } catch (error) {
    console.warn('[IconScout API Notice] Fallback to high-res medical 3D CDN assets:', error.message);
  }

  // High-Quality IconScout 3D Medical Fallback Assets
  return getFallbackMedical3DAssets(query);
};

/**
 * High-definition IconScout 3D Medical Visual Assets
 */
export const getFallbackMedical3DAssets = (category = 'medical') => {
  return [
    {
      id: 'scout-3d-stethoscope',
      name: '3D Doctor Stethoscope',
      previewUrl: 'https://cdn.iconscout.com/icon/free/png-256/free-stethoscope-3d-icon-download-in-svg-png-gif-file-formats--medical-doctor-health-equipment-pack-icons-7622956.png'
    },
    {
      id: 'scout-3d-heart-rate',
      name: '3D Heart Pulse Monitor',
      previewUrl: 'https://cdn.iconscout.com/icon/free/png-256/free-heart-beat-3d-icon-download-in-svg-png-gif-file-formats--health-medical-pulse-rate-pack-healthcare-icons-7622957.png'
    },
    {
      id: 'scout-3d-pill-medicine',
      name: '3D Medical Capsule',
      previewUrl: 'https://cdn.iconscout.com/icon/free/png-256/free-medicine-pill-3d-icon-download-in-svg-png-gif-file-formats--medical-capsule-drug-health-pack-healthcare-icons-7622958.png'
    },
    {
      id: 'scout-3d-shield-triage',
      name: '3D Health Shield',
      previewUrl: 'https://cdn.iconscout.com/icon/free/png-256/free-medical-shield-3d-icon-download-in-svg-png-gif-file-formats--health-protection-security-pack-healthcare-icons-7622959.png'
    }
  ];
};
