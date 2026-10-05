import Component from './colors.stories.twig';
import lightTokens from '../../../../tokens/dist/resolved.light.json';
import darkTokens from '../../../../tokens/dist/resolved.dark.json';

const themeTokens = {
  light: lightTokens,
  dark: darkTokens,
};

const sectionMap = {
  'Brand colors': {
    Standard: [
      'brand1',
      'brand2',
      'brand3',
    ],
  },
  'Palette colors': {
    Typography: [
      'heading',
      'body',
    ],
    Backgrounds: [
      'background-light',
      'background',
      'background-dark',
    ],
    Borders: [
      'border-light',
      'border',
      'border-dark',
    ],
    Interaction: [
      'interaction-text',
      'interaction-background',
      'interaction-hover-text',
      'interaction-hover-background',
      'interaction-focus',
    ],
    Highlight: [
      'highlight',
    ],
    Status: [
      'information',
      'warning',
      'error',
      'success',
    ],
  },
};

// The swatch border tone replicates dart-sass color.scale($lightness: -40%),
// which the 1.x Sass-generated swatches used, so swatches render unchanged.
function hexToRgb(hex) {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? value.split('').map((c) => c + c).join('') : value;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

function rgbToHsl([red, green, blue]) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;

  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h *= 60;
    if (h < 0) {
      h += 360;
    }
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return [h, s, l];
}

function hueToRgb(m1, m2, hue) {
  let h = hue;
  if (h < 0) h += 1;
  if (h > 1) h -= 1;
  if (h < 1 / 6) return m1 + (m2 - m1) * h * 6;
  if (h < 1 / 2) return m2;
  if (h < 2 / 3) return m1 + (m2 - m1) * (2 / 3 - h) * 6;
  return m1;
}

function hslToRgb([hue, s, l]) {
  const h = (((hue % 360) + 360) % 360) / 360;
  const m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
  const m1 = l * 2 - m2;
  return [
    hueToRgb(m1, m2, h + 1 / 3) * 255,
    hueToRgb(m1, m2, h) * 255,
    hueToRgb(m1, m2, h - 1 / 3) * 255,
  ].map((c) => Math.round(c));
}

function darken(hex, amount = 0.4) {
  const [h, s, l] = rgbToHsl(hexToRgb(hex));
  const rgb = hslToRgb([h, s, l * (1 - amount)]);
  return `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

const sections = {};

for (const theme in themeTokens) {
  sections[theme] = {};
  for (const sectionTitle in sectionMap) {
    sections[theme][sectionTitle] = {};
    const prefix = sectionTitle === 'Brand colors' ? 'color.brand.' : 'color.palette.';
    for (const sectionName in sectionMap[sectionTitle]) {
      sections[theme][sectionTitle][sectionName] = {};
      for (const name of sectionMap[sectionTitle][sectionName]) {
        const value = themeTokens[theme][`${prefix}${name}`];
        sections[theme][sectionTitle][sectionName][name] = {
          value,
          border: darken(value),
        };
      }
    }
  }
}

const meta = {
  title: 'Base/Colors',
  component: Component,
  argTypes: {
    sections: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

export const Colors = {
  parameters: {
    layout: 'fullscreen',
    html: {
      disable: true,
    },
  },
  args: {
    sections,
  },
};
