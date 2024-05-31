import CivicThemeMessage from './message.twig';
import { knobRadios, knobText, randomText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Organisms/Message',
};

export const Message = (props = {}) => {
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
    type: knobRadios(
      'Type',
      {
        Information: 'information',
        Error: 'error',
        Warning: 'warning',
        Success: 'success',
      },
      'information',
      props.type,
      props.knobTab,
    ),
    title: knobText('Title', 'The information on this page is currently being updated.', props.title, props.knobTab),
    description: knobText('Summary', `Message description ${randomText()}`, props.description, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeMessage(knobs) : knobs;
};
