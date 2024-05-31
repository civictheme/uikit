import { knobBoolean, knobNumber, knobRadios, knobText, randomFormElements, shouldRender } from '../../00-base/base.utils';
import CivicThemeFieldset from './fieldset.twig';

export default {
  title: 'Atoms/Fieldset',
};

export const Fieldset = (props = {}) => {
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
    legend: knobText('Legend', 'Fieldset legend', props.legend, props.knobTab),
    description: knobText('Description', 'Fieldset example description', props.description, props.knobTab),
    is_required: knobBoolean('Required', true, props.is_required, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
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
    props.number_of_form_elements,
    props.knobTab,
  );

  const combinedKnobs = {
    ...knobs,
    children: randomFormElements(numOfElements, knobs.theme, true).join(''),
  };

  return shouldRender(props)
    ? `<div class="container"><div class="row"><div class="col-xxs-12">${CivicThemeFieldset(combinedKnobs)}</div></div></div>`
    : combinedKnobs;
};
