import Component from './responsive.stories.twig';

const meta = {
  title: 'Base/Utilities/Responsive',
  component: Component,
};

export default meta;

export const Responsive = {
  parameters: {
    layout: 'centered',
    storyLayoutSize: 'medium',
    docs: 'Try resizing your browser window to see how components react to a breakpoint change',
  },
};
