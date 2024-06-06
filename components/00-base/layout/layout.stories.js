import CivicThemeLayout from './layout.twig';
import { generateSlots, knobBoolean, knobRadios, knobText, placeholder, shouldRender } from '../base.utils';

export default {
  title: 'Base/Layout',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Layout = (parentKnobs = {}) => {
  const useLargePlaceholders = knobBoolean('Use large placeholders', false, parentKnobs.use_large_placeholders, parentKnobs.knobTab);

  const knobs = {
    rail_top_left: knobBoolean('Show top left rail', true, parentKnobs.rail_top_left, parentKnobs.knobTab) ? placeholder('Top left rail', useLargePlaceholders ? 50 : 0) : '',
    rail_bottom_left: knobBoolean('Show bottom left rail', true, parentKnobs.rail_bottom_left, parentKnobs.knobTab) ? placeholder('Bottom left rail', useLargePlaceholders ? 50 : 0) : '',
    content: knobBoolean('Show content', true, parentKnobs.content, parentKnobs.knobTab) ? placeholder('Content', useLargePlaceholders ? 1000 : 0) : '',
    rail_top_right: knobBoolean('Show top right rail', true, parentKnobs.rail_top_right, parentKnobs.knobTab) ? placeholder('Top right rail', useLargePlaceholders ? 50 : 0) : '',
    rail_bottom_right: knobBoolean('Show bottom right rail', true, parentKnobs.rail_bottom_right, parentKnobs.knobTab) ? placeholder('Bottom right rail', useLargePlaceholders ? 50 : 0) : '',
    is_contained: knobBoolean('Is contained', false, parentKnobs.is_contained, parentKnobs.knobTab),
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
  };

  const attributesTab = 'Attributes';
  knobs.content_attributes = knobs.content ? knobText('Content attributes', '', parentKnobs.content_attributes, attributesTab) : '';
  knobs.rail_top_left_attributes = knobs.rail_top_left ? knobText('Top left rail attributes', '', parentKnobs.rail_top_left_attributes, attributesTab) : '';
  knobs.rail_top_right_attributes = knobs.rail_top_right ? knobText('Top right rail attributes', '', parentKnobs.rail_top_right_attributes, attributesTab) : '';
  knobs.rail_bottom_left_attributes = knobs.rail_bottom_left ? knobText('Bottom left rail attributes', '', parentKnobs.rail_bottom_left_attributes, attributesTab) : '';
  knobs.rail_bottom_right_attributes = knobs.rail_bottom_right ? knobText('Bottom right rail attributes', '', parentKnobs.rail_bottom_right_attributes, attributesTab) : '';
  knobs.modifier_class = knobText('Additional class', '', parentKnobs.modifier_class, parentKnobs.knobTab);

  return shouldRender(parentKnobs)
    ? CivicThemeLayout({
      ...knobs,
      ...generateSlots([
        'content_top',
        'content_bottom',
      ]),
    })
    : knobs;
};
