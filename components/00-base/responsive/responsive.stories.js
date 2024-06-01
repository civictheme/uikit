import CivicThemeResponsive from './responsive.stories.twig';
import './responsive';
import '../collapsible/collapsible';

export default {
  title: 'Base/Responsive',
  parameters: {
    wrapperCenteredHorizontally: true,
  },
};

export const Responsive = () => CivicThemeResponsive();
