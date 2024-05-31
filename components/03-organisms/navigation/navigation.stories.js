import CivicThemeNavigation from './navigation.twig';
import getMenuLinks from '../../00-base/menu/menu.utils';
import { knobBoolean, knobRadios, knobText, randomInt, randomSentence, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Organisms/Navigation',
  parameters: {
    layout: 'centered',
  },
};

export const Navigation = (props = {}) => {
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
    title: knobText('Title', 'Navigation title', props.title, props.knobTab),
    type: knobRadios(
      'Type',
      {
        None: 'none',
        Inline: 'inline',
        Dropdown: 'dropdown',
        Drawer: 'drawer',
      },
      'none',
      props.type,
      props.knobTab,
    ),
    items: getMenuLinks({ knobTab: 'Links' }, (itemTitle, itemIndex, itemCurrentLevel, itemIsActiveTrail, itemParents) => `${itemTitle} ${itemParents.join('')}${itemIndex} ${randomSentence(itemCurrentLevel > 1 ? randomInt(2, 5) : randomInt(1, 3))}`),
    is_animated: knobBoolean('Animated', true, props.is_animated, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeNavigation(knobs) : knobs;
};
