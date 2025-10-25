import React, { useEffect, useState } from 'react';
import { TranslationAnchor, useTextTr } from '../sdk';
import { fetchVoucherInfo } from '../mockApi';
import type { VoucherInfoData } from '../mockApi/types';

/**
 * Voucher Info Section (Marketing Team)
 * Pattern: 1 API → 2 Anchors (separate sections from same API)
 * This section demonstrates using multiple anchors for different dynamic sections from one API
 */
export const VoucherInfoSection = ({
  shouldSucceed,
}: {
  shouldSucceed: boolean;
}) => {
  const [data, setData] = useState<VoucherInfoData | null>(null);
  const [loading, setLoading] = useState(true);
  const getText = useTextTr();

  useEffect(() => {
    setLoading(true);
    fetchVoucherInfo(shouldSucceed).then((response) => {
      setData(response);
      setLoading(false);
    });
  }, [shouldSucceed]);

  if (loading) {
    return (
      <div className="section">
        <h2>🎟️ Vouchers & Promotions (Marketing Team)</h2>
        <div className="loading">Loading voucher info...</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="section">
      <h2>🎟️ Vouchers & Promotions (Marketing Team)</h2>
      <div className="status-badge">
        {data.translation_status === 1 ? (
          <span className="status-success">✓ Translation Available</span>
        ) : (
          <span className="status-failed">✗ Translation Failed</span>
        )}
      </div>

      {/* First anchor: Available Vouchers section */}
      <h3>Available Vouchers</h3>
      <TranslationAnchor translation_status={data.translation_status}>
        <div className="content-card">
          {data.available_vouchers.map((voucher) => (
            <div key={voucher.id} style={{ marginBottom: '15px' }}>
              <p>
                <strong>Code:</strong> <code>{voucher.code}</code> -{' '}
                <strong>{voucher.discount}</strong>
              </p>
              <p>{getText(voucher.title, voucher.title_tr)}</p>
              <small style={{ color: '#666' }}>
                Minimum spend: {voucher.min_spend}
              </small>
            </div>
          ))}
        </div>
      </TranslationAnchor>

      {/* Second anchor: Terms & Conditions section from same API */}
      <h3>Terms & Conditions</h3>
      <TranslationAnchor translation_status={data.translation_status}>
        <div className="content-card">
          <p>{getText(data.voucher_terms.terms, data.voucher_terms.terms_tr)}</p>
          <p>
            <strong>Expires:</strong> {data.voucher_terms.expiry}
          </p>
        </div>
      </TranslationAnchor>

      <div className="team-note">
        💡 <strong>Pattern:</strong> Single API, multiple anchors for different
        dynamic sections
        <br />
        <small>
          (Each anchor independently contributes to button visibility counter)
        </small>
      </div>
    </div>
  );
};
