/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Main design colors
                blue: "#0087A3",
                red: "#A30032",
                "dark-green": "#0D141D",
                "secondary-black": "#282626",
                "secondary-grey": "#A19C92",
                "navy-green": "#003253",
                "pale-gray": "#F4F0E9",
                "primary-green": "#FF6B35",
                black: "#040303",
                // Legacy colors
                "seu-dark": "#0c1829",
                "seu-darker": "#060d16",
                "seu-gold": "#c9a962",
                "seu-gold-light": "#d4b872",
                "seu-cream": "#e8dcc8",
                "seu-cream-light": "#f5efe6",
                "seu-teal": "#0d2e2e",
                "seu-teal-light": "#1a3a3a",
                "seu-white": "#ffffff",
                "seu-gray": "#6b7280",
                "seu-light-gray": "#9ca3af",
                // shadcn/ui colors
                background: "var(--background)",
                foreground: "var(--foreground)",
                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)",
                },
                popover: {
                    DEFAULT: "var(--popover)",
                    foreground: "var(--popover-foreground)",
                },
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "var(--secondary-foreground)",
                },
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)",
                },
                destructive: {
                    DEFAULT: "var(--destructive)",
                    foreground: "var(--destructive-foreground)",
                },
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                chart: {
                    1: "var(--chart-1)",
                    2: "var(--chart-2)",
                    3: "var(--chart-3)",
                    4: "var(--chart-4)",
                    5: "var(--chart-5)",
                },
                sidebar: {
                    DEFAULT: "var(--sidebar)",
                    foreground: "var(--sidebar-foreground)",
                    primary: "var(--sidebar-primary)",
                    "primary-foreground": "var(--sidebar-primary-foreground)",
                    accent: "var(--sidebar-accent)",
                    "accent-foreground": "var(--sidebar-accent-foreground)",
                    border: "var(--sidebar-border)",
                    ring: "var(--sidebar-ring)",
                },
            },
            fontFamily: {
                montserrat: ["var(--font-montserrat)", "sans-serif"],
                bodoni: ["Bodoni MT", "Bodoni 72", "Didot", "GFS Didot", "serif"],
            },
            fontSize: {
                "seu-caption-sm": "0.75rem",
                "seu-caption": "0.875rem",
                "seu-body-sm": "1rem", // 16px
                "seu-body": "1.125rem", // 18px
                "seu-body-lg": "1.25rem", // 20px
                "seu-body-xl": "1.375rem",
                "seu-subheading": "1.5rem",
                "seu-subheading-lg": "1.625rem",
                "seu-heading": "2rem",
                "seu-heading-lg": "2.5rem",
                "seu-title": "3rem",
                "seu-title-lg": "3.5rem",
                "seu-title-xl": "4rem",
            },
            borderRadius: {
                sm: "calc(var(--radius) - 4px)",
                md: "calc(var(--radius) - 2px)",
                lg: "var(--radius)",
                xl: "calc(var(--radius) + 4px)",
                "2xl": "calc(var(--radius) + 8px)",
                "3xl": "calc(var(--radius) + 12px)",
                "4xl": "calc(var(--radius) + 16px)",
            },
        },
    },
    plugins: [],
};