import CivicThemeButton from './button.twig';
import './button';
import { knobBoolean, knobRadios, knobSelect, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Button',
  parameters: {
    layout: 'centered',
  },
};

export const Button = (props = {}) => {
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
    text: knobText(
      'Text',
      'Button text',
      props.text,
      props.knobTab,
    ),
    type: knobRadios(
      'Type',
      {
        Primary: 'primary',
        Secondary: 'secondary',
        Tertiary: 'tertiary',
        None: '',
      },
      'primary',
      props.type,
      props.knobTab,
    ),
    size: knobRadios(
      'Size',
      {
        Large: 'large',
        Regular: 'regular',
        Small: 'small',
        None: '',
      },
      'regular',
      props.size,
      props.knobTab,
    ),
    kind: knobRadios(
      'Kind',
      {
        Button: 'button',
        Link: 'link',
        Reset: 'reset',
        Submit: 'submit',
      },
      'button',
      props.kind,
      props.knobTab,
    ),
  };

  if (knobs.kind === 'link') {
    knobs.url = knobText('URL', 'http://example.com', props.url, props.knobTab);
    knobs.is_new_window = knobBoolean('Open in a new window', false, props.is_new_window, props.knobTab);
  }

  knobs.is_disabled = knobBoolean('Disabled', false, props.is_disabled, props.knobTab);
  knobs.is_external = knobBoolean('Is external', false, props.is_external, props.knobTab);
  knobs.is_raw_text = knobBoolean('Allow HTML in text', false, props.is_raw_text, props.knobTab);
  knobs.modifier_class = knobText('Additional class', '', props.modifier_class, props.knobTab);
  knobs.attributes = knobText('Additional attributes', '', props.attributes, props.knobTab);

  const withIcon = knobBoolean('With icon', false, props.with_icon, props.knobTab);

  const iconKnobTab = 'Icon';
  const iconKnobs = {
    icon: withIcon ? knobSelect('Icon', Object.values(ICONS), Object.values(ICONS)[0], props.icon, iconKnobTab) : null,
    icon_placement: withIcon ? knobRadios(
      'Position',
      {
        Before: 'before',
        After: 'after',
      },
      'after',
      props.icon_position,
      iconKnobTab,
    ) : null,
  };

  const combinedKnobs = { ...knobs, ...iconKnobs };

  return shouldRender(props) ? CivicThemeButton(combinedKnobs) : combinedKnobs;
};
