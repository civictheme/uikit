import Component from './fonts.stories.twig';
import Constants from '../../../dist/constants.json'; // eslint-disable-line import/no-unresolved

const meta = {
  title: 'Base/Fonts',
  component: Component,
};

export default meta;

export const Fonts = {
  parameters: {
    layout: 'centered',
    storyLayoutSize: 'large',
    storyLayoutCenteredHorizontally: true,
    storyLayoutClass: 'story-fonts-wrapper story-wrapper-size--large',
  },
  args: {
    fonts: Object.keys({
      ...Constants.SCSS_VARIABLES['ct-fonts-default'],
      ...Constants.SCSS_VARIABLES['ct-fonts'],
    }),
    weights: Object.keys({
      ...Constants.SCSS_VARIABLES['ct-font-weights-default'],
      ...Constants.SCSS_VARIABLES['ct-font-weights'],
    }),
  },
};
