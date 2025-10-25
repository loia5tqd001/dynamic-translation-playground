import React, { useEffect, useState } from 'react';
import { fetchShippingInfo } from '../mockApi';
import type { ShippingInfoData } from '../mockApi/types';

/**
 * Shipping Info Section (Shipping Team)
 * Pattern: No Anchor (Static Content Only)
 * This section displays shipping information - NO translation needed
 *
 * Purpose: Placed at the BOTTOM to demonstrate viewport behavior
 * When you scroll past all dynamic sections (Reviews, Vouchers),
 * the translation button should disappear even though there's more
 * content below (this static section).
 */
export const ShippingInfoSection = () => {
  const [data, setData] = useState<ShippingInfoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShippingInfo().then((response) => {
      setData(response);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="section static-section">
        <h2>🚚 Shipping Information</h2>
        <div className="loading">Loading shipping info...</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="section static-section">
      <h2>🚚 Shipping Information (Shipping Team)</h2>
      <div className="status-badge">
        <span className="status-static">⚪ Static Content (No Translation)</span>
      </div>

      {/* No anchor needed - this is static content */}
      <div className="content-card">
        <h3 style={{ marginTop: 0 }}>Available Shipping Methods:</h3>
        {data.shipping_methods.map((method) => (
          <div key={method.id} style={{ marginBottom: '10px' }}>
            <p>
              <strong>{method.name}</strong> - {method.cost}
            </p>
            <p style={{ marginLeft: '20px', color: '#666' }}>
              Delivery: {method.delivery_time}
            </p>
          </div>
        ))}

        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />

        <p>
          <strong>Return Policy:</strong> {data.return_policy}
        </p>
        <p>
          <strong>Tracking:</strong> {data.tracking_available ? '✓ Available' : '✗ Not available'}
        </p>
      </div>

      <div className="team-note">
        💡 <strong>Pattern:</strong> No anchor needed for static content
        <br />
        <small>(Placed at bottom to demonstrate viewport behavior - button hides when scrolling past all dynamic content)</small>
      </div>
    </div>
  );
};
