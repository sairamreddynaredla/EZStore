/**
 * EZ STORE - Premium Pet Food E-Commerce
 * Tailwind CSS Color Configuration
 * Enterprise Design System Implementation
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        /* PRIMARY BRAND COLOR - Deep Emerald Green */
        primary: {
          50: '#F0F9F6',    // Pale
          100: '#E8F5F0',   // Light
          200: '#D1EBE1',   // Medium-light
          300: '#B3D9CD',   // Medium
          400: '#7BAE7F',   // Secondary Sage
          500: '#6BA074',   // Mid-tone
          600: '#1F6B52',   // Primary (main)
          700: '#1A5844',   // Dark
          800: '#0F3A2C',   // Darker
          900: '#08251D',   // Very dark
        },

        /* ACCENT/CTA COLOR - Premium Amber */
        amber: {
          50: '#FEF3C7',
          100: '#FBBF24',
          200: '#FAC858',
          300: '#F8B840',
          400: '#F59E0B',   // Primary CTA
          500: '#F48806',
          600: '#D97706',   // Hover
          700: '#B45309',   // Active
          800: '#92400E',
          900: '#78350F',
        },

        /* SEMANTIC COLORS */
        success: {
          50: '#DCFCE7',
          100: '#BBEF63',
          200: '#86EFAC',
          300: '#6EE7B7',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',   // Main
          700: '#15803D',
          800: '#166534',
          900: '#145231',
        },

        warning: {
          50: '#FEF3C7',
          100: '#FDBF5B',
          200: '#FCBF49',
          300: '#F59E0B',   // Can overlap with CTA
          400: '#F59E0B',
          500: '#E67E22',
          600: '#D97706',   // Main
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },

        error: {
          50: '#FEE2E2',
          100: '#FECACA',
          200: '#FCA5A5',
          300: '#F87171',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',   // Main
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },

        /* NEUTRAL COLORS - Grays */
        neutral: {
          // Backgrounds
          background: '#FAF9F6',  // Soft ivory
          'bg-light': '#F0F9F6',  // Very light
          'bg-hover': '#F5F5F5',  // Hover alternative
          
          // Surfaces
          surface: '#FFFFFF',     // Pure white
          'surface-secondary': '#F0F9F6',
          
          // Text
          heading: '#1A1A1A',     // Rich charcoal
          text: '#4B5563',        // Slate gray
          'text-secondary': '#6B7280',  // Medium gray
          'text-light': '#A0AEC0',      // Light gray
          
          // Structure
          border: '#E5E7EB',      // Light gray borders
          'border-dark': '#3F4B57', // Dark mode borders
          divider: '#D1D5DB',
        },

        /* EXTENDED GRAY PALETTE */
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#1A1A1A',
        },

        /* SEMANTIC USAGE */
        'text-heading': '#1A1A1A',
        'text-body': '#4B5563',
        'text-secondary': '#6B7280',
        'bg-page': '#FAF9F6',
        'bg-card': '#FFFFFF',
        'border-line': '#E5E7EB',
      },

      /* SHADOW SYSTEM - Green-tinted for luxury */
      boxShadow: {
        xs: '0 1px 2px rgba(31, 107, 82, 0.03)',
        sm: '0 2px 4px rgba(31, 107, 82, 0.05)',
        md: '0 4px 12px rgba(31, 107, 82, 0.08)',
        lg: '0 12px 28px rgba(31, 107, 82, 0.12)',
        xl: '0 20px 40px rgba(31, 107, 82, 0.15)',
        '2xl': '0 25px 50px rgba(31, 107, 82, 0.2)',
        
        /* Focus ring shadows */
        'focus-ring': '0 0 0 3px rgba(31, 107, 82, 0.1)',
      },

      /* GRADIENTS */
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1F6B52 0%, #7BAE7F 100%)',
        'gradient-cta': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        'gradient-subtle': 'linear-gradient(180deg, #FFFFFF 0%, #F0F9F6 100%)',
        'gradient-premium': 'linear-gradient(to bottom right, #FFFFFF, #F0F9F6)',
      },

      /* BORDER RADIUS */
      borderRadius: {
        xs: '0.375rem',    // 6px
        sm: '0.5rem',      // 8px
        md: '0.75rem',     // 12px
        lg: '1rem',        // 16px
        xl: '1.5rem',      // 24px
        '2xl': '2rem',     // 32px
        full: '9999px',
      },

      /* TRANSITIONS */
      transitionDuration: {
        'fast': '150ms',
        'base': '300ms',
        'slow': '500ms',
      },

      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-in': 'ease-in',
        'ease-out': 'ease-out',
      },

      /* SPACING (8px base) */
      spacing: {
        'xs': '0.5rem',   // 4px
        'sm': '0.75rem',  // 6px
        'md': '1rem',     // 8px
        'lg': '1.5rem',   // 12px
        'xl': '2rem',     // 16px
        '2xl': '3rem',    // 24px
        '3xl': '4rem',    // 32px
      },

      /* TYPOGRAPHY */
      fontSize: {
        'xs': ['0.75rem', '1rem'],
        'sm': ['0.875rem', '1.25rem'],
        'base': ['1rem', '1.5rem'],
        'lg': ['1.125rem', '1.75rem'],
        'xl': ['1.25rem', '1.75rem'],
        '2xl': ['1.5rem', '2rem'],
        '3xl': ['1.875rem', '2.25rem'],
        '4xl': ['2.25rem', '2.5rem'],
        '5xl': ['3rem', '1'],
      },

      fontWeight: {
        'thin': '100',
        'extralight': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },

      /* FOCUS OUTLINE */
      outline: {
        'primary': '2px solid #1F6B52',
        'cta': '2px solid #F59E0B',
        'error': '2px solid #DC2626',
      },

      /* RING COLORS (for focus states) */
      ringColor: {
        'primary': 'rgba(31, 107, 82, 0.5)',
        'cta': 'rgba(245, 158, 11, 0.5)',
        'error': 'rgba(220, 38, 38, 0.5)',
      },

      /* OPACITY */
      opacity: {
        '0': '0',
        '5': '0.05',
        '10': '0.1',
        '20': '0.2',
        '25': '0.25',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '75': '0.75',
        '80': '0.8',
        '90': '0.9',
        '95': '0.95',
        '100': '1',
      },
    },
  },

  /* PLUGINS FOR CUSTOM UTILITIES */
  plugins: [
    require('@tailwindcss/forms'),  // Better form styling
    require('@tailwindcss/typography'),  // Prose styling

    /* Custom plugin for premium component styles */
    ({ addComponents, theme }) => {
      addComponents({
        /* PREMIUM CARD */
        '.card-premium': {
          '@apply bg-white border border-[#E5E7EB] rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:border-[#1F6B52]': {},
        },

        /* PRIMARY CTA BUTTON */
        '.btn-primary': {
          '@apply bg-[#F59E0B] hover:bg-[#D97706] active:bg-[#B45309] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-150 shadow-md hover:shadow-lg': {},
          '&:focus': {
            '@apply outline-none ring-2 ring-offset-2 ring-[#1F6B52]': {},
          },
        },

        /* SECONDARY BUTTON */
        '.btn-secondary': {
          '@apply border-2 border-[#1F6B52] text-[#1F6B52] bg-transparent hover:bg-[#E8F5F0] font-semibold py-3 px-6 rounded-lg transition-all duration-150': {},
        },

        /* TERTIARY BUTTON */
        '.btn-tertiary': {
          '@apply text-[#1F6B52] hover:text-[#1A5844] font-semibold transition-all duration-150': {},
        },

        /* TEXT HEADING */
        '.heading-h1': {
          '@apply text-4xl font-bold text-[#1A1A1A]': {},
        },
        '.heading-h2': {
          '@apply text-3xl font-semibold text-[#1A1A1A]': {},
        },
        '.heading-h3': {
          '@apply text-2xl font-semibold text-[#1A1A1A]': {},
        },

        /* BODY TEXT */
        '.text-body': {
          '@apply text-base text-[#4B5563] leading-relaxed': {},
        },
        '.text-secondary': {
          '@apply text-sm text-[#6B7280]': {},
        },

        /* BADGE STYLES */
        '.badge-success': {
          '@apply inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-[#DCFCE7] text-[#166534]': {},
        },
        '.badge-warning': {
          '@apply inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-[#FEF3C7] text-[#92400E]': {},
        },
        '.badge-error': {
          '@apply inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-[#FEE2E2] text-[#7F1D1D]': {},
        },
        '.badge-primary': {
          '@apply inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-[#1F6B52] text-white': {},
        },
        '.badge-cta': {
          '@apply inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-[#F59E0B] text-white': {},
        },

        /* FORM ELEMENTS */
        '.form-input': {
          '@apply w-full px-4 py-3 border border-[#E5E7EB] rounded-lg bg-white text-[#1A1A1A] placeholder-[#6B7280] focus:outline-none focus:border-[#1F6B52] focus:ring-2 focus:ring-offset-2 focus:ring-[#E8F5F0] transition-all duration-150': {},
        },
        '.form-label': {
          '@apply block text-sm font-semibold text-[#1A1A1A] mb-2': {},
        },

        /* TRUST SECTION */
        '.trust-badge': {
          '@apply flex items-center gap-3 p-4 bg-[#E8F5F0] border border-[#D1EBE1] rounded-lg': {},
        },
        '.trust-badge-icon': {
          '@apply text-[#1F6B52] text-2xl': {},
        },
        '.trust-badge-text': {
          '@apply text-[#4B5563]': {},
        },

        /* LOADING STATE */
        '.skeleton-card': {
          '@apply bg-white rounded-lg p-4 space-y-3': {},
        },
        '.skeleton-text': {
          '@apply h-4 bg-gradient-to-r from-[#E5E7EB] to-[#D1D5DB] rounded animate-pulse': {},
        },

        /* EMPTY STATE */
        '.empty-state': {
          '@apply flex flex-col items-center justify-center py-12 px-4 text-center': {},
        },
        '.empty-state-icon': {
          '@apply text-5xl text-[#1F6B52] mb-4': {},
        },
        '.empty-state-title': {
          '@apply text-xl font-bold text-[#1A1A1A] mb-2': {},
        },
        '.empty-state-text': {
          '@apply text-[#4B5563] mb-6': {},
        },
      });
    },
  ],

  /* DARK MODE CONFIGURATION */
  darkMode: 'class',

  /* CONTENT CONFIGURATION */
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
};
