# Dynamic Translation SDK Playground

A comprehensive React playground demonstrating a flexible translation SDK pattern using a **global provider + multiple anchors** architecture.

## Problem Statement

In a micro-frontend or multi-team environment, pages often contain:
- Static content (doesn't need translation)
- Multiple dynamic content sections (each controlled by separate APIs)
- Each API may succeed or fail at translation independently

The translation button should:
- Only appear when at least one section has successfully translated content
- Disappear when all translations fail or no dynamic content exists
- Allow users to toggle between translated and original text

## Solution: SDK Design

### Architecture

```
GlobalTranslationProvider (1 per app)
├── isTranslated state (global, persisted to sessionStorage)
├── Visibility counter (internal)
└── Translation button (visible when counter > 0)

TranslationAnchor (multiple, wraps dynamic content areas)
├── On mount: increment counter if translation_status = 1
├── On unmount: decrement counter
└── Children (your dynamic content)
```

### Key Principles

1. **Global Provider, Multiple Anchors**
   - One `GlobalTranslationProvider` at the app level
   - Multiple `TranslationAnchor` components wrapping dynamic sections

2. **Button Visibility Counter**
   - Each anchor with `translation_status = 1` increments the counter
   - Button appears when counter > 0
   - Business teams don't need to know about counter logic

3. **Flexible API Patterns**
   - ✅ 1 API → 1 anchor (most common)
   - ✅ 1 API → multiple anchors (for separate dynamic sections)
   - ✅ Multiple APIs → multiple anchors (nested or separate)
   - ❌ Multiple APIs → 1 combined anchor (not recommended - leaks implementation details)

4. **No Translation Combining Required**
   - Business teams pass `translation_status` directly from API
   - No need to combine multiple `translation_status` values
   - SDK handles visibility logic internally

## SDK Components

### `<GlobalTranslationProvider>`

Wrap your entire app with this provider.

```tsx
import { GlobalTranslationProvider } from './sdk';

<GlobalTranslationProvider
  buttonConfig={{
    verticalSpacing: 'bottom',
    spacingValue: '20px',
    zIndex: 12000,
  }}
  transifyConfig={{
    translateText: 'Dịch',
    seeOriginalText: 'Xem bản gốc',
    updateToastText: 'Ngôn ngữ đã cập nhật',
  }}
>
  {/* Your app */}
</GlobalTranslationProvider>
```

### `<TranslationAnchor>`

Wrap around dynamic content areas.

```tsx
import { TranslationAnchor } from './sdk';

<TranslationAnchor translation_status={apiResponse.translation_status}>
  <YourDynamicContent />
</TranslationAnchor>
```

### `useTextTr()` Hook

Use this hook to get translated or original text.

```tsx
import { useTextTr } from './sdk';

function MyComponent() {
  const getText = useTextTr();
  const data = fetchData();

  return (
    <p>{getText(data.text, data.text_tr)}</p>
  );
}
```

### `<TextTr>` Component

Alternative to the hook.

```tsx
import { TextTr } from './sdk';

<TextTr original={data.text} translation={data.text_tr} />
```

## Usage Patterns

### Pattern 1: Single API, Single Anchor (RW Team)

Most common pattern - one API serves one dynamic section.

```tsx
function ReturnRequestPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchReturnRequest().then(setData);
  }, []);

  return (
    <TranslationAnchor translation_status={data.translation_status}>
      <div>
        <h2>{getText(data.title, data.title_tr)}</h2>
        <p>{getText(data.description, data.description_tr)}</p>
      </div>
    </TranslationAnchor>
  );
}
```

### Pattern 2: Single API, Multiple Anchors (Order Team)

One API serves multiple separate sections.

```tsx
function OrderDetailsPage() {
  const [data, setData] = useState(null);

  return (
    <>
      {/* Static section - no anchor */}
      <div>Order ID: {data.order_id}</div>

      {/* Dynamic section 1 */}
      <TranslationAnchor translation_status={data.translation_status}>
        <ItemNames items={data.items} />
      </TranslationAnchor>

      {/* Dynamic section 2 */}
      <TranslationAnchor translation_status={data.translation_status}>
        <ItemVariants items={data.items} />
      </TranslationAnchor>
    </>
  );
}
```

### Pattern 3: Multiple APIs, Separate Anchors

Complex pages with multiple APIs.

```tsx
function ComplexPage() {
  const [api1Data, setApi1Data] = useState(null);
  const [api2Data, setApi2Data] = useState(null);

  return (
    <>
      {/* API 1 section */}
      <TranslationAnchor translation_status={api1Data.translation_status}>
        <Section1 data={api1Data} />
      </TranslationAnchor>

      {/* API 2 section */}
      <TranslationAnchor translation_status={api2Data.translation_status}>
        <Section2 data={api2Data} />
      </TranslationAnchor>
    </>
  );
}
```

### Pattern 4: Static Content Only (PC Team)

No anchor needed for pages without dynamic content.

```tsx
function SellerInfoPage() {
  const [data, setData] = useState(null);

  // No anchor - just static content
  return (
    <div>
      <p>Seller: {data.seller_name}</p>
      <p>Rating: {data.rating}</p>
    </div>
  );
}
```

## API Response Format

Your APIs should return:

```typescript
// Translation successful
{
  translation_status: 1,  // 1 = success
  text: "Original text",
  text_tr: "Translated text",
  item_name: "Item",
  item_name_tr: "Món hàng"
}

// Translation failed
{
  translation_status: 0,  // 0 = failed
  text: "Original text",
  item_name: "Item"
  // No _tr fields
}
```

## Running the Playground

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Playground Features

### Control Panel

- **Translation Scenarios**: Test different combinations of success/failure
  - All translations successful
  - All translations failed
  - Mixed success/failure
  - Only specific sections successful

- **Section Toggles**: Show/hide different sections to see button behavior
  - Return Request (RW Team)
  - Product Reviews (Product Team)
  - Order Details (Order Team)
  - Seller Info (PC Team - static)
  - Complex Nested Section (Multiple APIs)

### Key Observations

1. Button appears **ONLY** when at least one section has `translation_status = 1`
2. Static sections don't affect button visibility
3. Multiple anchors work independently
4. Translation state persists across page reloads (sessionStorage)
5. Nested anchors work correctly

## Benefits of This Approach

### For Business Teams

- Simple API: just pass `translation_status` from your API response
- No need to understand counter logic
- No need to combine multiple `translation_status` values
- Each team manages their own anchors independently

### For SDK Maintainers

- Clean separation of concerns
- Internal counter logic hidden from business teams
- Easy to debug (counter increment/decrement)
- Flexible enough for all use cases

### For Users

- Consistent translation experience
- Button only appears when translations are available
- State persists across navigation

## Edge Cases Handled

1. **All translations fail**: Button doesn't appear
2. **Section unmounts**: Counter decrements automatically
3. **Multiple APIs**: Each anchor counts independently
4. **Nested anchors**: Both contribute to counter
5. **No dynamic content**: Button stays hidden

## Future Enhancements

- Button draggable to avoid blocking content
- Z-index management for drawers/modals
- Animation when button appears/disappears
- Analytics integration
- A/B testing support

## License

MIT
