import { Drawer } from './Drawer'

/**
 * Product Specifications Drawer (Product Team)
 * Pattern: Static content only in drawer
 * Demonstrates that a drawer with NO TranslationAnchor doesn't trigger the translation button
 * Even when there's dynamic content visible on the background page
 */
export const ProductSpecsDrawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  // Static product specifications - no API call needed
  const specs = {
    dimensions: {
      width: '7.5 cm',
      height: '15.2 cm',
      depth: '0.8 cm',
      weight: '180g',
    },
    technical: {
      processor: 'Octa-core 2.8 GHz',
      ram: '8 GB',
      storage: '256 GB',
      battery: '4500 mAh',
      screen: '6.1-inch OLED',
      camera: '48 MP + 12 MP + 8 MP',
    },
    materials: {
      frame: 'Aluminum alloy',
      back: 'Gorilla Glass Victus',
      screen: 'Gorilla Glass Victus with oleophobic coating',
    },
    certifications: [
      'IP68 water & dust resistance',
      'MIL-STD-810H military grade',
      'USB Type-C 3.2',
      'Wireless charging 15W',
      'Fast charging 45W',
    ],
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="📋 Product Specifications">
      {/* Static badge */}
      <div
        className="status-badge"
        style={{
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <span
          className="status-static"
          style={{
            fontSize: '13px',
            padding: '6px 12px',
          }}
        >
          ⚪ Static Content (No Translation)
        </span>
      </div>

      {/* NO TranslationAnchor - this is purely static content */}
      <div className="content-card">
        {/* Dimensions */}
        <div style={{ marginBottom: '24px' }}>
          <h3
            style={{
              fontSize: '16px',
              marginBottom: '12px',
              color: '#1f2937',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '8px',
            }}
          >
            📏 Dimensions
          </h3>
          <div style={{ paddingLeft: '12px' }}>
            <p style={{ marginBottom: '8px' }}>
              <strong>Width:</strong> {specs.dimensions.width}
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Height:</strong> {specs.dimensions.height}
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Depth:</strong> {specs.dimensions.depth}
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Weight:</strong> {specs.dimensions.weight}
            </p>
          </div>
        </div>

        {/* Technical Specifications */}
        <div style={{ marginBottom: '24px' }}>
          <h3
            style={{
              fontSize: '16px',
              marginBottom: '12px',
              color: '#1f2937',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '8px',
            }}
          >
            ⚙️ Technical Specifications
          </h3>
          <div style={{ paddingLeft: '12px' }}>
            <p style={{ marginBottom: '8px' }}>
              <strong>Processor:</strong> {specs.technical.processor}
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>RAM:</strong> {specs.technical.ram}
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Storage:</strong> {specs.technical.storage}
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Battery:</strong> {specs.technical.battery}
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Screen:</strong> {specs.technical.screen}
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Camera:</strong> {specs.technical.camera}
            </p>
          </div>
        </div>

        {/* Materials */}
        <div style={{ marginBottom: '24px' }}>
          <h3
            style={{
              fontSize: '16px',
              marginBottom: '12px',
              color: '#1f2937',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '8px',
            }}
          >
            🎨 Materials
          </h3>
          <div style={{ paddingLeft: '12px' }}>
            <p style={{ marginBottom: '8px' }}>
              <strong>Frame:</strong> {specs.materials.frame}
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Back:</strong> {specs.materials.back}
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Screen Protection:</strong> {specs.materials.screen}
            </p>
          </div>
        </div>

        {/* Certifications */}
        <div style={{ marginBottom: '24px' }}>
          <h3
            style={{
              fontSize: '16px',
              marginBottom: '12px',
              color: '#1f2937',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '8px',
            }}
          >
            ✓ Certifications & Features
          </h3>
          <ul style={{ paddingLeft: '28px', margin: 0 }}>
            {specs.certifications.map((cert, index) => (
              <li
                key={index}
                style={{ marginBottom: '8px', lineHeight: '1.6' }}
              >
                {cert}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className="team-note"
        style={{
          marginTop: '20px',
          background: '#fef3c7',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '13px',
          lineHeight: '1.6',
        }}
      >
        <div style={{ marginBottom: '8px' }}>
          💡 <strong>Static Drawer Pattern:</strong>
        </div>
        <div style={{ fontSize: '12px', color: '#78350f' }}>
          • This drawer contains NO TranslationAnchor
          <br />• Technical specs don't need translation (universal values)
          <br />• Translation button won't show for this drawer
          <br />• Even if background page has dynamic content visible
          <br />• Drawer z-index (9500) is below translation button (10000)
        </div>
      </div>
    </Drawer>
  )
}
