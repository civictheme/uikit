import CivicThemePublicationCard from './publication-card.twig';
import { convertDate, generateImage, generateSlots, knobBoolean, knobRadios, knobText, randomSentence, randomUrl, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Molecules/Publication Card',
  parameters: {
    layout: 'centered',
    wrapperSize: 'medium',
  },
};

export const PublicationCard = (props = {}) => {
  const date = convertDate(null);

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
    title: knobText('Title', 'Publication or whitepaper main title', props.title, props.knobTab),
    summary: knobText('Summary', randomSentence(), props.summary, props.knobTab),
    image: knobBoolean('With image', true, props.with_image, props.knobTab) ? {
      url: generateImage(),
      alt: 'Image alt text',
    } : false,
    file: knobBoolean('With file', true, props.with_file, props.knobTab) ? {
      url: randomUrl(),
      name: 'Document.doc',
      ext: 'doc',
      size: '42.88 KB',
      created: date,
      changed: date,
      icon: 'word-file',
    } : null,
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  return shouldRender(props) ? CivicThemePublicationCard({
    ...knobs,
    ...generateSlots([
      'image_over',
      'content_top',
      'content_middle',
      'content_bottom',
    ]),
  }) : knobs;
};
