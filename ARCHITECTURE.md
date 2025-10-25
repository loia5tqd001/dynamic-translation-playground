# Architecture Overview

## Old Approach (Multiple Providers)

```
App
├── DynamicTranslationProvider (RW Team)
│   ├── isTranslated state
│   ├── shouldDisplayButton state
│   └── TranslationButton (visible based on shouldDisplayButton)
│       └── ReturnRequestSection
│
└── DynamicTranslationProvider (Product Team)
    ├── isTranslated state
    ├── shouldDisplayButton state
    └── TranslationButton (visible based on shouldDisplayButton)
        └── ProductReviewsSection
```

**Problems:**
- Multiple providers = multiple buttons or complex coordination
- Each team needs to manage provider lifecycle
- Button visibility logic scattered across teams
- isTranslated state not shared between providers
- Hard to coordinate button visibility across micro-apps

## New Approach (Global Provider + Anchors)

```
App
└── GlobalTranslationProvider (SDK - maintained by you)
    ├── isTranslated state (global, sessionStorage)
    ├── visibilityCounter state (internal)
    └── TranslationButton (visible when counter > 0)

    Children:
    ├── ReturnRequestSection (RW Team)
    │   └── TranslationAnchor (translation_status=1)
    │       └── Dynamic content
    │       [On mount: counter++, On unmount: counter--]
    │
    ├── ProductReviewsSection (Product Team)
    │   └── TranslationAnchor (translation_status=1)
    │       └── Dynamic content
    │       [On mount: counter++, On unmount: counter--]
    │
    ├── OrderDetailsSection (Order Team)
    │   ├── TranslationAnchor (translation_status=1)
    │   │   └── Item names
    │   │   [On mount: counter++, On unmount: counter--]
    │   └── TranslationAnchor (translation_status=1)
    │       └── Item variants
    │       [On mount: counter++, On unmount: counter--]
    │
    └── SellerInfoSection (PC Team)
        └── Static content (no anchor)
        [No effect on counter]
```

**Benefits:**
- Single source of truth for isTranslated state
- Button visibility automatically managed by internal counter
- Business teams just wrap their dynamic content with anchors
- No need to understand counter logic
- Works seamlessly across micro-apps

## Counter Logic Flow

### Scenario 1: All Translations Succeed

```
Initial State:
  counter = 0, button hidden

ReturnRequestSection mounts:
  API returns translation_status = 1
  → TranslationAnchor increments counter
  → counter = 1, button visible ✓

ProductReviewsSection mounts:
  API returns translation_status = 1
  → TranslationAnchor increments counter
  → counter = 2, button visible ✓

OrderDetailsSection mounts (2 anchors):
  Both APIs return translation_status = 1
  → Both anchors increment counter
  → counter = 4, button visible ✓
```

### Scenario 2: All Translations Fail

```
Initial State:
  counter = 0, button hidden

ReturnRequestSection mounts:
  API returns translation_status = 0
  → TranslationAnchor does NOT increment
  → counter = 0, button hidden ✗

ProductReviewsSection mounts:
  API returns translation_status = 0
  → TranslationAnchor does NOT increment
  → counter = 0, button hidden ✗

Result: Button stays hidden ✓
```

### Scenario 3: Mixed Success/Failure

```
Initial State:
  counter = 0, button hidden

ReturnRequestSection mounts:
  API returns translation_status = 1
  → counter = 1, button visible ✓

ProductReviewsSection mounts:
  API returns translation_status = 0
  → counter = 1, button still visible ✓

OrderDetailsSection unmounts:
  Both anchors decrement
  → counter = 0, button hidden ✗
```

## State Management

### isTranslated State
- **Scope**: Global across entire app
- **Persistence**: sessionStorage
- **Initial value**: true
- **Purpose**: Control whether to show translated or original text
- **Shared**: Yes, across all micro-apps

### visibilityCounter State
- **Scope**: Internal to GlobalTranslationProvider
- **Persistence**: None (in-memory only)
- **Initial value**: 0
- **Purpose**: Track how many dynamic sections are mounted
- **Shared**: Yes, but hidden from business teams

## Integration Guide for Business Teams

### Step 1: Import SDK
```tsx
import { TranslationAnchor, useTextTr } from 'translation-sdk';
```

### Step 2: Wrap Dynamic Content
```tsx
function YourSection() {
  const [data, setData] = useState(null);
  const getText = useTextTr();

  useEffect(() => {
    fetchData().then(setData);
  }, []);

  return (
    <TranslationAnchor translation_status={data?.translation_status}>
      <div>
        <h2>{getText(data.title, data.title_tr)}</h2>
        <p>{getText(data.description, data.description_tr)}</p>
      </div>
    </TranslationAnchor>
  );
}
```

### Step 3: That's It!
No need to:
- Manage providers
- Track button visibility
- Combine translation_status from multiple APIs
- Understand counter logic

## Migration Path

### Before (Old Code)
```tsx
<DynamicTranslationProvider
  initialShouldDisplayButton={true}
  initialShouldBeTranslated={false}
>
  <YourSection />
</DynamicTranslationProvider>
```

### After (New Code)
```tsx
// At app root (one time):
<GlobalTranslationProvider>
  <App />
</GlobalTranslationProvider>

// In your section:
<TranslationAnchor translation_status={data.translation_status}>
  <YourSection />
</TranslationAnchor>
```

## File Structure

```
src/
├── sdk/                              # SDK maintained by platform team
│   ├── types.ts                      # TypeScript types
│   ├── ClientOnlyPortal.tsx          # Portal utility
│   ├── Toast.tsx                     # Toast notification
│   ├── TranslationButton.tsx         # Button component
│   ├── GlobalTranslationProvider.tsx # Main provider
│   ├── TranslationAnchor.tsx         # Anchor component
│   └── index.ts                      # Public API
│
├── components/                       # Business team sections
│   ├── ReturnRequestSection.tsx      # RW team
│   ├── ProductReviewsSection.tsx     # Product team
│   ├── OrderDetailsSection.tsx       # Order team
│   ├── SellerInfoSection.tsx         # PC team (static)
│   └── ComplexNestedSection.tsx      # Complex example
│
└── mockApi/                          # Mock API utilities
    ├── types.ts
    └── index.ts
```

## Decision Log

### Why Global Provider Instead of Multiple Providers?
- Single source of truth for translation state
- Prevents multiple buttons from appearing
- Easier to manage state across micro-apps
- Better user experience

### Why Counter Instead of Boolean?
- Supports multiple dynamic sections
- Automatically handles mount/unmount
- No manual coordination needed
- Works with lazy-loaded sections

### Why Anchors Instead of Hooks?
- Clear component boundary for dynamic content
- Automatic lifecycle management
- Easier to visualize in React DevTools
- Less error-prone than manual hook calls

### Why translation_status Instead of Boolean?
- Matches API response format (0 or 1)
- Clear semantic meaning from backend
- No conversion needed by business teams
- Consistent with existing API contracts

## Testing Scenarios

Run the playground and test:

1. **All sections visible, all translations succeed**
   - Expected: Button visible, can toggle

2. **All sections visible, all translations fail**
   - Expected: Button hidden

3. **Mixed success/failure**
   - Expected: Button visible (at least one success)

4. **Toggle sections on/off**
   - Expected: Button visibility updates accordingly

5. **Only static section visible**
   - Expected: Button hidden

6. **Reload page**
   - Expected: Translation state persists (sessionStorage)

7. **Nested anchors**
   - Expected: Each contributes to counter independently
