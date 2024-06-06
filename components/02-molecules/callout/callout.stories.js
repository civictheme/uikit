import CivicThemeCallout from './callout.twig';
import { generateSlots, knobNumber, knobRadios, knobText, randomLinks, randomSentence, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Molecules/Callout',
  parameters: {
    layout: 'centered',
    wrapperSize: 'large',
  },
};

export const Callout = (parentKnobs = {}) => {
  const knobs = {
    theme: knobRadios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      parentKnobs.theme,
      parentKnobs.knobTab,
    ),
    title: knobText('Title', 'Callout title from knob', parentKnobs.callout_title, parentKnobs.knobTab),
    content: knobText('Content', randomSentence(), parentKnobs.content, parentKnobs.knobTab),
    vertical_spacing: knobRadios(
      'Vertical spacing',
      {
        None: 'none',
        Top: 'top',
        Bottom: 'bottom',
        Both: 'both',
      },
      'none',
      parentKnobs.vertical_spacing,
      parentKnobs.knobTab,
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
      parentKnobs.count_of_links,
      parentKnobs.knobTab,
    )),
    modifier_class: knobText('Additional class', '', parentKnobs.modifier_class, parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemeCallout({
    ...knobs,
    ...generateSlots([
      'content_top',
      'content_bottom',
    ]),
  }) : knobs;
};
