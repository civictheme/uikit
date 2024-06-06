import { knobBoolean, knobRadios, knobSelect, knobText, randomUrl, shouldRender } from '../../00-base/base.utils';
import CivicThemeTag from './tag.twig';

export default {
  title: 'Atoms/Tag',
  parameters: {
    layout: 'centered',
  },
};

export const Tag = (parentKnobs = {}) => {
  const knobs = {
    theme: knobRadios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      parentKnobs.knobTab,
    ),
    type: knobRadios(
      'Type',
      {
        Primary: 'primary',
        Secondary: 'secondary',
        Tertiary: 'tertiary',
      },
      'primary',
      parentKnobs.knobTab,
    ),
    content: knobText('Content', 'Tag content', parentKnobs.knobTab),
    modifier_class: knobText('Additional class', '', parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.knobTab),
  };

  const iconKnobTab = 'Icon';
  const withIcon = knobBoolean('With icon', false, parentKnobs.knobTab);
  const iconKnobs = {
    icon: withIcon ? knobSelect('Icon', Object.values(ICONS), Object.values(ICONS)[0], iconKnobTab) : null,
    icon_placement: withIcon ? knobRadios(
      'Position',
      {
        Before: 'before',
        After: 'after',
      },
      'before',
      iconKnobTab,
    ) : null,
  };

  const withLink = knobBoolean('With link', false, parentKnobs.knobTab);

  const linkKnobTab = 'Link';
  const linkKnobs = {
    url: withLink ? knobText('URL', randomUrl(), linkKnobTab) : null,
    is_external: withLink ? knobBoolean('Is external', false, linkKnobTab) : null,
    is_new_window: withLink ? knobBoolean('Open in a new window', false, linkKnobTab) : null,
  };

  const combinedKnobs = { ...knobs, ...iconKnobs, ...linkKnobs };

  return shouldRender(parentKnobs) ? CivicThemeTag(combinedKnobs) : combinedKnobs;
};
