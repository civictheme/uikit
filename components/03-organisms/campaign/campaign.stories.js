import { convertDate, generateImage, generateSlots, knobDate, knobNumber, knobRadios, knobText, randomLinks, randomSentence, randomTags, shouldRender } from '../../00-base/base.utils';

import CivicThemeCampaign from './campaign.twig';

export default {
  title: 'Organisms/Campaign',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Campaign = (props = {}) => {
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
    title: knobText('Title', 'Campaign heading which runs across two or three lines', props.title, props.knobTab),
    content: knobText('Content', randomSentence(), props.content, props.knobTab),
    date: knobDate('Date', new Date(), props.date, props.knobTab),
    image: {
      url: generateImage(),
      alt: 'Image alt text',
    },
    image_position: knobRadios(
      'Image position',
      {
        Left: 'left',
        Right: 'right',
      },
      'left',
      props.image_position,
      props.knobTab,
    ),
    links: randomLinks(knobNumber(
      'Number of links',
      2,
      {
        range: true,
        min: 0,
        max: 10,
        step: 1,
      },
      props.number_of_links,
      props.knobTab,
    ), 10),
    tags: randomTags(knobNumber(
      'Number of tags',
      1,
      {
        range: true,
        min: 0,
        max: 10,
        step: 1,
      },
      props.number_of_tags,
      props.knobTab,
    ), true),
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
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  knobs.date = convertDate(knobs.date);

  return shouldRender(props) ? CivicThemeCampaign({
    ...knobs,
    ...generateSlots([
      'content_top',
      'content_middle',
      'content_bottom',
    ]),
  }) : knobs;
};
