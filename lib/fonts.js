// Fonts loaded via CSS @import in globals.css — avoids build-time network fetch to fonts.gstatic.com
const makeFont = (className, fontFamily, fallback) =>
  (_opts) => ({
    className,
    style: { fontFamily: `'${fontFamily}', ${fallback}` },
    variable: `--${className}`,
  });

export const Inter = makeFont('font-inter', 'Inter', 'sans-serif');
export const Cormorant_Garamond = makeFont('font-cormorant', 'Cormorant Garamond', 'serif');
export const Montserrat = makeFont('font-montserrat', 'Montserrat', 'sans-serif');
export const Poppins = makeFont('font-poppins', 'Poppins', 'sans-serif');
