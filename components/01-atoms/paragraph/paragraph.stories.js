import CivicThemeParagraph from './paragraph.twig';
import { knobBoolean, knobRadios, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Paragraph',
  parameters: {
    layout: 'centered',
    knobs: {
      escapeHTML: false,
    },
  },
};

export const Paragraph = (props = {}) => {
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
    content: knobText('Content', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur harum magnam modi obcaecati vitae voluptatibus! Accusamus atque deleniti, distinctio esse facere, nam odio officiis omnis porro quibusdam quis repudiandae veritatis.', props.content, props.knobTab),
    size: knobRadios(
      'Size',
      {
        'Extra Large': 'extra-large',
        Large: 'large',
        Regular: 'regular',
        Small: 'small',
      },
      'regular',
      props.size,
      props.knobTab,
    ),
    allow_html: knobBoolean('Allow HTML in text', false, props.allow_html, props.knobTab),
    modifier_class: knobText('Additional classes', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeParagraph(knobs) : knobs;
};
