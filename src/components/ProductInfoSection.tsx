import { useEffect, useState } from 'react'
import { fetchProductInfo } from '../mockApi'
import type { ProductInfoData } from '../mockApi/types'

/**
 * Product Info Section (Product Team)
 * Pattern: No Anchor (Static Content Only)
 * This section displays basic product information - NO translation needed
 */
export const ProductInfoSection = () => {
  const [data, setData] = useState<ProductInfoData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProductInfo().then((response) => {
      setData(response)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="section static-section">
        <h2>📱 Product Information</h2>
        <div className="loading">Loading product info...</div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="section static-section">
      <h2>📱 Product Information (Product Team)</h2>
      <div className="status-badge">
        <span className="status-static">
          ⚪ Static Content (No Translation)
        </span>
      </div>

      {/* No anchor needed - this is static content */}
      <div className="content-card">
        <p>
          <strong>Product ID:</strong> {data.product_id}
        </p>
        <p>
          <strong>Name:</strong> {data.product_name}
        </p>
        <p>
          <strong>Price:</strong> {data.price}
        </p>
        <p>
          <strong>Stock:</strong> {data.stock} units available
        </p>
        <p>
          <strong>SKU:</strong> {data.sku}
        </p>
      </div>

      <div className="team-note">
        💡 <strong>Pattern:</strong> No anchor needed for static content
        <br />
        <small>(Product IDs, prices, and SKUs don't need translation)</small>
      </div>
    </div>
  )
}
