import CivicThemeBackToTop from './back-to-top.twig';
import { shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Organisms/Back To Top',
  parameters: {
    layout: 'fullscreen',
    docs: 'Back To Top button appears when the bottom of the red rectangle reaches the top of the page.',
    docsSize: 'medium',
    docsPlacement: 'before',
    storyLayoutHtmlBefore: '<a id="top"></a><div class="story-container"><div class="story-container__page-content story-ct-back-to-top"></div>',
  },
};

export const BackToTop = (parentKnobs = {}) => (shouldRender(parentKnobs)
  ? CivicThemeBackToTop()
  : '');
