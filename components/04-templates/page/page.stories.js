import { generateSlots, knobBoolean, knobRadios, StoryValues } from '../../00-base/base.utils';
import CivicThemePage from './page.twig';
import { Banner } from '../../03-organisms/banner/banner.stories';
import { Footer } from '../../03-organisms/footer/footer.stories';
import { Header } from '../../03-organisms/header/header.stories';
import { BasicContent } from '../../02-molecules/basic-content/basic-content.stories';
import { SideNavigation } from '../../03-organisms/side-navigation/side-navigation.stories';
import CivicThemeButton from '../../01-atoms/button/button.twig';
import CivicThemeParagraph from '../../01-atoms/paragraph/paragraph.twig';

export default {
  title: 'Templates/Page',
  parameters: {
    layout: 'fullscreen',
  },
};

export const ContentPage = (parentKnobs = {}) => {
  const theme = knobRadios(
    'Theme',
    {
      Light: 'light',
      Dark: 'dark',
    },
    'dark',
    parentKnobs.theme,
    parentKnobs.knobTab,
  );

  const knobs = {
    show_rail_top_left: knobBoolean('Show left top rail', true, parentKnobs.show_rail_top_left, parentKnobs.knobTab),
    show_rail_bottom_left: knobBoolean('Show left bottom rail', true, parentKnobs.show_rail_bottom_left, parentKnobs.knobTab),
    show_rail_top_right: knobBoolean('Show right top rail', false, parentKnobs.show_right_top_rail, parentKnobs.knobTab),
    show_rail_bottom_right: knobBoolean('Show right bottom rail', false, parentKnobs.show_right_bottom_rail, parentKnobs.knobTab),
  };

  const slots = {};

  slots.theme = theme;

  slots.banner = Banner(new StoryValues({
    theme,
    breadcrumb: { count_of_links: 3 },
  }));

  const headerValues = Header(new StoryValues({
    knobTab: 'Header',
    theme,
  }, false));
  slots.header_theme = theme;
  slots.header_top_1 = headerValues.content_top1;
  slots.header_top_2 = headerValues.content_top2;
  slots.header_top_3 = headerValues.content_top3;
  slots.header_middle_1 = headerValues.content_middle1;
  slots.header_middle_2 = headerValues.content_middle2;
  slots.header_middle_3 = headerValues.content_middle3;
  slots.header_bottom_1 = headerValues.content_bottom1;

  slots.content = BasicContent(new StoryValues({
    theme,
  }));
  slots.vertical_spacing = 'both';

  if (knobs.show_rail_top_left) {
    slots.rail_top_left = SideNavigation(new StoryValues({
      theme,
    }));
  }

  if (knobs.show_rail_bottom_left) {
    const button = CivicThemeButton({
      theme,
      text: 'Register',
      type: 'primary',
      kind: 'link',
    });

    let content = '';

    content += CivicThemeParagraph({
      theme,
      allow_html: true,
      content: `<p>Register for events!</p><p>${button}</p>`,
    });

    slots.rail_bottom_left = content;
  }

  if (knobs.show_rail_top_right) {
    slots.rail_top_right = SideNavigation(new StoryValues({
      theme,
    }));
  }

  if (knobs.show_rail_bottom_right) {
    const button = CivicThemeButton({
      theme,
      text: 'Register',
      type: 'primary',
      kind: 'link',
    });

    let content = '';

    content += CivicThemeParagraph({
      theme,
      allow_html: true,
      content: `<p>Register for events!</p><p>${button}</p>`,
    });

    slots.rail_bottom_right = content;
  }

  const footerValues = Footer(new StoryValues({
    theme,
  }, false));

  slots.footer_theme = theme;
  slots.footer_logo = footerValues.logo;
  slots.footer_background_image = footerValues.background_image;
  slots.footer_top_1 = footerValues.content_top1;
  slots.footer_top_2 = footerValues.content_top2;
  slots.footer_middle_1 = footerValues.content_middle1;
  slots.footer_middle_2 = footerValues.content_middle2;
  slots.footer_middle_3 = footerValues.content_middle3;
  slots.footer_middle_4 = footerValues.content_middle4;
  slots.footer_bottom_1 = footerValues.content_bottom1;
  slots.footer_bottom_2 = footerValues.content_bottom2;

  return CivicThemePage({
    ...slots,
    ...generateSlots([
      'header_top_1',
      'header_top_2',
      'header_top_3',
      'header_middle_1',
      'header_middle_2',
      'header_middle_3',
      'header_bottom_1',
      'banner',
      'highlighted',
      'content_top',
      'rail_top_left',
      'rail_top_right',
      'content',
      'rail_bottom_left',
      'rail_bottom_right',
      'is_contained',
      'content_bottom',
      'footer_top_1',
      'footer_top_2',
      'footer_middle_1',
      'footer_middle_2',
      'footer_middle_3',
      'footer_middle_4',
      'footer_bottom_1',
      'footer_bottom_2',
    ]),
  });
};
