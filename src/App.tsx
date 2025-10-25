import { useState } from 'react'
import { ProductInfoSection } from './components/ProductInfoSection'
import { ProductQADrawer } from './components/ProductQADrawer'
import { ProductReviewsSection } from './components/ProductReviewsSection'
import { ShippingInfoSection } from './components/ShippingInfoSection'
import { VoucherInfoSection } from './components/VoucherInfoSection'
import { GlobalTranslationProvider } from './sdk'
import './App.css'

function App() {
  // Control panel state
  const [scenario, setScenario] = useState<string>('all-success')
  const [showProductInfo, setShowProductInfo] = useState(true)
  const [showReviews, setShowReviews] = useState(true)
  const [showVouchers, setShowVouchers] = useState(true)
  const [showShippingInfo, setShowShippingInfo] = useState(true)

  // Drawer state
  const [isQADrawerOpen, setIsQADrawerOpen] = useState(false)

  // Get success flags based on scenario
  const getSuccessFlags = () => {
    switch (scenario) {
      case 'all-success':
        return {
          reviews: true,
          vouchers: true,
        }
      case 'all-fail':
        return {
          reviews: false,
          vouchers: false,
        }
      case 'only-reviews':
        return {
          reviews: true,
          vouchers: false,
        }
      case 'only-vouchers':
        return {
          reviews: false,
          vouchers: true,
        }
      default:
        return {
          reviews: true,
          vouchers: true,
        }
    }
  }

  const flags = getSuccessFlags()

  return (
    <GlobalTranslationProvider
      buttonConfig={{
        verticalSpacing: 'bottom',
        spacingValue: '20px',
      }}
      transifyConfig={{
        translateText: 'Translate',
        seeOriginalText: 'See Original',
        updateToastText: 'Language updated',
      }}
      toastConfig={{
        bottomSpacing: '80px',
      }}
    >
      <div className="app">
        <header className="app-header">
          <h1>🌐 Dynamic Translation SDK - Product Detail Page</h1>
          <p className="subtitle">
            Global Provider + Multiple Anchors Pattern Demo
          </p>
        </header>

        {/* Architecture Visualization */}
        <div className="architecture-panel">
          <h3>📊 Page Architecture</h3>
          <div className="architecture-tree">
            <div className="tree-node provider-node">
              <span className="node-icon">🌍</span>
              <span className="node-label">GlobalTranslationProvider</span>
            </div>
            <div className="tree-children">
              {showProductInfo && (
                <div className="tree-branch">
                  <span className="branch-line">└─</span>
                  <div className="tree-node section-node no-anchor">
                    <span className="node-icon">📄</span>
                    <span className="node-label">Product Info</span>
                    <span className="node-badge">Static (No Anchor)</span>
                  </div>
                </div>
              )}
              {showReviews && (
                <div className="tree-branch">
                  <span className="branch-line">└─</span>
                  <div className="tree-node section-node has-anchor">
                    <span className="node-icon">⚓</span>
                    <span className="node-label">Product Reviews</span>
                    <span className="node-badge">1 API → 1 Anchor</span>
                  </div>
                </div>
              )}
              {showVouchers && (
                <div className="tree-branch">
                  <span className="branch-line">└─</span>
                  <div className="tree-node section-node has-anchor">
                    <span className="node-icon">⚓⚓</span>
                    <span className="node-label">Vouchers</span>
                    <span className="node-badge">1 API → 2 Anchors</span>
                  </div>
                </div>
              )}
              {showShippingInfo && (
                <div className="tree-branch">
                  <span className="branch-line">└─</span>
                  <div
                    className="tree-node section-node"
                    style={{
                      background: '#fef3c7',
                      border: '2px solid #fbbf24',
                    }}
                  >
                    <span className="node-icon">📦</span>
                    <span className="node-label">Shipping Info</span>
                    <span
                      className="node-badge"
                      style={{ background: '#fde68a', color: '#78350f' }}
                    >
                      Static + Dynamic Drawer
                    </span>
                  </div>
                  {isQADrawerOpen && (
                    <div style={{ marginLeft: '40px', marginTop: '8px' }}>
                      <span className="branch-line">└─</span>
                      <div
                        className="tree-node section-node has-anchor"
                        style={{ fontSize: '12px' }}
                      >
                        <span className="node-icon">⚓</span>
                        <span className="node-label">Q&A Drawer</span>
                        <span className="node-badge">Dynamic Content</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="legend">
            <div className="legend-item">
              <span className="legend-icon">⚓</span>
              <span>
                = Has TranslationAnchor (contributes to button visibility)
              </span>
            </div>
            <div className="legend-item">
              <span className="legend-icon">📄</span>
              <span>= Static content (no anchor, doesn't affect button)</span>
            </div>
            <div className="legend-item">
              <span className="legend-icon">📦</span>
              <span>= Static content that can open dynamic drawer/popup</span>
            </div>
          </div>
        </div>

        <div className="control-panel">
          <h3>🎮 Control Panel</h3>

          <div className="control-group">
            <label>
              <strong>Translation Scenario:</strong>
            </label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="scenario-select"
            >
              <option value="all-success">✓ All translations successful</option>
              <option value="all-fail">✗ All translations failed</option>
              <option value="only-reviews">🎯 Only reviews success</option>
              <option value="only-vouchers">🎟️ Only vouchers success</option>
            </select>
          </div>

          <div className="control-group">
            <label>
              <strong>Visible Sections:</strong>
            </label>
            <div className="checkboxes">
              <label>
                <input
                  type="checkbox"
                  checked={showProductInfo}
                  onChange={(e) => setShowProductInfo(e.target.checked)}
                />
                <span className="checkbox-icon">📄</span> Product Info (Static)
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={showReviews}
                  onChange={(e) => setShowReviews(e.target.checked)}
                />
                <span className="checkbox-icon">⚓</span> Product Reviews
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={showVouchers}
                  onChange={(e) => setShowVouchers(e.target.checked)}
                />
                <span className="checkbox-icon">⚓⚓</span> Vouchers
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={showShippingInfo}
                  onChange={(e) => setShowShippingInfo(e.target.checked)}
                />
                <span className="checkbox-icon">📦</span> Shipping Info (Static
                + Drawer)
              </label>
            </div>
          </div>

          <div className="info-box">
            <strong>📌 Key Rules:</strong>
            <ul>
              <li>
                Button shows when at least one anchor is{' '}
                <strong>visible in viewport</strong> with translation_status = 1
              </li>
              <li>
                Each anchor uses <strong>IntersectionObserver</strong> to detect
                viewport visibility
              </li>
              <li>
                Button <strong>auto-hides</strong> when you scroll past all
                translated content
              </li>
              <li>
                Button <strong>auto-shows</strong> when translated content
                enters viewport
              </li>
              <li>
                Static sections don't have anchors, so they don't affect the
                button
              </li>
              <li>
                Button is <strong>vertically draggable</strong> - drag it to
                adjust position and avoid covering content
              </li>
              <li>
                Button z-index (10000) is <strong>above drawer/popup</strong>{' '}
                (9500) for proper layering
              </li>
              <li>
                💡 <strong>Try scrolling</strong> to see the button
                appear/disappear based on visible content!
              </li>
              <li>
                💡 <strong>Click "View Product Q&A"</strong> in Shipping Info to
                see drawer with dynamic content!
              </li>
            </ul>
          </div>

          <div
            className="info-box"
            style={{ background: '#f0fdf4', borderColor: '#10b981' }}
          >
            <strong>🎨 Translation Patterns (TextTr vs useTextTr):</strong>
            <ul>
              <li>
                <strong>TextTr component</strong> (Product Reviews): Direct
                rendering without processing
                <br />
                <code
                  style={{
                    background: '#e0e7ff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  &lt;TextTr original="text" translated="texto" /&gt;
                </code>
              </li>
              <li>
                <strong>useTextTr hook</strong> (Vouchers): Process text before
                rendering
                <br />
                <code
                  style={{
                    background: '#e0e7ff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  const text = useTextTr(); text(...).toUpperCase()
                </code>
              </li>
              <li>
                <strong>When to use each:</strong>
                <br />→ Use <code>TextTr</code> for simple, direct rendering
                <br />→ Use <code>useTextTr</code> for uppercase, truncation,
                interpolation, or title attributes
              </li>
            </ul>
          </div>
        </div>

        <main className="content">
          {showProductInfo && <ProductInfoSection />}

          {showReviews && (
            <ProductReviewsSection shouldSucceed={flags.reviews} />
          )}

          {showVouchers && (
            <VoucherInfoSection shouldSucceed={flags.vouchers} />
          )}

          {showShippingInfo && (
            <ShippingInfoSection onOpenQA={() => setIsQADrawerOpen(true)} />
          )}
        </main>

        {/* Product Q&A Drawer */}
        <ProductQADrawer
          isOpen={isQADrawerOpen}
          onClose={() => setIsQADrawerOpen(false)}
          shouldSucceed={flags.reviews}
        />

        <footer className="app-footer">
          <p>
            💡 Try different scenarios and toggle sections to see the
            translation button behavior
          </p>
          <p style={{ fontSize: '12px', marginTop: '10px', color: '#999' }}>
            Product Detail Page Demo - Showcasing static and dynamic content
            patterns
          </p>
        </footer>
      </div>
    </GlobalTranslationProvider>
  )
}

export default App
