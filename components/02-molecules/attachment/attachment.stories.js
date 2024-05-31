import { convertDate, generateSlots, knobBoolean, knobRadios, knobText, randomSentence, randomUrl, shouldRender } from '../../00-base/base.utils';
import CivicThemeAttachment from './attachment.twig';

export default {
  title: 'Molecules/Attachment',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Attachment = (props = {}) => {
  const date = convertDate(null);

  const files = [
    {
      url: randomUrl(),
      name: 'Document.doc',
      ext: 'doc',
      size: '42.88 KB',
      created: date,
      changed: date,
      icon: 'word-file',
    },
    {
      url: randomUrl(),
      name: 'Document.doc',
      ext: 'docx',
      size: '32.48 KB',
      created: date,
      changed: date,
      icon: 'word-file',
    },
    {
      url: randomUrl(),
      name: 'Document.pdf',
      ext: 'pdf',
      size: '42.82 KB',
      created: date,
      changed: date,
      icon: 'pdf-file',
    },
    {
      url: randomUrl(),
      name: 'Document.ppt',
      ext: 'ppt',
      size: '12.88 KB',
      created: date,
      changed: date,
      icon: 'download-file',
    },
    {
      url: randomUrl(),
      name: 'Document.xlsx',
      ext: 'xlsx',
      size: '34.45 KB',
      created: date,
      changed: date,
      icon: 'download-file',
    },
    {
      url: randomUrl(),
      name: 'Document.xls',
      ext: 'xls',
      size: '65.67 KB',
      created: date,
      changed: date,
      icon: 'download-file',
    },
    {
      url: randomUrl(),
      name: 'Document.xls',
      size: '65.67 KB',
      created: date,
      changed: date,
      icon: 'download-file',
    },
    {
      url: randomUrl(),
      name: 'Document.xls',
      ext: 'XLS',
      created: date,
      changed: date,
      icon: 'download-file',
    },
    {
      url: randomUrl(),
      name: 'Document.xls',
      created: date,
      changed: date,
      icon: 'download-file',
    },
  ];

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
    title: knobText('Title', 'Attachments', props.attachment_title, props.knobTab),
    content: knobText('Content', randomSentence(), props.content, props.knobTab),
    files: knobBoolean('With files', true, props.with_files, props.knobTab) ? files : null,
    with_background: knobBoolean('With background', false, props.with_background, props.knobTab),
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

  return shouldRender(props) ? CivicThemeAttachment({
    ...knobs,
    ...generateSlots([
      'content_top',
      'content_bottom',
    ]),
  }) : knobs;
};
