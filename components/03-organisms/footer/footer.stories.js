import { generateSlots, knobBoolean, knobRadios, knobSelect, knobText, shouldRender, StoryValues } from '../../00-base/base.utils';
import CivicThemeFooter from './footer.twig';
import '../../00-base/responsive/responsive';
import '../../00-base/collapsible/collapsible';
import { Logo } from '../../02-molecules/logo/logo.stories';
import { SocialLinks } from '../social-links/social-links.stories';
import { Navigation } from '../navigation/navigation.stories';
import CivicThemeIcon from '../../00-base/icon/icon.twig';

export default {
  title: 'Organisms/Footer',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Footer = (props = {}) => {
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

  const knobs = {
    theme,
    show_logo: knobBoolean('Show logo', true, props.show_logo, props.knobTab),
    show_social_links: knobBoolean('Show social links', true, props.show_social_links, props.knobTab),
    show_middle_links: knobBoolean('Show middle links', true, props.show_middle_links, props.knobTab),
    show_acknowledgement: knobBoolean('Show acknowledgement', true, props.show_acknowledgement, props.knobTab),
    show_copyright: knobBoolean('Show copyright', true, props.show_copyright, props.knobTab),
    show_background_image: knobBoolean('Show background image', false, props.show_background_image, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
  };

  const slots = {
    content_top1: knobs.show_logo ? Logo(new StoryValues({ theme })) : '',
    content_top2: knobs.show_social_links ? SocialLinks(new StoryValues({
      theme,
      items: [
        {
          title: 'Facebook',
          icon: 'facebook',
          url: 'https://www.facebook.com',
        },
        {
          title: 'X',
          icon: 'x',
          url: 'https://www.twitter.com',
        },
        {
          title: 'Icon with inline SVG',
          // icon_html should take precedence.
          icon_html: CivicThemeIcon({
            symbol: 'linkedin',
            size: 'small',
          }),
          icon: 'linkedin',
          url: 'https://www.linkedin.com',
        },
      ],
    })) : '',
    content_middle1: knobs.show_middle_links ? Navigation(new StoryValues({
      title: 'Services',
      theme,
    })) : '',
    content_middle2: knobs.show_middle_links ? Navigation(new StoryValues({
      title: 'About us',
      theme,
    })) : '',
    content_middle3: knobs.show_middle_links ? Navigation(new StoryValues({
      title: 'Help',
      theme,
    })) : '',
    content_middle4: knobs.show_middle_links ? Navigation(new StoryValues({
      title: 'Resources',
      theme,
    })) : '',
    content_bottom1: knobs.show_acknowledgement ? '<div class="ct-footer__acknowledgement ct-text-regular">We acknowledge the traditional owners of the country throughout Australia and their continuing connection to land, sea and community. We pay our respect to them and their cultures and to the elders past and present.</div>' : '',
    content_bottom2: knobs.show_copyright ? '<div class="copyright ct-text-regular">©Commonwealth of Australia</div>' : '',
  };

  if (knobs.show_background_image) {
    slots.background_image = BACKGROUNDS[knobSelect('Background', Object.keys(BACKGROUNDS), Object.keys(BACKGROUNDS)[0], props.background_image, props.knobTab)];
  }

  return shouldRender(props) ? CivicThemeFooter({
    ...slots,
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
  }) : slots;
};
