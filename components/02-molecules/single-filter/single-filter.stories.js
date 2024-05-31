import CivicThemeSingleFilter from './single-filter.twig';
import './single-filter';
import { generateSlots, knobBoolean, knobNumber, knobRadios, knobText, randomName, randomString, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Molecules/Single Filter',
  parameters: {
    layout: 'fullscreen',
  },
};

export const SingleFilter = (props = {}) => {
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
    title: knobText('Title', 'Filter search results by:', props.title, props.knobTab),
    submit_text: knobText('Submit button text', 'Apply', props.submit_text, props.knobTab),
    is_multiple: knobBoolean('Multiple', false, props.is_multiple, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  const count = knobNumber(
    'Number of filters',
    3,
    {
      range: true,
      min: 0,
      max: 15,
      step: 1,
    },
    props.number_of_filters,
    props.knobTab,
  );

  const selected = knobNumber(
    'Selected',
    0,
    {
      range: true,
      min: 0,
      max: count,
      step: 1,
    },
    props.selected,
    props.knobTab,
  );

  const items = [];
  const name = randomName(5);
  for (let i = 0; i < count; i++) {
    items.push({
      text: `Filter ${i + 1}${randomString(3)}`,
      name: knobs.is_multiple ? name + (i + 1) : name,
      is_selected: knobs.is_multiple ? (i + 1) <= selected : (i + 1) === selected,
      attributes: `id="${name}_${randomName(3)}_${i + 1}"`,
    });
  }

  knobs.items = items;

  return shouldRender(props) ? CivicThemeSingleFilter({
    ...knobs,
    ...generateSlots([
      'content_top',
      'content_bottom',
    ]),
  }) : knobs;
};
