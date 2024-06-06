import CivicThemeResponsive from './responsive.stories.twig';
import './responsive';
import '../collapsible/collapsible';

export default {
  title: 'Base/Responsive',
  parameters: {
    wrapperCenteredHorizontally: true,
    docs: 'Try resizing your browser window to see how components react to a breakpoint change',
    docsSize: 'large',
    docsPlacement: 'before',
  },
};

export const Responsive = () => CivicThemeResponsive();
