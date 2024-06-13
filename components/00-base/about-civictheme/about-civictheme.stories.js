import AboutCivicThemeExample from './about-civictheme.stories.twig';

export default {
  title: 'About CivicTheme',
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
    showPanel: false,
  },
};

export const AboutCivicTheme = () => AboutCivicThemeExample({
  logos: {
    primary: {
      mobile: {
        url: LOGOS.light.civictheme.mobile,
      },
      desktop: {
        url: LOGOS.light.civictheme.desktop,
      },
    },
  },
});
