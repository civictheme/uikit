import { generateSlots, knobBoolean, knobRadios, knobSelect, knobText, KnobValue, randomUrl, shouldRender } from '../../00-base/base.utils';
import CivicThemeFooter from './footer.stories.twig';
import '../../00-base/responsive/responsive';
import '../../00-base/collapsible/collapsible';
import { generateMenuLinks } from '../../00-base/menu/menu.utils';
import { Logo } from '../../02-molecules/logo/logo.stories';

export default {
  title: 'Organisms/Footer',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Footer = (props = {}) => {
  const knobs = {
    theme: knobRadios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      props.knobTab,
    ),
    modifier_class: knobText('Additional class', '', props.knobTab),
    show_social_links: knobBoolean('Show social links', true, props.knobTab),
    show_middle_links: knobBoolean('Show middle links', true, props.knobTab),
    show_acknowledgement: knobBoolean('Show acknowledgement', true, props.knobTab),
    show_copyright: knobBoolean('Show copyright', true, props.knobTab),
  };

  knobs.logo = knobBoolean('Show logo', true, props.knobTab) ? Logo({
    knobTab: 'Logo',
    theme: knobs.theme,
    url: randomUrl('example2.com'),
    type: new KnobValue(),
    title: new KnobValue('This is a Logo in Footer'),
  }) : null;

  if (knobBoolean('Show background image', false, props.knobTab)) {
    knobs.background_image = BACKGROUNDS[knobSelect('Background', Object.keys(BACKGROUNDS), Object.keys(BACKGROUNDS)[0], props.knobTab)];
  }

  if (knobs.show_middle_links) {
    knobs.links1 = generateMenuLinks(4, 1, false);
    knobs.links2 = generateMenuLinks(4, 1, false);
    knobs.links3 = generateMenuLinks(4, 1, false);
    knobs.links4 = generateMenuLinks(4, 1, false);
  }

  return shouldRender(props) ? CivicThemeFooter({
    ...knobs,
    ...generateSlots([
      'content_top1',
      'content_top2',
      'content_middle1',
      'content_middle2',
      'content_middle3',
      'content_middle4',
      'content_bottom1',
      'content_bottom2',
    ]),
  }) : knobs;
};
