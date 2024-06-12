import { knobBoolean, knobNumber, knobRadios, knobText, randomFields, shouldRender } from '../../00-base/base.utils';
import CivicThemeFieldset from './fieldset.twig';

export default {
  title: 'Atoms/Form Controls/Fieldset',
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
    children: randomFields(numOfElements, knobs.theme, true).join(''),
  };

  return shouldRender(parentKnobs)
    ? `<div class="container"><div class="row"><div class="col-xxs-12">${CivicThemeFieldset(combinedKnobs)}</div></div></div>`
    : combinedKnobs;
};
