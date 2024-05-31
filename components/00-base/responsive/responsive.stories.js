import CivicThemeResponsive from './responsive.stories.twig';
import './responsive';
import '../collapsible/collapsible';

export default {
  title: 'Base/Responsive',
};

export const Responsive = () => `<div class="story-wrapper--centered story-wrapper-size--medium">${CivicThemeResponsive()}</div>`;
