/**
 * Registers the "Colour Picker" page in a host Storybook. Opt-in, not an
 * addon: a consumer adds this package's stories glob plus two staticDirs
 * entries (serving this package at /colour-picker and @civictheme/tokens at
 * /colour-picker-tokens — see the README). The page iframes the static UI,
 * which is same-origin there, so live previews inject the generated
 * properties into real story iframes.
 */
export default {
  title: 'Colour Picker',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    html: { disable: true },
  },
};

export const ColourPicker = {
  name: 'Colour picker',
  render: () => {
    const frame = document.createElement('iframe');
    frame.src = '/colour-picker/ui/index.html';
    frame.title = 'CivicTheme colour picker';
    frame.style.cssText = 'width: 100%; height: 100vh; border: none; display: block; background: #f4f6f7';
    return frame;
  },
};
