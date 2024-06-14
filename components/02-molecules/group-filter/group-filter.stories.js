import { generateSlots, knobNumber, knobRadios, knobText, randomInt, randomString, shouldRender } from '../../00-base/base.utils';
import CivicThemeGroupFilter from './group-filter.twig';
import './group-filter';
import { randomFields } from '../field/field.utils';

export default {
  title: 'Molecules/Group Filter',
  parameters: {
    layout: 'fullscreen',
  },
};

export const GroupFilter = (parentKnobs = {}) => {
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
    filter_count: knobNumber(
      'Number of filters',
      3,
      {
        range: true,
        min: 0,
        max: 10,
        step: 1,
      },
      parentKnobs.filter_count,
      parentKnobs.knobTab,
    ),
    title: knobText('Filter title', 'Filter search results by:', parentKnobs.title, parentKnobs.knobTab),
    submit_text: knobText('Submit button text', 'Apply', parentKnobs.submit_text, parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab),
    modifier_class: knobText('Additional class', '', parentKnobs.modifier_class, parentKnobs.knobTab),
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

  return shouldRender(parentKnobs) ? CivicThemeGroupFilter({
    ...combinedKnobs,
    ...generateSlots([
      'content_top',
      'content_bottom',
    ]),
  }) : combinedKnobs;
};
