import CivicThemeSkipLink from './skip-link.twig';
import { knobRadios, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Organisms/Skip Link',
  parameters: {
    layout: 'fullscreen',
  },
};

export const SkipLink = (props = {}) => {
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
    text: knobText('Text', 'Skip to main content', props.text, props.knobTab),
    url: knobText('URL', '#main-content', props.url, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
  };

  return shouldRender(props)
    ? `${CivicThemeSkipLink(knobs)}<div class="docs-container docs-container--large">Press TAB on the keyboard for the Skip Link to appear</div>`
    : knobs;
};
