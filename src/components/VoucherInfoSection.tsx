import { useEffect, useState } from 'react'
import { fetchVoucherInfo } from '../mockApi'
import type { VoucherInfoData } from '../mockApi/types'
import { TranslationAnchor, useTextTr } from '../sdk'

/**
 * Voucher Info Section (Marketing Team)
 * Pattern: 1 API → 2 Anchors (separate sections from same API)
 * Translation Pattern: Using useTextTr HOOK for text processing
 *
 * This section demonstrates using the useTextTr hook when you need to:
 * - Process text before rendering (uppercase, truncation, etc.)
 * - Interpolate variables into text
 * - Use text in non-render contexts (aria-label, title, etc.)
 */
export const VoucherInfoSection = ({
  shouldSucceed,
}: {
  shouldSucceed: boolean
}) => {
  const [data, setData] = useState<VoucherInfoData | null>(null)
  const [loading, setLoading] = useState(true)
  const getText = useTextTr()

  useEffect(() => {
    setLoading(true)
    fetchVoucherInfo(shouldSucceed).then((response) => {
      setData(response)
      setLoading(false)
    })
  }, [shouldSucceed])

  if (loading) {
    return (
      <div className="section dynamic-section">
        <h2>🎟️ Vouchers & Promotions (Marketing Team)</h2>
        <div className="loading">Loading voucher info...</div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="section dynamic-section">
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
          {data.available_vouchers.map((voucher) => {
            // Example 1: Using useTextTr hook to process text before rendering
            const title = getText(voucher.title, voucher.title_tr)
            const titleUppercase = title.toUpperCase() // Text processing!

            return (
              <div key={voucher.id} style={{ marginBottom: '15px' }}>
                <p>
                  <strong>Code:</strong> <code>{voucher.code}</code> -{' '}
                  <strong>{voucher.discount}</strong>
                </p>
                {/* Rendered with uppercase transformation */}
                <p style={{ fontWeight: 600, color: '#dc2626' }}>
                  {titleUppercase}
                </p>
                <small style={{ color: '#666' }}>
                  Minimum spend: {voucher.min_spend}
                </small>
              </div>
            )
          })}
        </div>
      </TranslationAnchor>

      {/* Second anchor: Terms & Conditions section from same API */}
      <h3>Terms & Conditions</h3>
      <TranslationAnchor translation_status={data.translation_status}>
        <div className="content-card">
          {/* Example 2: Using useTextTr hook for truncation */}
          <p>
            {(() => {
              const terms = getText(
                data.voucher_terms.terms,
                data.voucher_terms.terms_tr,
              )
              const truncated =
                terms.length > 60 ? terms.slice(0, 60) + '...' : terms
              return truncated
            })()}
          </p>
          <p>
            <strong>Expires:</strong> {data.voucher_terms.expiry}
          </p>
        </div>
      </TranslationAnchor>

      <div className="team-note">
        💡 Using <code>useTextTr</code> hook for text processing
        <br />
        <small>
          - Example 1 (above): UPPERCASE transformation
          <br />- Example 2: Text truncation
          <br />✨ Use the hook when you need to process text before rendering!
        </small>
      </div>
    </div>
  )
}
