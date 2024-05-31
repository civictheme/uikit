import CivicThemeFigure from './figure.twig';
import { generateImage, knobBoolean, knobRadios, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Molecules/Figure',
  parameters: {
    layout: 'centered',
  },
};

export const Figure = (props = {}) => {
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
    url: knobBoolean('With image', true, props.with_image, props.knobTab) ? generateImage() : false,
    alt: knobText('Image alt text', 'Alternative text', props.alt, props.knobTab),
    width: knobText('Width', '600', props.width, props.knobTab),
    height: knobText('Height', '', props.height, props.knobTab),
    caption: knobText('Caption', 'Figure image caption.', props.caption, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeFigure(knobs) : knobs;
};
