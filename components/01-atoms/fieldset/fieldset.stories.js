import { knobBoolean, knobNumber, knobRadios, knobText, shouldRender } from '../../00-base/storybook/storybook.utils';
import CivicThemeFieldset from './fieldset.twig';
import { randomFields } from '../../02-molecules/field/field.utils';

export default {
  title: 'Atoms/Form Controls/Fieldset',
  parameters: {
    layout: 'centered',
  },
};

export const Fieldset = (parentKnobs = {}) => {
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
    legend: knobText('Legend', 'Fieldset legend', parentKnobs.legend, parentKnobs.knobTab),
    description: knobText('Description', 'Fieldset example description', parentKnobs.description, parentKnobs.knobTab),
    message: knobText('Message', '', parentKnobs.message, parentKnobs.knobTab),
    message_type: knobRadios(
      'Type',
      {
        Error: 'error',
        Information: 'information',
        Warning: 'warning',
        Success: 'success',
      },
      'error',
      parentKnobs.message_type,
      parentKnobs.knobTab,
    ),
    is_required: knobBoolean('Required', true, parentKnobs.is_required, parentKnobs.knobTab),
    modifier_class: knobText('Additional class', '', parentKnobs.modifier_class, parentKnobs.knobTab),
  };

  const numOfElements = knobNumber(
    'Number of form elements',
    1,
    {
      range: true,
      min: 0,
      max: 10,
      step: 1,
    },
    parentKnobs.number_of_form_elements,
    parentKnobs.knobTab,
  );

  const combinedKnobs = {
    ...knobs,
    fields: randomFields(numOfElements, knobs.theme, true).join(''),
  };

  return shouldRender(parentKnobs) ? CivicThemeFieldset(combinedKnobs) : combinedKnobs;
};
