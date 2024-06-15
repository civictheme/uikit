import { generateSlots, knobRadios, knobSelect, knobText, shouldRender } from '../../00-base/base.utils';
import getMenuLinks from '../../00-base/menu/menu.utils';
import CivicThemeMobileNavigation from './mobile-navigation.twig';
import CivicThemeMobileNavigationTrigger from './mobile-navigation-trigger.twig';

export default {
  title: 'Organisms/Mobile Navigation',
  parameters: {
    layout: 'fullscreen',
    wrapperSize: 'small',
    wrapperClass: 'story-container__page-content story-ct-mobile-navigation',
    docs: 'Click on the mobile navigation trigger in the top left to open Mobile Navigation panel.',
  },
};

export const MobileNavigation = (parentKnobs = {}) => {
  const theme = knobRadios(
    'Theme',
    {
      Light: 'light',
      Dark: 'dark',
    },
    'light',
    parentKnobs.theme,
    parentKnobs.knobTab,
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
      parentKnobs.trigger_theme,
      parentKnobs.knobTab,
    ),
    trigger_text: knobText('Trigger Text', 'Menu', parentKnobs.trigger_text, parentKnobs.knobTab),
    trigger_icon: knobSelect('Trigger Icon', Object.values(ICONS), 'bars', parentKnobs.trigger_icon, parentKnobs.knobTab),
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

  return shouldRender(parentKnobs) ? `${trigger}${panel}` : knobs;
};
