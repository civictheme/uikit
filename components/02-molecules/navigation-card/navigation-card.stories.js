import CivicThemeNavigationCard from './navigation-card.twig';
import { generateImage, generateSlots, knobBoolean, knobRadios, knobSelect, knobText, randomUrl, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Molecules/Navigation Card',
  parameters: {
    layout: 'centered',
    wrapperSize: 'medium',
    wrapperIsContainer: true,
    wrapperIsResizable: true,
  },
};

export const NavigationCard = (parentKnobs = {}) => {
  const knobs = {
    theme: knobRadios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      parentKnobs.theme,
      parentKnobs.knobTab,
    ),
    title: knobText('Title', 'Navigation card heading which runs across two or three lines', parentKnobs.navigation_card_title, parentKnobs.knobTab),
    summary: knobText('Summary', 'Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring.', parentKnobs.summary, parentKnobs.knobTab),
    link: knobBoolean('With link', true, parentKnobs.with_link, parentKnobs.knobTab) ? {
      url: knobText('Link URL', randomUrl(), parentKnobs.link_url, parentKnobs.knobTab),
      is_external: knobBoolean('Link is external', false, parentKnobs.link_is_external, parentKnobs.knobTab),
      is_new_window: knobBoolean('Open in a new window', false, parentKnobs.link_is_new_window, parentKnobs.knobTab),
    } : null,
    image: knobBoolean('With image', true, parentKnobs.with_image, parentKnobs.knobTab) ? {
      url: generateImage(),
      alt: 'Image alt text',
    } : null,
    image_as_icon: knobBoolean('Image as icon', false, parentKnobs.image_as_icon, parentKnobs.knobTab),
    modifier_class: knobText('Additional class', '', parentKnobs.modifier_class, parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab),
  };

  const iconKnobTab = 'Icon';
  const withIcon = knobBoolean('With icon', false, parentKnobs.with_icon, parentKnobs.knobTab);
  const iconKnobs = {
    icon: withIcon ? knobSelect('Icon', Object.values(ICONS), Object.values(ICONS)[0], parentKnobs.icon, iconKnobTab) : null,
  };

  const combinedKnobs = { ...knobs, ...iconKnobs };

  return shouldRender(parentKnobs) ? CivicThemeNavigationCard({
    ...combinedKnobs,
    ...generateSlots([
      'image_over',
      'content_top',
      'content_middle',
      'content_bottom',
    ]),
  }) : combinedKnobs;
};
