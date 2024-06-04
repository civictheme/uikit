import CivicThemeLayout from './layout.twig';
import { generateSlots, knobBoolean, knobRadios, knobText, placeholder, shouldRender } from '../base.utils';

export default {
  title: 'Base/Layout',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Layout = (props = {}) => {
  const knobs = {
    rail_top_left: knobBoolean('Show top left rail', true, props.rail_top_left, props.knobTab) ? placeholder('Top left rail') : '',
    rail_top_right: knobBoolean('Show top right rail', true, props.rail_top_right, props.knobTab) ? placeholder('Top right rail') : '',
    content: knobBoolean('Show content', true, props.content, props.knobTab) ? placeholder('Content') : '',
    rail_bottom_left: knobBoolean('Show bottom left rail', true, props.rail_bottom_left, props.knobTab) ? placeholder('Bottom left rail') : '',
    rail_bottom_right: knobBoolean('Show bottom right rail', true, props.rail_bottom_right, props.knobTab) ? placeholder('Bottom right rail') : '',
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
  };

  const attributesTab = 'Attributes';
  knobs.content_attributes = knobs.content ? knobText('Content attributes', '', props.content_attributes, attributesTab) : '';
  knobs.rail_top_left_attributes = knobs.rail_top_left ? knobText('Top left rail attributes', '', props.rail_top_left_attributes, attributesTab) : '';
  knobs.rail_top_right_attributes = knobs.rail_top_right ? knobText('Top right rail attributes', '', props.rail_top_right_attributes, attributesTab) : '';
  knobs.rail_bottom_left_attributes = knobs.rail_bottom_left ? knobText('Bottom left rail attributes', '', props.rail_bottom_left_attributes, attributesTab) : '';
  knobs.rail_bottom_right_attributes = knobs.rail_bottom_right ? knobText('Bottom right rail attributes', '', props.rail_bottom_right_attributes, attributesTab) : '';
  knobs.modifier_class = knobText('Additional class', '', props.modifier_class, props.knobTab);

  return shouldRender(props)
    ? CivicThemeLayout({
      ...knobs,
      ...generateSlots([
        'content_top',
        'content_bottom',
      ]),
    })
    : knobs;
};
