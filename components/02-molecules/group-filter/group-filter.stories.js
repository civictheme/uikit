import { generateSlots, knobNumber, knobRadios, knobText, randomFields, randomInt, randomString, shouldRender } from '../../00-base/base.utils';
import CivicThemeGroupFilter from './group-filter.twig';
import './group-filter';

export default {
  title: 'Molecules/Group Filter',
  parameters: {
    layout: 'fullscreen',
  },
};

export const GroupFilter = (props = {}) => {
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
    filter_count: knobNumber(
      'Number of filters',
      3,
      {
        range: true,
        min: 0,
        max: 10,
        step: 1,
      },
      props.knobTab,
    ),
    title: knobText('Filter title', 'Filter search results by:', props.knobTab),
    submit_text: knobText('Submit button text', 'Apply', props.knobTab),
    attributes: knobText('Additional attributes', '', props.knobTab),
    modifier_class: knobText('Additional class', '', props.knobTab),
  };

  const filters = [];

  if (knobs.filter_count > 0) {
    for (let i = 0; i < knobs.filter_count; i++) {
      filters.push({
        content: randomFields(1, knobs.theme, true)[0],
        title: `Filter ${randomString(randomInt(3, 8))} ${i + 1}`,
      });
    }
  }

  const combinedKnobs = { ...knobs, filters };

  return shouldRender(props) ? CivicThemeGroupFilter({
    ...combinedKnobs,
    ...generateSlots([
      'content_top',
      'content_bottom',
    ]),
  }) : combinedKnobs;
};
