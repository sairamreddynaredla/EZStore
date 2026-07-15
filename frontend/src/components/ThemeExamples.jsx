/**
 * EZ STORE - Design System Implementation Guide
 * React Component Examples using Premium Color System
 */

// ============================================
// 1. INSTALLATION & SETUP
// ============================================

/**
 * Step 1: Import CSS variables in your main app
 */
// design-tokens.css removed — using Tailwind utilities only

/**
 * Step 2: Update tailwind.config.js
 * Merge the provided tailwind.config.extended.js with your existing config
 */

/**
 * Step 3: Use colors throughout your application
 */

// ============================================
// 2. COMPONENT EXAMPLES
// ============================================

// Example 1: Premium Product Card Component
export const ProductCard = ({ product }) => {
  return (
    <div className="card-premium group">
      {/* Product Image Container */}
      <div className="relative bg-neutral-bg-light overflow-hidden rounded-lg p-4">
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 left-3 z-10 bg-amber-400 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{product.discount}%
          </div>
        )}

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-primary-600 hover:text-white transition-all">
          <HeartIcon />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col gap-2">
        {/* Brand */}
        <p className="text-xs uppercase tracking-wider text-neutral-text-secondary">
          {product.brand}
        </p>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-neutral-heading line-clamp-2">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={i < product.rating ? "text-amber-400" : "text-neutral-border"}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-neutral-text-secondary">({product.reviews})</span>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <span className="text-2xl font-bold text-primary-600">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-neutral-text-secondary line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button className="mt-4 w-full bg-amber-400 hover:bg-amber-300 text-black py-3 rounded-lg font-semibold">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

// ============================================

// Example 2: Premium CTA Button Components
export const CTAButton = ({ children, variant = "primary", ...props }) => {
  const baseStyles = "font-semibold py-3 px-6 rounded-lg transition-all duration-150";

  const variants = {
    primary: "btn-primary", // Amber
    secondary: "btn-secondary", // Green outline
    tertiary: "btn-tertiary", // Text only
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
};

// ============================================

// Example 3: Trust Section with Badges
export const TrustSection = () => {
  const trustItems = [
    { icon: "✓", title: "USDA Certified", desc: "Organic ingredients" },
    { icon: "🚚", title: "Fast Delivery", desc: "2-3 day shipping" },
    { icon: "🔒", title: "Secure", desc: "SSL encrypted" },
  ];

  return (
    <section className="bg-neutral-bg-light py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="heading-h2 text-center mb-12">Why Pet Parents Trust EZ Store</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trustItems.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-6 border border-neutral-border hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl text-primary-600 mb-3">{item.icon}</div>
              <h3 className="font-bold text-neutral-heading mb-2">{item.title}</h3>
              <p className="text-sm text-neutral-text-secondary">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================

// Example 4: Form with Validation States
export const PremiumForm = () => {
  const [formState, setFormState] = React.useState({
    email: "",
    password: "",
    errors: {},
  });

  return (
    <form className="bg-white rounded-lg p-8 shadow-md max-w-md mx-auto">
      {/* Email Field */}
      <div className="mb-6">
        <label className="form-label">Email Address</label>
        <input
          type="email"
          className="form-input"
          placeholder="you@example.com"
          value={formState.email}
          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
        />
      </div>

      {/* Password Field */}
      <div className="mb-6">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-input"
          placeholder="••••••••"
          value={formState.password}
          onChange={(e) => setFormState({ ...formState, password: e.target.value })}
        />
      </div>

      {/* Submit Button */}
      <button className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold">
        Sign In
      </button>

      {/* Secondary Link */}
      <p className="text-center mt-4 text-neutral-text-secondary">
        Don't have an account?{" "}
        <a href="#" className="text-primary-600 font-semibold hover:text-primary-700">
          Create one
        </a>
      </p>
    </form>
  );
};

// ============================================

// Example 5: Testimonial Card with Badges
export const TestimonialCard = ({ review }) => {
  return (
    <div className="card-premium">
      {/* Star Rating */}
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < review.rating ? "text-amber-400" : "text-neutral-border"}>
            ★
          </span>
        ))}
      </div>

      {/* Quote */}
      <p className="text-neutral-text italic mb-4">"{review.quote}"</p>

      {/* Author Info */}
      <div className="flex items-center gap-3 pt-4 border-t border-neutral-border">
        <img
          src={review.avatar}
          alt={review.author}
          className="w-10 h-10 rounded-full border-2 border-primary-600"
        />
        <div>
          <p className="font-semibold text-neutral-heading">{review.author}</p>
          <p className="text-xs text-neutral-text-secondary">
            {review.verified && "✓ "} Verified Purchase
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================

// Example 6: Badge System
export const BadgeShowcase = () => {
  return (
    <div className="flex flex-wrap gap-3 p-6">
      <span className="badge-success">✓ In Stock</span>
      <span className="badge-warning">Only 3 Left</span>
      <span className="badge-error">Out of Stock</span>
      <span className="badge-primary">Best Seller</span>
      <span className="badge-cta">Limited Offer</span>
    </div>
  );
};

// ============================================

// Example 7: Color Palette Reference Component
export const ColorPaletteReference = () => {
  return (
    <div className="p-8 bg-neutral-background">
      <h2 className="heading-h2 mb-8">Color System Reference</h2>

      {/* Primary Colors */}
      <section className="mb-12">
        <h3 className="heading-h3 mb-4">Primary Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { name: "Primary", hex: "#1F6B52", class: "bg-primary-600" },
            { name: "Primary Light", hex: "#E8F5F0", class: "bg-primary-100" },
            { name: "Sage", hex: "#7BAE7F", class: "bg-primary-400" },
          ].map((color) => (
            <div key={color.hex}>
              <div className={`${color.class} h-20 rounded-lg shadow-md`} />
              <p className="font-semibold text-sm mt-2">{color.name}</p>
              <p className="text-xs text-neutral-text-secondary">{color.hex}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Colors */}
      <section className="mb-12">
        <h3 className="heading-h3 mb-4">CTA / Accent Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { name: "CTA", hex: "#F59E0B", class: "bg-amber-400" },
            { name: "CTA Hover", hex: "#D97706", class: "bg-amber-600" },
            { name: "CTA Light", hex: "#FBBF24", class: "bg-amber-100" },
          ].map((color) => (
            <div key={color.hex}>
              <div className={`${color.class} h-20 rounded-lg shadow-md`} />
              <p className="font-semibold text-sm mt-2">{color.name}</p>
              <p className="text-xs text-neutral-text-secondary">{color.hex}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Semantic Colors */}
      <section className="mb-12">
        <h3 className="heading-h3 mb-4">Semantic Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Success", hex: "#16A34A", class: "bg-success-600" },
            { name: "Warning", hex: "#D97706", class: "bg-warning-600" },
            { name: "Error", hex: "#DC2626", class: "bg-error-600" },
          ].map((color) => (
            <div key={color.hex} className="flex gap-4">
              <div className={`${color.class} h-20 w-20 rounded-lg shadow-md`} />
              <div>
                <p className="font-semibold">{color.name}</p>
                <p className="text-sm text-neutral-text-secondary">{color.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// ============================================

// Example 8: Using CSS Variables Directly
export const CSSVariableExample = () => {
  return (
    <div>
      {/* Using CSS variables */}
      <div
        style={{
          backgroundColor: "var(--neutral-background)",
          color: "var(--neutral-text)",
          padding: "var(--spacing-lg)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <h3 style={{ color: "var(--neutral-heading)" }}>Using CSS Variables</h3>
        <p>This component uses CSS variables for maximum flexibility and consistency.</p>
      </div>
    </div>
  );
};

// ============================================

// Example 9: Dark Mode Support
export const DarkModeComponent = () => {
  return (
    <div className="dark">
      {/* Components automatically adjust in dark mode */}
      <div className="bg-neutral-surface text-neutral-text p-6 rounded-lg shadow-lg">
        <h2 className="text-neutral-heading font-bold mb-3">Dark Mode Support</h2>
        <p className="mb-4">
          All colors automatically adjust for dark mode using Tailwind's dark mode classes.
        </p>
        <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded">
          Learn More
        </button>
      </div>
    </div>
  );
};

// ============================================

// IMPLEMENTATION CHECKLIST:
// ============================================

/*
✅ COLOR SYSTEM IMPLEMENTATION CHECKLIST

1. CSS Variables Setup
   [ ] Copy design-tokens.css to src/styles/
   [ ] Import in your main app (App.jsx or main.jsx)
   [ ] Verify variables are accessible in DevTools

2. Tailwind Configuration
   [ ] Merge tailwind.config.extended.js with your current config
   [ ] Run: npm install -D tailwindcss @tailwindcss/forms @tailwindcss/typography
   [ ] Test Tailwind classes in your components

3. Component Updates (Priority Order)
   [ ] Navbar - Use primary-600 and colors from spec
   [ ] Hero Section - Amber CTA, green secondary
   [ ] Product Cards - White bg + primary-600 price + amber stars
   [ ] Add to Cart Button - Amber (#F59E0B)
   [ ] Forms - Green focus states
   [ ] Checkout - Progress steps, security badges
   [ ] Footer - Dark background with sage green links

4. Accessibility Testing
   [ ] Test contrast ratios with WebAIM or WAVE
   [ ] Verify focus states are visible
   [ ] Test with screen readers
   [ ] Check on mobile devices

5. Performance & Optimization
   [ ] Minify CSS variables
   [ ] Remove unused colors
   [ ] Test on different browsers
   [ ] Verify dark mode works (if implemented)

6. Quality Assurance
   [ ] Compare colors against design system
   [ ] Test all button states (hover, active, disabled)
   [ ] Verify form validation colors
   [ ] Check badge visibility
   [ ] Test testimonial card styling

7. Documentation
   [ ] Create style guide for team
   [ ] Document color usage rules
   [ ] Update component library
   [ ] Create Storybook stories (optional)

8. Conversion Optimization
   [ ] A/B test amber CTA vs alternatives
   [ ] Measure click-through rates
   [ ] Track conversion rates
   [ ] Monitor user engagement
*/

// ============================================
// NEXT STEPS
// ============================================

/*
1. IMMEDIATE ACTIONS:
   - Copy design-tokens.css and tailwind.config.extended.js
   - Update your main app to import design tokens
   - Start applying colors to high-priority components

2. COMPONENT UPDATES (In This Order):
   1. Navbar - Most visible
   2. Hero & CTA Buttons - Conversion critical
   3. Product Cards - Core e-commerce element
   4. Forms - User interaction critical
   5. Checkout Flow - Purchase critical
   6. Trust Sections - Confidence building
   7. Footer - Brand reinforcement

3. TESTING:
   - Use WebAIM Contrast Checker
   - Test on real devices
   - A/B test conversion rates
   - Monitor analytics

4. ITERATION:
   - Gather user feedback
   - Test A/B variations
   - Refine based on conversion data
   - Document best practices
*/
