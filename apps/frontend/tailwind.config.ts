import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        // 🎨 Bộ mã màu thương hiệu chuẩn One Connect Logo
        brand: {
          DEFAULT: '#0066FF',
          blue: {
            DEFAULT: '#0066FF', // Primary Blue
            primary: '#0066FF',
            cyan: '#00C2FF',    // Cyan Accent Blue
          },
          cyan: '#00C2FF',
          orange: {
            DEFAULT: '#FF6B00', // Electric Orange (Accent)
            electric: '#FF6B00',
            amber: '#FF9900',    // Amber Highlight
          },
          amber: '#FF9900',
          dark: '#0A0E17',     // Deep Tech Navy Background
          card: '#141C2E',     // Card Surface
          border: '#23314D',   // Border Color
        },

        // 🚀 Flat Utility Aliases cho class ngắn gọn (vd: bg-brand-blue, text-brand-orange)
        'brand-blue': {
          DEFAULT: '#0066FF',
          primary: '#0066FF',
          cyan: '#00C2FF',
        },
        'brand-cyan': '#00C2FF',
        'brand-orange': {
          DEFAULT: '#FF6B00',
          electric: '#FF6B00',
          amber: '#FF9900',
        },
        'brand-amber': '#FF9900',
        'brand-dark': '#0A0E17',
        'brand-card': '#141C2E',
        'brand-border': '#23314D',

        navy: {
          950: '#07090E',
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
        },
        tech: {
          blue: '#0066FF',
          cyan: '#00C2FF',
          orange: '#FF6B00',
          amber: '#FF9900',
          emerald: '#059669',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0066FF 0%, #00C2FF 40%, #FF6B00 80%, #FF9900 100%)',
        'brand-gradient-infinity': 'linear-gradient(90deg, #0066FF 0%, #00C2FF 35%, #FF6B00 70%, #FF9900 100%)',
        'brand-gradient-blue': 'linear-gradient(135deg, #0066FF 0%, #00C2FF 100%)',
        'brand-gradient-orange': 'linear-gradient(135deg, #FF6B00 0%, #FF9900 100%)',
        'brand-gradient-dark': 'linear-gradient(180deg, #0A0E17 0%, #141C2E 100%)',
      },
      boxShadow: {
        'glow-blue': '0 0 25px rgba(0, 102, 255, 0.4)',
        'glow-cyan': '0 0 25px rgba(0, 194, 255, 0.4)',
        'glow-orange': '0 0 25px rgba(255, 107, 0, 0.4)',
        'glow-infinity': '0 0 30px rgba(0, 102, 255, 0.3), 0 0 30px rgba(255, 107, 0, 0.3)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        gradientShift: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-glow': 'pulseGlow 3s infinite ease-in-out',
        'gradient-shift': 'gradientShift 6s ease infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;

