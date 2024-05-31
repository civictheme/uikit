import { generateSlots, knobNumber, knobRadios, knobText, randomLinks, shouldRender } from '../../00-base/base.utils';

import CivicThemeServiceCard from './service-card.twig';

export default {
  title: 'Molecules/Service Card',
  parameters: {
    layout: 'centered',
  },
};

export const ServiceCard = (props = {}) => {
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
    title: knobText('Title', 'Services category title across one or two lines', props.title, props.knobTab),
    links: randomLinks(knobNumber(
      'Number of links',
      5,
      {
        range: true,
        min: 0,
        max: 10,
        step: 1,
      },
      props.number_of_links,
      props.knobTab,
    ), 10),
    modifier_class: `story-wrapper-size--small ${knobText('Additional class', '', props.modifier_class, props.knobTab)}`,
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeServiceCard({
    ...knobs,
    ...generateSlots([
      'content_top',
      'content_bottom',
    ]),
  }) : knobs;
};
