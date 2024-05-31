import CivicThemeTime from './time.twig';
import { dateIsValid, knobText, shouldRender } from '../base.utils';

export default {
  title: 'Base/Time',
  parameters: {
    layout: 'centered',
  },
};

export const Time = (props = {}) => {
  const knobs = {
    start: knobText('Start', '20 Jan 2023 11:00', props.start, props.knobTab),
    end: knobText('End', '21 Jan 2023 15:00', props.end, props.knobTab),
    modifier_class: knobText('Additional classes', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  knobs.start_iso = dateIsValid(knobs.start) ? new Date(knobs.start).toISOString() : null;
  knobs.end_iso = dateIsValid(knobs.end) ? new Date(knobs.end).toISOString() : null;

  return shouldRender(props) ? CivicThemeTime(knobs) : knobs;
};
