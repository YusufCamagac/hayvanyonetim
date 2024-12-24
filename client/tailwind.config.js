module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#18181b', // Ana arka plan rengi
        text: '#e2e8f0', // Metin rengi
        headings: '#202124', // Başlık rengi (beyaz yapacağız)
        link: '#eab508', // Link rengi (buton rengi ile aynı)
        'link-hover': '#7E22CE', // Link hover rengi
        accent: '#fdf4dc', // Vurgu rengi (kullanmayacağız gibi)
        'header-bg': '#28282b', // Header arka plan
        'menu-bg': '#334155', // Menü arka plan
        'card-bg': '#28282b', // Kart arka plan
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  plugins: [],
};