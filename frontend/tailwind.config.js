import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "spin-slow": "spin 1s linear infinite",
      },
    },
    colors: {
      matisse: {
        50: "#f2f8fd",
        100: "#e5f0f9",
        200: "#c5e0f2",
        300: "#91c7e8",
        400: "#56a9da",
        500: "#318fc6",
        600: "#2172a8",
        700: "#1f6596",
        800: "#1b4e71",
        900: "#1c425e",
        950: "#122a3f",
      },
      apple: {
        50: "#f4fbf2",
        100: "#e5f8e0",
        200: "#ccf0c2",
        300: "#a2e293",
        400: "#71cc5c",
        500: "#46a131",
        600: "#3a9227",
        700: "#317322",
        800: "#2b5b20",
        900: "#234b1c",
        950: "#0e290a",
      },
      chileanFire: {
        50: "#fff9ed",
        100: "#fff2d4",
        200: "#ffe2a9",
        300: "#ffcc72",
        400: "#feab39",
        500: "#fc8f13",
        600: "#f07509",
        700: "#c55809",
        800: "#9c4510",
        900: "#7d3a11",
        950: "#441c06",
      },
      slateGray: {
        50: "#f5f7f8",
        100: "#ecf1f3",
        200: "#dce5e9",
        300: "#c7d3da",
        400: "#b0bec9",
        500: "#9baab9",
        600: "#7c8ca1",
        700: "#717f91",
        800: "#5d6876",
        900: "#4e5661",
        950: "#2e3338",
      },
    },
  },
  plugins: [],
});
