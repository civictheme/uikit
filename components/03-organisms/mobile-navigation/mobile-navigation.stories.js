import { generateSlots, knobRadios, knobSelect, knobText, shouldRender } from '../../00-base/base.utils';
import getMenuLinks from '../../00-base/menu/menu.utils';
import CivicThemeMobileNavigation from './mobile-navigation.twig';
import CivicThemeMobileNavigationTrigger from './mobile-navigation-trigger.twig';

export default {
  title: 'Organisms/Mobile Navigation',
  parameters: {
    layout: 'fullscreen',
    wrapperSize: 'small',
    wrapperClass: 'example-container__page-content example-ct-mobile-navigation',
    docs: 'Click on the mobile navigation trigger in the top left to open Mobile Navigation panel.',
  },
};

export const MobileNavigation = (props = {}) => {
  const theme = knobRadios(
    'Theme',
    {
      Light: 'light',
      Dark: 'dark',
    },
    'light',
    props.theme,
    props.knobTab,
  );

  const knobs = {
    theme,
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

  const trigger = CivicThemeMobileNavigationTrigger({
    theme,
    icon: knobs.trigger_icon,
    text: knobs.trigger_text,
  });

  const panel = CivicThemeMobileNavigation({
    theme,
    content_top: knobs.content_top,
    top_menu: knobs.top_menu,
    bottom_menu: knobs.bottom_menu,
    content_bottom: knobs.content_bottom,
    ...generateSlots([
      'content_top',
      'content_bottom',
    ]),
  });

  return shouldRender(props) ? `${trigger}${panel}` : knobs;
};
