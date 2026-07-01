/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F5E6D3',
        'paper-deep': '#EAD5B8',
        'paper-light': '#FAF3E7',
        ink: '#1A1A1A',
        'ink-soft': '#3A3A3A',
        'ink-mute': '#6B6B6B',
        crimson: '#D7263D',
        indigo: '#1B6CA8',
        mustard: '#F4A261',
        teal: '#2A9D8F',
        violet: '#6A4C93',
      },
      fontFamily: {
        'hand-title': ['ZCOOL KuaiLe', 'cursive'],
        'hand-body': ['Ma Shan Zheng', 'cursive'],
        'hand-en': ['Caveat', 'cursive'],
      },
      borderRadius: {
        'hand': '18px',
        'hand-sm': '12px',
      },
      boxShadow: {
        'hand': '4px 4px 0 #1A1A1A, 8px 8px 0 rgba(26, 26, 26, 0.15)',
        'hand-lg': '6px 6px 0 #1A1A1A, 12px 12px 0 rgba(26, 26, 26, 0.2)',
        'hand-crimson': '4px 4px 0 #D7263D, 8px 8px 0 rgba(215, 38, 61, 0.2)',
        'hand-gold': '4px 4px 0 #F4A261, 8px 8px 0 rgba(244, 162, 97, 0.25)',
      },
    },
  },
  plugins: [],
};
