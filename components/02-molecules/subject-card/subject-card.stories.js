import { generateImage, generateSlots, knobBoolean, knobRadios, knobText, randomUrl, shouldRender } from '../../00-base/base.utils';
import CivicThemeSubjectCard from './subject-card.twig';

export default {
  title: 'Molecules/Subject Card',
  parameters: {
    layout: 'centered',
  },
};

export const SubjectCard = (props = {}) => {
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
    title: knobText('Title', 'Subject card title which runs across two or three lines', props.title, props.knobTab),
    link: {
      url: knobText('Link URL', randomUrl(), props.link_url, props.knobTab),
      is_external: knobBoolean('Link is external', false, props.link_is_external, props.knobTab),
      is_new_window: knobBoolean('Open in a new window', false, props.link_is_new_window, props.knobTab),
    },
    image: knobBoolean('With image', true, props.with_image, props.knobTab) ? {
      url: generateImage(),
      alt: 'Image alt text',
    } : false,
    modifier_class: `story-wrapper-size--small ${knobText('Additional class', '', props.modifier_class, props.knobTab)}`,
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeSubjectCard({
    ...knobs,
    ...generateSlots([
      'image_over',
    ]),
  }) : knobs;
};
