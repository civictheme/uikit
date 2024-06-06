import { generateSlots, knobBoolean, knobRadios, shouldRender, StoryValues } from '../../00-base/base.utils';
import { Logo } from '../../02-molecules/logo/logo.stories';
import CivicThemeHeader from './header.twig';
import { Paragraph } from '../../01-atoms/paragraph/paragraph.stories';
import { Navigation } from '../navigation/navigation.stories';
import { Search } from '../../02-molecules/search/search.stories';
import { MobileNavigation } from '../mobile-navigation/mobile-navigation.stories';

export default {
  title: 'Organisms/Header',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Header = (props = {}) => {
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
    show_slogan: knobBoolean('Show slogan', true, props.show_slogan, props.knobTab),
    show_secondary_navigation: knobBoolean('Show secondary navigation', true, props.show_secondary_navigation, props.knobTab),
    show_logo: knobBoolean('Show logo', true, props.show_logo, props.knobTab),
    show_primary_navigation: knobBoolean('Show primary navigation', true, props.show_primary_navigation, props.knobTab),
    show_search: knobBoolean('With Search', true, props.show_search, props.knobTab),
  };

  let contentTop3 = '';
  if (knobs.show_secondary_navigation) {
    contentTop3 += Navigation(new StoryValues({
      theme,
      title: null,
      type: 'dropdown',
      modifier_class: 'ct-justify-content-end',
    }));
  }

  let contentMiddle3Content = '';
  if (knobs.show_primary_navigation) {
    contentMiddle3Content += Navigation(new StoryValues({
      theme,
      title: null,
      type: 'drawer',
      modifier_class: 'ct-justify-content-end',
    }));

    contentMiddle3Content += Search(new StoryValues({
      modifier_class: 'ct-justify-content-end',
      theme,
    }));

    contentMiddle3Content += MobileNavigation(new StoryValues({ theme }));
  }

  const slots = {
    content_top2: knobs.show_slogan ? Paragraph(new StoryValues({ content: 'A design system by Salsa Digital', theme })) : '',
    content_top3: contentTop3,
    content_middle2: knobs.show_logo ? Logo(new StoryValues({
      theme,
      knobTab: 'Logo',
    })) : '',
    content_middle3: contentMiddle3Content,
  };

  return shouldRender(props) ? CivicThemeHeader({
    ...slots,
    ...generateSlots([
      'content_top1',
      'content_top2',
      'content_top3',
      'content_middle1',
      'content_middle2',
      'content_middle3',
      'content_bottom1',
    ]),
  }) : slots;
};
