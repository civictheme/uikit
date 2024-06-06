import CivicThemeSearch from './search.twig';
import { knobRadios, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Molecules/Search',
  parameters: {
    layout: 'centered',
    wrapperSize: 'large',
  },
};

export const Search = (props = {}) => {
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
    text: knobText('Text', 'Search', props.text, props.knobTab),
    url: knobText('Search URL', '/search', props.url, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeSearch(knobs) : knobs;
};
