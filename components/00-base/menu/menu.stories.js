import CivicThemeMenu from './menu.twig';
import getMenuLinks from './menu.utils';
import { knobRadios, knobText, shouldRender } from '../base.utils';

export default {
  title: 'Base/Menu Generator',
  parameters: {
    layout: 'centered',
  },
};

export const MenuGenerator = (props = {}) => {
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
    items: getMenuLinks(props.knobTab, null),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeMenu(knobs) : knobs;
};
