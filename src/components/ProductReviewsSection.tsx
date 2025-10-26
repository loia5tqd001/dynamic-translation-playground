import { useEffect, useState } from 'react'
import { fetchProductReviews } from '../mockApi'
import type { ProductReviewsData } from '../mockApi/types'
import { TextTr, TranslationAnchor } from '../sdk'

/**
 * Product Reviews Section (Review Team)
 * Pattern: 1 API → 1 Anchor
 * Translation Pattern: Using TextTr COMPONENT for direct rendering
 *
 * This section demonstrates using the TextTr component when you just need
 * to render translated text without any processing.
 */
export const ProductReviewsSection = ({
  shouldSucceed,
}: {
  shouldSucceed: boolean
}) => {
  const [data, setData] = useState<ProductReviewsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchProductReviews(shouldSucceed).then((response) => {
      setData(response)
      setLoading(false)
    })
  }, [shouldSucceed])

  if (loading) {
    return (
      <div className="section dynamic-section">
        <h2>⭐ Product Reviews (Review Team)</h2>
        <div className="loading">Loading reviews...</div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="section dynamic-section">
      <h2>⭐ Product Reviews (Review Team)</h2>
      <div className="status-badge">
        {data.translation_status === 1 ? (
          <span className="status-success">✓ Translation Available</span>
        ) : (
          <span className="status-failed">✗ Translation Failed</span>
        )}
      </div>

      {/* Static summary - no anchor */}
      <div className="content-card">
        <p>
          <strong>Average Rating:</strong> {data.average_rating} / 5.0 ⭐
        </p>
        <p>
          <strong>Total Reviews:</strong> {data.total_reviews}
        </p>
      </div>

      {/* Anchor wraps only the dynamic content (review comments) */}
      <TranslationAnchor translation_status={data.translation_status}>
        <div className="reviews-container">
          {data.reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <strong>{review.username}</strong>
                <span className="rating">{'⭐'.repeat(review.rating)}</span>
              </div>
              <p className="review-comment">
                <TextTr
                  original={review.comment}
                  translation={review.comment_tr}
                />
              </p>
              <small style={{ color: '#999' }}>{review.date}</small>
            </div>
          ))}
        </div>
      </TranslationAnchor>

      <div className="team-note">
        💡 Using <code>TextTr</code> component for direct rendering
        <br />
        <small>
          Perfect for simple cases where you just need to display translated
          text as-is
        </small>
      </div>
    </div>
  )
}
