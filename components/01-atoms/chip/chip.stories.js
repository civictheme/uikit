import CivicThemeChip from './chip.twig';
import './chip';
import './chip.event.stories';
import { knobBoolean, knobRadios, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Chip',
  parameters: {
    layout: 'centered',
  },
};

export const Chip = (props = {}) => {
  const theme = knobRadios(
    'Theme',
    {
      Light: 'light',
      Dark: 'dark',
    },
    'light',
    props.theme,
    props.knobTab,
  );

  const size = knobRadios(
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
  );

  const kind = knobRadios(
    'Kind',
    {
      Default: 'default',
      Input: 'input',
    },
    'default',
    props.chip_kind,
    props.knobTab,
  );

  // Keep props above to preserve order.
  const knobs = {
    theme,
    kind,
    size,
    is_multiple: (kind === 'input') ? knobBoolean('Is multiple', false, props.is_multiple, props.knobTab) : null,
    is_selected: (kind === 'input') ? knobBoolean('Is selected', false, props.is_selected, props.knobTab) : null,
    content: knobText('Chip label', 'Chip label', props.content, props.knobTab),
    modifier_class: knobText('Additional classes', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeChip(knobs) : knobs;
};
