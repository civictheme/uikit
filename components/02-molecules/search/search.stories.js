import CivicThemeSearch from './search.twig';
import { knobBoolean, knobRadios, knobText, shouldRender } from '../../00-base/storybook/storybook.utils';

export default {
  title: 'Molecules/Search',
  parameters: {
    layout: 'centered',
    storyLayoutSize: 'large',
  },
};

export const Search = (parentKnobs = {}) => {
  const knobs = {
    theme: knobRadios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      parentKnobs.theme,
      parentKnobs.knobTab,
    ),
    text: knobText('Text', 'Search', parentKnobs.text, parentKnobs.knobTab),
    url: knobText('Search URL', '/search', parentKnobs.url, parentKnobs.knobTab),
    hide_on_mobile: knobBoolean('Hide on mobile', false, parentKnobs.hide_on_mobile, parentKnobs.knobTab),
    modifier_class: knobText('Additional class', '', parentKnobs.modifier_class, parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemeSearch(knobs) : knobs;
};
