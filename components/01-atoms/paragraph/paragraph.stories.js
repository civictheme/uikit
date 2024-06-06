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

export const Paragraph = (parentKnobs = {}) => {
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
    content: knobText('Content', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur harum magnam modi obcaecati vitae voluptatibus! Accusamus atque deleniti, distinctio esse facere, nam odio officiis omnis porro quibusdam quis repudiandae veritatis.', parentKnobs.content, parentKnobs.knobTab),
    size: knobRadios(
      'Size',
      {
        'Extra Large': 'extra-large',
        Large: 'large',
        Regular: 'regular',
        Small: 'small',
      },
      'regular',
      parentKnobs.size,
      parentKnobs.knobTab,
    ),
    allow_html: knobBoolean('Allow HTML in text', false, parentKnobs.allow_html, parentKnobs.knobTab),
    modifier_class: knobText('Additional classes', '', parentKnobs.modifier_class, parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemeParagraph(knobs) : knobs;
};
