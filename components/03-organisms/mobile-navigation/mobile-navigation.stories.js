import CivicThemeMobileNavigationExample from './mobile-navigation.stories.twig';
import { generateSlots, knobRadios, knobSelect, knobText, shouldRender } from '../../00-base/base.utils';
import getMenuLinks from '../../00-base/menu/menu.utils';

export default {
  title: 'Organisms/Mobile Navigation',
  parameters: {
    layout: 'fullscreen',
  },
};

export const MobileNavigation = (props = {}) => {
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
    trigger_theme: knobRadios(
      'Trigger Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      props.trigger_theme,
      props.knobTab,
    ),
    trigger_text: knobText('Trigger Text', 'Menu', props.trigger_text, props.knobTab),
    trigger_icon: knobSelect('Trigger Icon', Object.values(ICONS), 'bars', props.trigger_icon, props.knobTab),
    top_menu: getMenuLinks({ knobTab: 'Top menu' }, 'Top '),
    bottom_menu: getMenuLinks({ knobTab: 'Bottom menu' }, 'Bottom '),
  };

  return shouldRender(props) ? CivicThemeMobileNavigationExample({
    ...knobs,
    ...generateSlots([
      'content_top',
      'content_bottom',
    ]),
  }) : knobs;
};
