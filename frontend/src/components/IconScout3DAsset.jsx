import React, { useState, useEffect } from 'react';
import { searchIconScoutAssets } from '../utils/iconScout';

export default function IconScout3DAsset({ query = 'medical', className = 'w-12 h-12', alt = 'IconScout 3D Asset' }) {
  const [assetUrl, setAssetUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    searchIconScoutAssets(query, 'icon', '3d')
      .then((items) => {
        if (isMounted && items && items.length > 0) {
          // Select item
          setAssetUrl(items[0].previewUrl);
        }
      })
      .catch((err) => console.warn('IconScout asset load notice:', err));

    return () => {
      isMounted = false;
    };
  }, [query]);

  if (!assetUrl) {
    return (
      <div className={`${className} bg-slate-900 rounded-xl border border-slate-800 animate-pulse flex items-center justify-center`}>
        <span className="text-[10px] text-slate-500 font-mono">3D</span>
      </div>
    );
  }

  return (
    <img
      src={assetUrl}
      alt={alt}
      className={`${className} object-contain transition-transform hover:scale-110 drop-shadow-md`}
      loading="lazy"
    />
  );
}
