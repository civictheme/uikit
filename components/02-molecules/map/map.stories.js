import { generateSlots, knobBoolean, knobRadios, knobText, randomUrl, shouldRender } from '../../00-base/base.utils';
import CivicThemeMap from './map.twig';

export default {
  title: 'Molecules/Map',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Map = (props = {}) => {
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
    url: knobText('URL', 'https://maps.google.com/maps?q=australia&t=&z=3&ie=UTF8&iwloc=&output=embed', props.url, props.knobTab),
    address: knobText('Address', 'Australia', props.address, props.knobTab),
    view_url: knobText('View URL', randomUrl(), props.view_url, props.knobTab),
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

  return shouldRender(props) ? CivicThemeMap({
    ...knobs,
    ...generateSlots([
      'content_top',
      'content_bottom',
    ]),
  }) : knobs;
};
