import CivicThemeLayout from './layout.twig';
import CivicThemeLayoutSingleColumn from './content-layout--single-column.twig';
import CivicThemeLayoutSingleColumnContained from './content-layout--single-column-contained.twig';
import { generateSlots, knobBoolean, knobRadios, knobText, placeholder, shouldRender } from '../base.utils';

export default {
  title: 'Base/Layout',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Layout = (props = {}) => {
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
    content: knobBoolean('Show content', true, props.show_content, props.knobTab) ? placeholder('Content placeholder') : '',
    sidebar: knobBoolean('Show sidebar', false, props.show_sidebar, props.knobTab) ? placeholder('Sidebar placeholder') : '',
    is_contained: knobBoolean('Is contained', false, props.is_contained, props.knobTab),
    layout: knobRadios(
      'Layout',
      {
        'Single Column': 'single_column',
        'Single Column Contained': 'single_column_contained',
      },
      'single_column',
      props.layout,
      props.knobTab,
    ),
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
    content_attributes: knobText('Content attributes', '', props.content_attributes, props.knobTab),
    sidebar_attributes: knobText('Sidebar attributes', '', props.sidebar_attributes, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
  };

  if (knobs.content) {
    switch (knobs.layout) {
      case 'single_column':
        knobs.content = CivicThemeLayoutSingleColumn({
          content: knobs.content,
        });
        break;

      case 'single_column_contained':
        knobs.content = CivicThemeLayoutSingleColumnContained({
          content: knobs.content,
        });
        break;

      default:
        knobs.content = '';
    }
  }

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
