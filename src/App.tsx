import { useState } from 'react'
import { ProductInfoSection } from './components/ProductInfoSection'
import { ProductQADrawer } from './components/ProductQADrawer'
import { ProductReviewsSection } from './components/ProductReviewsSection'
import { ProductSpecsDrawer } from './components/ProductSpecsDrawer'
import { ShippingInfoSection } from './components/ShippingInfoSection'
import { VoucherInfoSection } from './components/VoucherInfoSection'
import { GlobalTranslationProvider } from './sdk'
import './App.css'

// Platform types defined in consuming application (outside SDK)
type Platform = 'PC' | 'RW'

function App() {
  // Control panel state
  const [scenario, setScenario] = useState<string>('all-success')
  const [platform, setPlatform] = useState<Platform>('RW')
  const [showProductInfo, setShowProductInfo] = useState(true)
  const [showReviews, setShowReviews] = useState(true)
  const [showVouchers, setShowVouchers] = useState(true)
  const [showShippingInfo, setShowShippingInfo] = useState(true)

  // Drawer state
  const [isQADrawerOpen, setIsQADrawerOpen] = useState(false)
  const [isSpecsDrawerOpen, setIsSpecsDrawerOpen] = useState(false)

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

  // Platform-specific logic (outside SDK)
  // PC: Always translated, button hidden, no user control
  // RW: User can toggle, button visible and draggable
  const isPCPlatform = platform === 'PC'

  return (
    <GlobalTranslationProvider
      buttonConfig={{
        verticalSpacing: 'bottom',
        spacingValue: '20px',
        hideButton: isPCPlatform, // Hide button on PC platform
      }}
      transifyConfig={{
        translateText: 'Translate',
        seeOriginalText: 'See Original',
        updateToastText: 'Language updated',
      }}
      toastConfig={{
        bottomSpacing: '80px',
      }}
      forceTranslated={isPCPlatform} // Force translation on PC platform
    >
      <div className="app">
        <header className="app-header">
          <h1>🌐 Dynamic Translation SDK - Product Detail Page</h1>
        </header>

        {/* About This Demo */}
        <div className="info-box" style={{ marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0 }}>📖 About This Demo</h3>
          <p>
            <strong>What is this?</strong> This is an interactive demonstration
            of the <strong>Dynamic Translation SDK</strong> - intelligently
            shows/hides translation button based on translation status of
            dynamic content and whether they're visible on screen.
          </p>

          <p>
            <strong>Understanding Content Types:</strong>
          </p>
          <ul style={{ marginTop: 0, marginBottom: '12px' }}>
            <li>
              <strong>Static Content</strong> (📄) - Predefined text that{' '}
              <em>could</em> be translated, but is handled by i18n/Transify keys
              at build time (e.g., labels, buttons, product specs). These don't
              need the Dynamic Translation SDK.
            </li>
            <li>
              <strong>Dynamic Content</strong> (⚓) - User-generated content
              from sellers, operations, or shoppers that <em>cannot</em> be
              predefined (e.g., product reviews, seller voucher descriptions,
              Q&A responses). These must be translated on-the-fly via API calls,
              which is what this SDK handles.
            </li>
            <li>
              <strong>Hybrid Sections</strong> (📦) - Static content that can
              open popups/drawers containing dynamic content
            </li>
          </ul>

          <p>
            <strong>How the SDK works:</strong>
          </p>
          <ul style={{ marginBottom: 0 }}>
            <li>
              Sections with <strong>dynamic content</strong> use{' '}
              <code>TranslationAnchor</code> components to register with the SDK
            </li>
            <li>
              The translation button <strong>automatically appears</strong> when
              you scroll to successfully translated dynamic content
            </li>
            <li>
              The button <strong>automatically hides</strong> when no translated
              dynamic content is visible on screen
            </li>
            <li>
              This ensures users only see translation controls when there's
              actual dynamic content that has been translated
            </li>
            <li>
              <strong>Edge Case:</strong> When the main page has no dynamic
              content, but a drawer/popup contains dynamic content (like Product
              Q&A), the button only appears when the drawer is opened
            </li>
          </ul>

          <div
            style={{
              marginTop: '12px',
              padding: '12px',
              background: '#fef3c7',
              borderRadius: '8px',
              border: '2px solid #fbbf24',
              fontSize: '13px',
            }}
          >
            <strong style={{ color: '#92400e' }}>
              🧪 How to test the edge case:
            </strong>
            <ol style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li style={{ color: '#78350f', marginBottom: '4px' }}>
                Ensure that the <strong>Platform Mode</strong> is set to{' '}
                <strong>RW</strong> and the{' '}
                <strong>Translation Scenario</strong> is set to{' '}
                <strong>"All translations successful"</strong>
              </li>
              <li style={{ color: '#78350f', marginBottom: '4px' }}>
                In Visible Sections, uncheck <strong>Product Reviews</strong>{' '}
                and <strong>Vouchers</strong> sections (remove all main page
                dynamic content), keep <strong>Product Info</strong> section
                checked
              </li>
              <li style={{ color: '#78350f', marginBottom: '4px' }}>
                Notice the translation button is <strong>hidden</strong> (no
                dynamic content on page)
              </li>
              <li style={{ color: '#78350f' }}>
                Click <strong>"View Q&A"</strong> button in Shipping Info - the
                translation button <strong>appears</strong> only when drawer
                opens!
              </li>
            </ol>
          </div>
        </div>

        <div
          className="info-box"
          style={{
            marginBottom: '20px',
          }}
        >
          <strong>🎨 Translation Components</strong>
          <p style={{ margin: '8px 0', fontSize: '13px' }}>
            The SDK provides two ways to render translated text:
          </p>
          <ul style={{ fontSize: '13px' }}>
            <li>
              <strong>
                <code>&lt;TextTr /&gt;</code> Component
              </strong>{' '}
              (see Product Reviews)
              <br />
              For direct rendering without text processing
              <br />
              <code
                style={{
                  background: '#e0e7ff',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              >
                &lt;TextTr original="text" translated="texto" /&gt;
              </code>
            </li>
            <li style={{ marginTop: '8px' }}>
              <strong>
                <code>useTextTr()</code> Hook
              </strong>{' '}
              (see Vouchers)
              <br />
              For processing text before rendering (uppercase, truncation,
              interpolation)
              <br />
              <code
                style={{
                  background: '#e0e7ff',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              >
                const text = useTextTr(); text(...).toUpperCase()
              </code>
            </li>
          </ul>
          <div
            style={{
              marginTop: '8px',
              padding: '8px',
              background: '#dbeafe',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            <strong>When to use:</strong> Use <code>TextTr</code> for simple
            display. Use <code>useTextTr</code> when you need to process the
            text (uppercase, truncate, add to title attributes, etc.)
          </div>
        </div>

        {/* Unified Control Panel */}
        <div className="control-panel">
          <h3>🎮 Control Panel</h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#666' }}>
            Experiment with different settings to see how the translation button
            behaves
          </p>

          <div className="control-group">
            <label>
              <strong>1️⃣ Platform Mode:</strong>
              <span
                style={{
                  fontSize: '12px',
                  color: '#666',
                  marginLeft: '8px',
                  fontWeight: 'normal',
                }}
              >
                How translation is controlled
              </span>
            </label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="platform"
                  value="RW"
                  checked={platform === 'RW'}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                />
                <span className="radio-label">
                  <span className="radio-icon">📱</span>
                  <span className="radio-text">
                    <strong>RW</strong>
                    <span className="radio-description">
                      User Controlled - Button visible and draggable
                    </span>
                  </span>
                </span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="platform"
                  value="PC"
                  checked={platform === 'PC'}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                />
                <span className="radio-label">
                  <span className="radio-icon">💻</span>
                  <span className="radio-text">
                    <strong>PC</strong>
                    <span className="radio-description">
                      Always Translated - Button hidden
                    </span>
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div className="control-group">
            <label>
              <strong>2️⃣ Translation Scenario:</strong>
              <span
                style={{
                  fontSize: '12px',
                  color: '#666',
                  marginLeft: '8px',
                  fontWeight: 'normal',
                }}
              >
                Simulate different API responses
              </span>
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

          {/* Page Architecture with Checkboxes */}
          <div className="control-group">
            <label>
              <strong>3️⃣ Visible Sections:</strong>
              <span
                style={{
                  fontSize: '12px',
                  color: '#666',
                  marginLeft: '8px',
                  fontWeight: 'normal',
                }}
              >
                Toggle which page sections to display
              </span>
            </label>
            <div>
              <div className="architecture-tree">
                <div className="tree-node provider-node">
                  <span className="node-icon">🌍</span>
                  <span className="node-label">GlobalTranslationProvider</span>
                </div>
                <div className="tree-children">
                  <div className="tree-branch">
                    <span className="branch-line">└─</span>
                    <label
                      className={`tree-node section-node no-anchor ${!showProductInfo ? 'node-disabled' : ''}`}
                      style={{
                        background: isSpecsDrawerOpen ? '#fef3c7' : undefined,
                        border: isSpecsDrawerOpen
                          ? '2px solid #fbbf24'
                          : undefined,
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={showProductInfo}
                        onChange={(e) => setShowProductInfo(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span className="node-icon">📄</span>
                      <span className="node-label">Product Info</span>
                      <span className="node-badge">
                        Static{' '}
                        {isSpecsDrawerOpen ? '+ Static Drawer' : '(No Anchor)'}
                      </span>
                    </label>
                  </div>

                  <div className="tree-branch">
                    <span className="branch-line">└─</span>
                    <label
                      className={`tree-node section-node has-anchor ${!showReviews ? 'node-disabled' : ''}`}
                      style={{ cursor: 'pointer' }}
                    >
                      <input
                        type="checkbox"
                        checked={showReviews}
                        onChange={(e) => setShowReviews(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span className="node-icon">⚓</span>
                      <span className="node-label">Product Reviews</span>
                      <span className="node-badge">1 API → 1 Anchor</span>
                    </label>
                  </div>

                  <div className="tree-branch">
                    <span className="branch-line">└─</span>
                    <label
                      className={`tree-node section-node has-anchor ${!showVouchers ? 'node-disabled' : ''}`}
                      style={{ cursor: 'pointer' }}
                    >
                      <input
                        type="checkbox"
                        checked={showVouchers}
                        onChange={(e) => setShowVouchers(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span className="node-icon">⚓⚓</span>
                      <span className="node-label">Vouchers</span>
                      <span className="node-badge">1 API → 2 Anchors</span>
                    </label>
                  </div>

                  <div className="tree-branch">
                    <span className="branch-line">└─</span>
                    <label
                      className={`tree-node section-node ${!showShippingInfo ? 'node-disabled' : ''}`}
                      style={{
                        background: '#fef3c7',
                        border: '2px solid #fbbf24',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={showShippingInfo}
                        onChange={(e) => setShowShippingInfo(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span className="node-icon">📦</span>
                      <span className="node-label">Shipping Info</span>
                      <span
                        className="node-badge"
                        style={{ background: '#fde68a', color: '#78350f' }}
                      >
                        Static + Dynamic Drawer
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="legend" style={{ marginTop: '16px' }}>
                <div className="legend-item">
                  <span className="legend-icon">⚓</span>
                  <span>
                    = Dynamic content with TranslationAnchor (user-generated,
                    translated on-the-fly)
                  </span>
                </div>
                <div className="legend-item">
                  <span className="legend-icon">📄</span>
                  <span>
                    = Static content (predefined, uses i18n/Transify keys)
                  </span>
                </div>
                <div className="legend-item">
                  <span className="legend-icon">📦</span>
                  <span>
                    = Static content that can open dynamic drawer/popup
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="content">
          {showProductInfo && (
            <ProductInfoSection
              onOpenSpecs={() => setIsSpecsDrawerOpen(true)}
            />
          )}

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

        {/* Product Q&A Drawer (Dynamic content) */}
        {/* EDGE CASE: When there's NO dynamic content visible on the main page,
            but this drawer contains dynamic content, the translation button should
            ONLY be visible when the drawer is open. This ensures the button appears
            contextually only when translated content is actually accessible to the user. */}
        <ProductQADrawer
          isOpen={isQADrawerOpen}
          onClose={() => setIsQADrawerOpen(false)}
          shouldSucceed={flags.reviews}
        />

        {/* Product Specifications Drawer (Static content) */}
        <ProductSpecsDrawer
          isOpen={isSpecsDrawerOpen}
          onClose={() => setIsSpecsDrawerOpen(false)}
        />

        <footer className="app-footer">
          <div
            style={{
              padding: '16px',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
            }}
          >
            <p style={{ margin: '0 0 12px 0', fontWeight: 'bold' }}>
              🎯 Quick Start Guide:
            </p>
            <ol
              style={{
                margin: 0,
                paddingLeft: '20px',
                fontSize: '14px',
                lineHeight: '1.8',
              }}
            >
              <li>
                Keep platform as <strong>RW</strong> to see the draggable
                translation button
              </li>
              <li>
                Set scenario to <strong>"Only reviews success"</strong>
              </li>
              <li>
                <strong>Scroll down</strong> to the Reviews section - the
                translation button will appear
              </li>
              <li>
                <strong>Scroll past</strong> the Reviews section - the button
                will disappear
              </li>
              <li>
                Try clicking the button to toggle between translated and
                original text
              </li>
              <li>
                Experiment with different scenarios and section combinations!
              </li>
              <li>
                <strong>Test the edge case:</strong> Uncheck Product Reviews and
                Vouchers sections, then click "View Q&A" in Shipping Info - the
                button will only appear when the drawer opens!
              </li>
            </ol>
          </div>
          <p
            style={{
              fontSize: '12px',
              marginTop: '16px',
              color: '#999',
              textAlign: 'center',
            }}
          >
            Dynamic Translation SDK - Product Detail Page Demo
          </p>
        </footer>
      </div>
    </GlobalTranslationProvider>
  )
}

export default App
