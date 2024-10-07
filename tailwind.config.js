import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',


        flowbite.content(),
    ],


    theme: {
        extend: {

            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                'Panchang': ['Panchang', 'sans'],
                'Inter': ['Inter', 'sans'],
                'DM': ['DM Sans', 'sans'],
                'Bebas': ['Bebas', 'sans'],
                
                
            },
            colors: {
                'aqua': '#00e1d2',

            },
            keyframes: {
                slideUp: {
                    '0%': { transform: 'translateY(50px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            animation: {
                slideUp: 'slideUp 0.5s ease-out',
            },
        },
    },

    plugins: [forms,
        flowbite.plugin(),
    ],
    darkMode: 'class',
};
