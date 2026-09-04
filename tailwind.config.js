/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060912',
          900: '#080d1c',
          850: '#0b1228',
          800: '#101a3a',
          700: '#162149',
          600: '#1e2b58',
        },
        blush: {
          50: '#fff5f7',
          100: '#ffe8ee',
          200: '#ffd1dc',
          300: '#ffb3c6',
          400: '#ff8fa8',
          500: '#f76a8c',
          600: '#e54e74',
          700: '#bf3a5c',
          800: '#8f2a44',
          900: '#6b1f33',
        },
        cream: '#fdf6f0',
        gold: {
          200: '#f7e9b8',
          300: '#f0d68a',
          400: '#e6c46a',
          500: '#d4a84a',
          600: '#b88a32',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        hand: ['"Caveat"', '"Comic Sans MS"', 'cursive'],
      },
      letterSpacing: {
        widest2: '0.35em',
        widest3: '0.5em',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.12' },
          '50%': { opacity: '1' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatXY: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '33%': { transform: 'translate(8px, -12px)' },
          '66%': { transform: 'translate(-6px, -6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        lineGrow: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        flipIn: {
          '0%': { transform: 'rotateY(90deg)', opacity: '0' },
          '100%': { transform: 'rotateY(0deg)', opacity: '1' },
        },
        bobHeart: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-6px) scale(1.08)' },
        },
        driftUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '15%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-120px)', opacity: '0' },
        },
        sweep: {
          '0%': { transform: 'translateX(-120%) skewX(-12deg)' },
          '100%': { transform: 'translateX(220%) skewX(-12deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '20%': { transform: 'translate(-4px, 2px) rotate(-1deg)' },
          '40%': { transform: 'translate(4px, -2px) rotate(1deg)' },
          '60%': { transform: 'translate(-3px, 1px) rotate(-0.5deg)' },
          '80%': { transform: 'translate(3px, -1px) rotate(0.5deg)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) forwards',
        fadeIn: 'fadeIn 1.1s ease forwards',
        twinkle: 'twinkle 4s ease-in-out infinite',
        floatY: 'floatY 6s ease-in-out infinite',
        floatXY: 'floatXY 9s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
        lineGrow: 'lineGrow 1.4s cubic-bezier(0.22,1,0.36,1) forwards',
        spinSlow: 'spinSlow 18s linear infinite',
        flipIn: 'flipIn 0.7s cubic-bezier(0.22,1,0.36,1) forwards',
        bobHeart: 'bobHeart 3s ease-in-out infinite',
        driftUp: 'driftUp 7s ease-in-out infinite',
        sweep: 'sweep 2.2s ease-in-out forwards',
        shake: 'shake 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
};
