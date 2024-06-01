import { generateSlots, knobBoolean, knobNumber, knobRadios, knobText, randomInt, randomSentence, randomTags, randomUrl, shouldRender } from '../../00-base/base.utils';

import CivicThemeSummary from './snippet.twig';

export default {
  title: 'Molecules/Snippet',
  parameters: {
    layout: 'centered',
    wrapperSize: 'large',
  },
};

export const Snippet = (props = {}) => {
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
    title: knobText('Title', 'Snippet name which runs across two or three lines', props.title, props.knobTab),
    summary: knobText('Summary', randomSentence(randomInt(15, 25)), props.summary, props.knobTab),
    link: {
      url: knobText('Link URL', randomUrl(), props.link_url, props.knobTab),
      is_external: knobBoolean('Link is external', false, props.link_is_external, props.knobTab),
      is_new_window: knobBoolean('Open in a new window', false, props.link_is_new_window, props.knobTab),
    },
    tags: randomTags(knobNumber(
      'Number of tags',
      2,
      {
        range: true,
        min: 0,
        max: 10,
        step: 1,
      },
      props.number_of_tags,
      props.knobTab,
    ), true),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeSummary({
    ...knobs,
    ...generateSlots([
      'content_top',
      'content_middle',
      'content_bottom',
    ]),
  }) : knobs;
};
