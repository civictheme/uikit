import CivicThemeSideNavigation from './side-navigation.twig';
import getMenuLinks from '../../00-base/menu/menu.utils';
import { knobRadios, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Organisms/Side Navigation',
  parameters: {
    layout: 'centered',
  },
};

export const SideNavigation = (props = {}) => {
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
    title: knobText('Title', 'Side Navigation title', props.title, props.knobTab),
    items: getMenuLinks({ knobTab: 'Links' }),
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

  return shouldRender(props) ? CivicThemeSideNavigation(knobs) : knobs;
};
