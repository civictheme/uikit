import CivicThemeIframe from './iframe.twig';
import { knobBoolean, knobRadios, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Iframe',
  parameters: {
    layout: 'centered',
  },
};

export const Iframe = (props = {}) => {
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
    url: knobText('URL', 'https://www.openstreetmap.org/export/embed.html?bbox=144.1910129785538%2C-38.33563928918572%2C146.0037571191788%2C-37.37170047141492&amp;layer=mapnik', props.url, props.knobTab),
    width: knobText('Width', '500', props.width, props.knobTab),
    height: knobText('Height', '300', props.height, props.knobTab),
    vertical_spacing: knobRadios(
      'Vertical spacing',
      {
        None: 'none',
        Top: 'top',
        Bottom: 'bottom',
        Both: 'both',
      },
      'none',
      props.vertical_spacing,
      props.knobTab,
    ),
    with_background: knobBoolean('With background', false, props.with_background, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeIframe(knobs) : knobs;
};
