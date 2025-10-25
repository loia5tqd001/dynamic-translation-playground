import React, { useEffect, useState } from 'react'
import { fetchShippingInfo } from '../mockApi'
import type { ShippingInfoData } from '../mockApi/types'

/**
 * Shipping Info Section (Shipping Team)
 * Pattern: Static content with button to open dynamic drawer
 * This section itself is static, but can trigger a drawer/popup with dynamic content
 *
 * Purpose: Demonstrates a static section that CAN trigger dynamic content
 * Different from truly static sections (ProductInfo, ShopInfo) that have no dynamic content at all
 */
export const ShippingInfoSection = ({ onOpenQA }: { onOpenQA: () => void }) => {
  const [data, setData] = useState<ShippingInfoData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchShippingInfo().then((response) => {
      setData(response)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="section static-section">
        <h2>🚚 Shipping Information</h2>
        <div className="loading">Loading shipping info...</div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="section static-section has-drawer">
      <h2>🚚 Shipping Information (Shipping Team)</h2>
      <div className="status-badge">
        <span
          className="status-static"
          style={{ background: '#fef3c7', color: '#92400e' }}
        >
          📦 Static Content + Dynamic Popup
        </span>
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

        <hr
          style={{
            margin: '20px 0',
            border: 'none',
            borderTop: '1px solid #e0e0e0',
          }}
        />

        <p>
          <strong>Return Policy:</strong> {data.return_policy}
        </p>
        <p>
          <strong>Tracking:</strong>{' '}
          {data.tracking_available ? '✓ Available' : '✗ Not available'}
        </p>

        <div style={{ marginTop: '20px' }}>
          <button
            onClick={onOpenQA}
            style={{
              padding: '12px 24px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
            }}
          >
            ❓ View Product Q&A (Opens Dynamic Drawer)
          </button>
        </div>
      </div>

      <div
        className="team-note"
        style={{ background: '#fef3c7', borderColor: '#fbbf24' }}
      >
        💡 <strong>Pattern:</strong> Static section that can trigger dynamic
        content
        <br />
        <small>
          - This section itself is static (no anchor)
          <br />- But clicking the button opens a drawer with dynamic content
          <br />- Translation button only shows when drawer is open with
          translated content
          <br />- Different from truly static sections (Product Info, Shop Info)
          that have no dynamic content at all
        </small>
      </div>
    </div>
  )
}
