/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                upleex: {
                    blue: '#0ea5e9', // Sky 500
                    purple: '#6366f1', // Indigo 500
                    dark: '#0f172a', // Slate 900
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
