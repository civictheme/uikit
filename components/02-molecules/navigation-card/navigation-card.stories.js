import CivicThemeNavigationCard from './navigation-card.twig';
import { generateImage, generateSlots, knobBoolean, knobRadios, knobSelect, knobText, randomUrl, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Molecules/Navigation Card',
  parameters: {
    layout: 'centered',
    wrapperSize: 'medium',
  },
};

export const NavigationCard = (props = {}) => {
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
    title: knobText('Title', 'Navigation card heading which runs across two or three lines', props.navigation_card_title, props.knobTab),
    summary: knobText('Summary', 'Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring.', props.summary, props.knobTab),
    link: knobBoolean('With link', true, props.with_link, props.knobTab) ? {
      url: knobText('Link URL', randomUrl(), props.link_url, props.knobTab),
      is_external: knobBoolean('Link is external', false, props.link_is_external, props.knobTab),
      is_new_window: knobBoolean('Open in a new window', false, props.link_is_new_window, props.knobTab),
    } : null,
    image: knobBoolean('With image', true, props.with_image, props.knobTab) ? {
      url: generateImage(),
      alt: 'Image alt text',
    } : null,
    image_as_icon: knobBoolean('Image as icon', false, props.image_as_icon, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  const iconKnobTab = 'Icon';
  const withIcon = knobBoolean('With icon', false, props.with_icon, props.knobTab);
  const iconKnobs = {
    icon: withIcon ? knobSelect('Icon', Object.values(ICONS), Object.values(ICONS)[0], props.icon, iconKnobTab) : null,
  };

  const combinedKnobs = { ...knobs, ...iconKnobs };

  return shouldRender(props) ? CivicThemeNavigationCard({
    ...combinedKnobs,
    ...generateSlots([
      'image_over',
      'content_top',
      'content_middle',
      'content_bottom',
    ]),
  }) : combinedKnobs;
};
