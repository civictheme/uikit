import './flyout';
import CivicThemeFlyout from './flyout.stories.twig';
import { knobBoolean, knobNumber, knobRadios, shouldRender } from '../base.utils';

export default {
  title: 'Base/Flyout',
  parameters: {
    layout: 'centered',
  },
};

export const Flyout = (props = {}) => {
  const knobs = {
    direction: knobRadios(
      'Flyout from',
      {
        Top: 'top',
        Bottom: 'bottom',
        Left: 'left',
        Right: 'right',
      },
      'right',
      props.direction,
      props.knobTab,
    ),
    expanded: knobBoolean('Expanded', false, props.expanded, props.knobTab),
    duration: knobNumber('Duration (ms)', 500, undefined, props.duration, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeFlyout(knobs) : knobs;
};
