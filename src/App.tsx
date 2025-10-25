import { useState } from 'react';
import { GlobalTranslationProvider } from './sdk';
import { ProductInfoSection } from './components/ProductInfoSection';
import { ShopInfoSection } from './components/ShopInfoSection';
import { ProductReviewsSection } from './components/ProductReviewsSection';
import { VoucherInfoSection } from './components/VoucherInfoSection';
import './App.css';

function App() {
  // Control panel state
  const [scenario, setScenario] = useState<string>('all-success');
  const [showProductInfo, setShowProductInfo] = useState(true);
  const [showShopInfo, setShowShopInfo] = useState(true);
  const [showReviews, setShowReviews] = useState(true);
  const [showVouchers, setShowVouchers] = useState(true);

  // Get success flags based on scenario
  const getSuccessFlags = () => {
    switch (scenario) {
      case 'all-success':
        return {
          reviews: true,
          vouchers: true,
        };
      case 'all-fail':
        return {
          reviews: false,
          vouchers: false,
        };
      case 'mixed':
        return {
          reviews: true,
          vouchers: false,
        };
      case 'only-reviews':
        return {
          reviews: true,
          vouchers: false,
        };
      case 'only-vouchers':
        return {
          reviews: false,
          vouchers: true,
        };
      default:
        return {
          reviews: true,
          vouchers: true,
        };
    }
  };

  const flags = getSuccessFlags();

  return (
    <GlobalTranslationProvider
      buttonConfig={{
        verticalSpacing: 'bottom',
        spacingValue: '20px',
      }}
      transifyConfig={{
        translateText: 'Dịch',
        seeOriginalText: 'Xem bản gốc',
        updateToastText: 'Ngôn ngữ đã cập nhật',
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
              <span className="node-desc">(wraps entire page)</span>
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
              {showShopInfo && (
                <div className="tree-branch">
                  <span className="branch-line">└─</span>
                  <div className="tree-node section-node no-anchor">
                    <span className="node-icon">📄</span>
                    <span className="node-label">Shop Info</span>
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
            </div>
          </div>
          <div className="legend">
            <div className="legend-item">
              <span className="legend-icon">⚓</span>
              <span>= Has TranslationAnchor (contributes to button visibility)</span>
            </div>
            <div className="legend-item">
              <span className="legend-icon">📄</span>
              <span>= Static content (no anchor, doesn't affect button)</span>
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
              <option value="all-success">
                ✓ All translations successful
              </option>
              <option value="all-fail">✗ All translations failed</option>
              <option value="mixed">⚡ Mixed (reviews OK, vouchers fail)</option>
              <option value="only-reviews">
                🎯 Only reviews success
              </option>
              <option value="only-vouchers">
                🎟️ Only vouchers success
              </option>
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
                  checked={showShopInfo}
                  onChange={(e) => setShowShopInfo(e.target.checked)}
                />
                <span className="checkbox-icon">📄</span> Shop Info (Static)
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
            </div>
          </div>

          <div className="info-box">
            <strong>📌 Key Rules:</strong>
            <ul>
              <li>
                Button shows when <strong>counter &gt; 0</strong> (at least one anchor with translation_status = 1)
              </li>
              <li>
                Each anchor <strong>increments counter</strong> on mount (if translation_status = 1)
              </li>
              <li>
                Each anchor <strong>decrements counter</strong> on unmount
              </li>
              <li>
                Static sections don't have anchors, so they don't affect the counter
              </li>
            </ul>
          </div>
        </div>

        <main className="content">
          {showProductInfo && <ProductInfoSection />}

          {showShopInfo && <ShopInfoSection />}

          {showReviews && (
            <ProductReviewsSection shouldSucceed={flags.reviews} />
          )}

          {showVouchers && (
            <VoucherInfoSection shouldSucceed={flags.vouchers} />
          )}
        </main>

        <footer className="app-footer">
          <p>
            💡 Try different scenarios and toggle sections to see the translation button behavior
          </p>
          <p style={{ fontSize: '12px', marginTop: '10px', color: '#999' }}>
            Product Detail Page Demo - Showcasing static and dynamic content patterns
          </p>
        </footer>
      </div>
    </GlobalTranslationProvider>
  );
}

export default App;
