import React, { useEffect, useState } from 'react';
import { fetchShopInfo } from '../mockApi';
import type { ShopInfoData } from '../mockApi/types';

/**
 * Shop Info Section (Shop Team)
 * Pattern: No Anchor (Static Content Only)
 * This section displays shop information - NO translation needed
 */
export const ShopInfoSection = () => {
  const [data, setData] = useState<ShopInfoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShopInfo().then((response) => {
      setData(response);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="section static-section">
        <h2>🏪 Shop Information</h2>
        <div className="loading">Loading shop info...</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="section static-section">
      <h2>🏪 Shop Information (Shop Team)</h2>
      <div className="status-badge">
        <span className="status-static">⚪ Static Content (No Translation)</span>
      </div>

      {/* No anchor needed - this is static content */}
      <div className="content-card">
        <p>
          <strong>Shop:</strong> {data.shop_name}
        </p>
        <p>
          <strong>Rating:</strong> {data.shop_rating} / 5.0 ⭐
        </p>
        <p>
          <strong>Products:</strong> {data.total_products.toLocaleString()} items
        </p>
        <p>
          <strong>Response Rate:</strong> {data.response_rate}
        </p>
        <p>
          <strong>Response Time:</strong> {data.response_time}
        </p>
      </div>

      <div className="team-note">
        💡 <strong>Pattern:</strong> No anchor needed for static content
        <br />
        <small>(Shop metrics don't require translation)</small>
      </div>
    </div>
  );
};
