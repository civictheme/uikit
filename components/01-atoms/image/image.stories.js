import CivicThemeImage from './image.twig';
import { generateImage, knobBoolean, knobRadios, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Image',
  parameters: {
    layout: 'centered',
  },
};

export const Image = (props = {}) => {
  const knobs = {
    theme: knobRadios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      props.theme,
      props.knobTab,
    ),
    url: knobBoolean('Show image', true, props.show_image, props.knobTab) ? generateImage() : false,
    alt: knobText('Image alt text', 'Alternative text', props.alt, props.knobTab),
    width: knobText('Width', '', props.width, props.knobTab),
    height: knobText('Height', '', props.height, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeImage(knobs) : knobs;
};
