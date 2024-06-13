import AboutExample from './about.stories.twig';

export default {
  title: 'About',
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
    showPanel: false,
  },
};

export const About = () => AboutExample({
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
