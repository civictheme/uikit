import { generateSlots, knobBoolean, knobNumber, knobRadios, knobText, KnobValue, randomInt, randomSentence, randomUrl, shouldRender } from '../../00-base/base.utils';
import CivicThemeHeaderExample from './header.stories.twig';

import getMenuLinks from '../../00-base/menu/menu.utils';
import { Logo } from '../../02-molecules/logo/logo.stories';

export default {
  title: 'Organisms/Header',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Header = (props = {}) => {
  const knobs = {
    theme: knobRadios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      props.knobTab,
    ),
    show_content_top2: knobBoolean('Show slogan', true, props.knobTab),
    show_content_top3: knobBoolean('Show top content', true, props.knobTab),
    show_content_middle3: knobBoolean('Show middle content', true, props.knobTab),
  };

  knobs.logo = knobBoolean('Show logo', true, props.knobTab) ? Logo({
    knobTab: 'Logo',
    theme: knobs.theme,
    url: randomUrl('example2.com'),
    type: new KnobValue(),
    title: new KnobValue('This is a Logo in Header'),
  }) : null;

  if (knobs.show_content_middle3) {
    const primaryNavigationKnobTab = 'Primary navigation';
    knobs.primary_navigation_items = getMenuLinks({ knobTab: primaryNavigationKnobTab }, (itemTitle, itemIndex, itemCurrentLevel, itemIsActiveTrail, itemParents) => `${itemTitle} ${itemParents.join('')}${itemIndex} ${randomSentence(itemCurrentLevel > 1 ? randomInt(2, 5) : randomInt(1, 3))}`);
    knobs.primary_navigation_dropdown_columns = knobNumber(
      'Dropdown columns',
      4,
      {
        range: true,
        min: 0,
        max: 5,
        step: 1,
      },
      primaryNavigationKnobTab,
    );
    knobs.primary_navigation_dropdown_columns_fill = knobBoolean('Fill width for missing columns', false, primaryNavigationKnobTab);

    const searchLinkKnobTab = 'Search';
    knobs.with_search = knobBoolean('With Search', true, props.knobTab) ? {
      text: knobText('Text', 'Search', searchLinkKnobTab),
      url: knobText('Url', '/search', searchLinkKnobTab),
    } : null;
  }

  if (knobs.show_content_top3) {
    knobs.secondary_navigation_items = getMenuLinks({ knobTab: 'Secondary navigation' }, (itemTitle, itemIndex, itemCurrentLevel, itemIsActiveTrail, itemParents) => `${itemTitle} ${itemParents.join('')}${itemIndex} ${randomSentence(itemCurrentLevel > 1 ? randomInt(2, 5) : randomInt(1, 3))}`);
  }

  return shouldRender(props) ? CivicThemeHeaderExample({
    ...knobs,
    ...generateSlots([
      'content_top1',
      'content_top2',
      'content_top3',
      'content_middle1',
      'content_middle2',
      'content_middle3',
      'content_bottom1',
    ]),
  }) : knobs;
};
