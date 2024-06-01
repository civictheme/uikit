import CivicThemeCallout from './callout.twig';
import { generateSlots, knobNumber, knobRadios, knobText, randomLinks, randomSentence, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Molecules/Callout',
  parameters: {
    layout: 'centered',
    wrapperSize: 'large',
  },
};

export const Callout = (props = {}) => {
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
    title: knobText('Title', 'Callout title from knob', props.callout_title, props.knobTab),
    content: knobText('Content', randomSentence(), props.content, props.knobTab),
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
    links: randomLinks(knobNumber(
      'Count of links',
      2,
      {
        range: true,
        min: 0,
        max: 10,
        step: 1,
      },
      props.count_of_links,
      props.knobTab,
    )),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeCallout({
    ...knobs,
    ...generateSlots([
      'content_top',
      'content_bottom',
    ]),
  }) : knobs;
};
