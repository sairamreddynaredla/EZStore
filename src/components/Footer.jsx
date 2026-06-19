import { Link } from "react-router-dom";
import ezstoreLogo from "../assets/logo/ezstore-logo-optimized.webp";
import { brands } from "../data/brands";

const socialLinks = [
  {
    href: "https://facebook.com",
    icon: "https://img.icons8.com/ios-filled/50/1877F2/facebook-new.png",
    label: "Facebook",
  },
  {
    href: "https://twitter.com",
    icon: "https://img.icons8.com/ios-filled/50/1DA1F2/twitter.png",
    label: "Twitter",
  },
  {
    href: "https://instagram.com",
    icon: "https://img.icons8.com/ios-filled/50/E1306C/instagram-new.png",
    label: "Instagram",
  },
  {
    href: "https://youtube.com",
    icon: "https://img.icons8.com/ios-filled/50/FF0000/youtube-play.png",
    label: "YouTube",
  },
];

const getFooterLinks = () => {
  return {
    Pets: [
      { label: "Dogs", to: "/category/dog-food" },
      { label: "Cats", to: "/category/cat-food" },
      { label: "Birds", to: "/category/bird-food" },
      { label: "Fish", to: "/category/fish-food" },
      { label: "Rabbits", to: "/category/rabbit-food" },
      { label: "Hamsters", to: "/category/hamster-food" },
    ],
    "About EZStore": [
      { label: "Our Story", to: "#" },
      { label: "Careers", to: "#" },
      { label: "News & Updates", to: "#" },
      { label: "Store Locations", to: "#" },
      { label: "EZStore Promise", to: "#" },
    ],
    "Popular Brands": brands.slice(0, 6).map((brand) => ({
      label: brand.name,
      to: `/brands/${brand.slug}`,
    })),
    "Help & Support": [
      { label: "Help Center", to: "#" },
      { label: "Returns & Refunds", to: "#" },
      { label: "Track Your Order", to: "#" },
      { label: "Contact Support", to: "#" },
      { label: "Feedback", to: "#" },
    ],
  };
};

const trustBadges = [
  { icon: "🚚", title: "Free Delivery", subtitle: "On orders above $499" },
  { icon: "🔄", title: "Easy Returns", subtitle: "30-day return policy" },
  { icon: "🔒", title: "Secure Payments", subtitle: "100% safe & encrypted" },
  { icon: "🏆", title: "Trusted Brands", subtitle: "100+ premium brands" },
];

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const footerLinks = getFooterLinks();

  return (
    <footer style={{ background: "var(--footer-bg)", color: "var(--footer-text)" }}>
      {/* ── Trust Badges Bar ── */}
      <div
        className="border-b"
        style={{
          borderColor: "var(--footer-border)",
          background: "var(--footer-dark-bg)",
        }}
      >
        <div className="max-w-360 mx-auto px-6 md:px-10 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((badge) => (
              <div key={badge.title} className="flex items-center gap-3">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p
                    className="text-sm font-bold leading-tight"
                    style={{ color: "var(--footer-text)" }}
                  >
                    {badge.title}
                  </p>
                  <p
                    className="text-xs leading-tight opacity-75"
                    style={{ color: "var(--footer-text)" }}
                  >
                    {badge.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="max-w-360 mx-auto px-6 md:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10 lg:gap-14">
          {/* Brand Column */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div>
              <img src={ezstoreLogo} alt="EZStore" className="h-12 mb-4" loading="lazy" />
              <p
                className="text-sm leading-relaxed opacity-80"
                style={{ color: "var(--footer-text)" }}
              >
                Redefining pet shopping with premium food, accessories, and trusted brands —
                designed to improve your pet's life every day.
              </p>
            </div>

            {/* Social Icons */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3 opacity-60"
                style={{ color: "var(--footer-text)" }}
              >
                Follow Us
              </p>
              <div className="flex gap-3 sm:gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="h-11 w-11 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm hover:shadow-md"
                    style={{ background: "var(--footer-link)" }}
                  >
                    <img
                      src={link.icon}
                      alt={link.label}
                      className="h-5 w-5 sm:h-4 sm:w-4"
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Payments */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-4 opacity-60"
                style={{ color: "var(--footer-text)" }}
              >
                Accepted Payments
              </p>
              <div className="flex items-center gap-3 sm:gap-2 flex-wrap">
                {[
                  {
                    src: "https://img.icons8.com/color/48/stripe.png",
                    alt: "Stripe",
                  },
                  {
                    src: "https://img.icons8.com/color/48/visa.png",
                    alt: "Visa",
                  },
                  {
                    src: "https://img.icons8.com/color/48/mastercard-logo.png",
                    alt: "MasterCard",
                  },
                  {
                    src: "https://img.icons8.com/color/48/google-pay-india.png",
                    alt: "Google Pay",
                  },
                  {
                    src: "https://img.icons8.com/ios-filled/50/mac-os.png",
                    alt: "Apple Pay",
                  },
                ].map((p) => (
                  <div
                    key={p.alt}
                    className="h-9 w-14 sm:h-8 sm:w-12 bg-white rounded-md flex items-center justify-center shadow-sm p-1 hover:shadow-md transition-shadow"
                  >
                    <img
                      src={p.src}
                      alt={p.alt}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="flex flex-col gap-4">
              <h4
                className="text-sm font-bold uppercase tracking-widest"
                style={{ color: "var(--footer-text)" }}
              >
                {heading}
              </h4>
              <div
                className="w-8 h-0.5 rounded-full"
                style={{ background: "var(--footer-link)" }}
              />
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      onClick={scrollToTop}
                      className="text-sm transition-all hover:translate-x-1 inline-block"
                      style={{ color: "var(--footer-text)", opacity: 0.75 }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = 1;
                        e.currentTarget.style.color = "var(--footer-link)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = 0.75;
                        e.currentTarget.style.color = "var(--footer-text)";
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div
        className="border-t"
        style={{
          background: "var(--footer-dark-bg)",
          borderColor: "var(--footer-border)",
        }}
      >
        <div className="max-w-360 mx-auto px-6 md:px-10 py-5">
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
            style={{ color: "var(--footer-text)" }}
          >
            <span className="opacity-75">
              © {new Date().getFullYear()} EZStore. All rights reserved.
            </span>

            <span className="opacity-75 text-center">
              Designed & Developed by{" "}
              <a
                href="https://www.virtutechsolutions.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
                style={{ color: "var(--footer-link)" }}
              >
                Virtu Tech Solutions
              </a>
            </span>

            <div className="flex items-center gap-5">
              {["Terms of Service", "Privacy Policy", "Cookie Policy"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="opacity-75 hover:opacity-100 hover:underline transition-opacity"
                  style={{ color: "var(--footer-text)" }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Back to Top ── */}
      <div
        onClick={scrollToTop}
        className="w-full py-3 text-center text-xs font-bold uppercase tracking-widest cursor-pointer transition-opacity hover:opacity-80 select-none"
        style={{ background: "var(--footer-link)", color: "#fff" }}
      >
        ↑ Back to Top
      </div>
    </footer>
  );
};

export default Footer;
