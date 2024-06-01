import { knobColor, knobSelect, objectFromArray, shouldRender } from '../base.utils';

export default {
  title: 'Base/Background',
  parameters: {
    layout: 'centered',
    wrapperSize: 'large',
    wrapperClass: 'story-background-wrapper',
  },
};

export const Background = (props = {}) => {
  const knobs = {
    url: knobSelect('Background', Object.keys(BACKGROUNDS), Object.keys(BACKGROUNDS)[0], props.bgImageUrl, props.knobTab),
    color: knobColor('Background color', '#003a4f', props.bgColor, props.knobTab),
    blend_mode: knobSelect(
      'Blend mode',
      objectFromArray(SCSS_VARIABLES['ct-background-blend-modes']),
      SCSS_VARIABLES['ct-background-blend-modes'][0],
      props.blendMode,
      props.knobTab,
    ),
  };

  return shouldRender(props)
    ? `<div class="ct-background ct-background--${knobs.blend_mode}" style="background-image: url('${BACKGROUNDS[knobs.url]}'); background-color: ${knobs.color}"></div>`
    : knobs;
};
