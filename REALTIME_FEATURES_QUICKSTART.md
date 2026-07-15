# Quick Start Guide - Real-Time Features

## Overview
EZStore now has real-time product pricing and intelligent product recommendations!

---

## Features Added

### 1. Real-Time Product Prices 💰
Products now show live prices across all sections:
- **Product Cards** - Updates instantly when price changes
- **Product Details** - Real-time price display
- **Brand Related Section** - Live brand product prices
- **Similar Products** - Real-time pricing for suggestions
- **Recommendations** - Live prices for recommended items

**Visual Indicator:** Prices pulse (animate) briefly when updated

### 2. Smart Recommendations 🎯
"Frequently Bought Together" section now:
- Shows real products from your database (not static samples)
- Recommends products from same category or brand
- Only shows in-stock items
- Updates in real-time when stock changes
- Shows "Live" badge when connected to real-time updates

---

## How to Test

### Test Real-Time Prices

**Step 1:** Open Product Page
```
1. Go to frontend (http://localhost:5173)
2. Click on any product
3. Note the current price
```

**Step 2:** Update Price from Admin
```
1. Go to admin panel (http://localhost:3000)
2. Navigate to Products
3. Edit the product from Step 1
4. Change the price
5. Save changes
```

**Step 3:** See Live Update
```
1. Go back to the frontend product page (don't refresh!)
2. You should see the price update automatically
3. Notice the pulse animation on the price
```

### Test Recommendations

**Step 1:** View Product Details
```
1. Go to frontend
2. Click on any product
3. Scroll down to "Frequently Bought Together" section
4. You should see real recommended products
```

**Step 2:** Check Live Badge
```
1. Look for the green "Live" badge next to section title
2. This indicates real-time connection is active
```

**Step 3:** Test Real-Time Updates
```
1. Admin: Update stock of a recommended product to 0 (out of stock)
2. Frontend: The product should disappear from recommendations
3. Admin: Restore stock to > 0
4. Frontend: Product reappears in recommendations
```

---

## Technical Details for Developers

### Socket Events

#### Price Update Event
```javascript
// Backend emits when price changes:
socket.emit(`product:priceUpdate:${productId}`, {
  productId: number,
  price: number,
  originalPrice: number,
  stock: number,
  updatedAt: date
})
```

#### Recommendation Update Event
```javascript
// Backend emits when recommendations change:
socket.emit(`product:recommendations:${productId}`, recommendationsArray)
```

### Hooks Usage

#### Using Real-Time Prices
```javascript
import { useRealtimeProductPrice } from "../hooks/useRealtimeProductPrice";

function MyComponent({ productId, currentPrice }) {
  const { price, originalPrice, isUpdating } = useRealtimeProductPrice(
    productId,
    { price: currentPrice, originalPrice: currentPrice }
  );

  return (
    <div className={isUpdating ? "animate-pulse" : ""}>
      ₹{price.toFixed(2)}
    </div>
  );
}
```

#### Using Recommendations
```javascript
import { useRecommendedProducts } from "../hooks/useRecommendedProducts";

function Recommendations({ productId }) {
  const { data, loading, error, isLive } = useRecommendedProducts(productId, 5);

  if (loading) return <LoadingState />;
  if (error) return null;

  return (
    <div>
      {isLive && <span className="live-badge">Live</span>}
      {data.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### API Endpoint

```
GET /api/products/:productId/recommended?limit=5

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "price": 100,
      "stock": 5,
      "category": "Category Name",
      "imageUrl": "...",
      ...
    }
  ]
}
```

---

## Troubleshooting

### Socket Connection Not Working
```
❌ Problem: Real-time prices not updating
✅ Solution:
  1. Check browser console for connection errors
  2. Verify backend socket.io is running
  3. Check CORS settings allow socket connections
  4. Ensure firewall isn't blocking socket port
```

### Recommendations Not Showing
```
❌ Problem: "Frequently bought together" section empty
✅ Solution:
  1. Check if product has related items in same category/brand
  2. Verify related products have stock > 0
  3. Check API endpoint: GET /api/products/:id/recommended
  4. Verify product ID in URL is correct
```

### Prices Not Updating
```
❌ Problem: Price changes in admin don't reflect on frontend
✅ Solution:
  1. Ensure socket connection is established (check browser console)
  2. Verify admin is updating the correct product
  3. Check network tab for socket events
  4. Try refreshing browser
```

---

## Files Changed

### New Files
- `frontend/src/services/socket.js` - Socket client
- `frontend/src/hooks/useSocket.jsx` - Socket hook
- `frontend/src/hooks/useRealtimeProductPrice.jsx` - Price hook
- `frontend/src/hooks/useRecommendedProducts.jsx` - Recommendations hook

### Modified Files
- `backend/src/services/shared/productService.js` - Added recommendations
- `backend/src/routes/user/products.js` - Added recommendations endpoint
- `backend/src/routes/admin/crud.js` - Added socket broadcasting
- `frontend/src/components/products/ProductCard.jsx` - Real-time prices
- `frontend/src/components/ProductRecommendations.jsx` - Real-time recommendations
- `frontend/src/components/BrandRelatedProducts.jsx` - Real-time prices

---

## What's Next

These real-time features enable:
- ✅ Dynamic pricing strategies
- ✅ Live inventory management
- ✅ Personalized recommendations
- ✅ Increased average order value through smart suggestions
- ✅ Better user engagement with live updates

Future enhancements could include:
- ML-based recommendations
- Price prediction alerts
- Personalized recommendations per user
- A/B testing for recommendation placement
- Analytics tracking

---

**Documentation Created:** July 13, 2026
**Status:** Ready for Testing & Deployment
