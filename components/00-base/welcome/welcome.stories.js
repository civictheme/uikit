import './welcome.stories.scss';
import WelcomeExample from './welcome.stories.twig';

export default {
  title: 'Welcome',
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
    showPanel: false,
  },
};

export const Welcome = () => WelcomeExample({
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
