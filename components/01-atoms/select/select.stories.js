import { boolean, radios, text } from '@storybook/addon-knobs';
import CivicThemeSelect from './select.twig';
import { generateOptions, randomInt } from '../../00-base/base.stories';

export default {
  title: 'Atoms/Select',
  parameters: {
    layout: 'centered',
  },
};

export const Select = (knobTab) => {
  const generalKnobTab = typeof knobTab === 'string' ? knobTab : 'General';
  const numOfOptions = randomInt(3, 5);

  const generalKnobs = {
    theme: radios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      generalKnobTab,
    ),
    is_multiple: boolean('Is multiple', false, generalKnobTab),
    options: boolean('With options', true, generalKnobTab) ? generateOptions(numOfOptions, (boolean('Options have groups', false, generalKnobTab) ? 'optgroup' : 'option')) : [],
    required: boolean('Required', false, generalKnobTab),
    disabled: boolean('Disabled', false, generalKnobTab),
    has_error: boolean('Has error', false, generalKnobTab),
    attributes: text('Additional attributes', '', generalKnobTab),
    modifier_class: text('Additional classes', '', generalKnobTab),
  };

  return CivicThemeSelect({
    ...generalKnobs,
  });
};
