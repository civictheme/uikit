import { generateImage, generateSlots, knobBoolean, knobRadios, knobSelect, knobText, KnobValue, objectFromArray, shouldRender } from '../../00-base/base.utils';
import CivicThemeBannerExample from './banner.stories.twig';
import { Breadcrumb } from '../../02-molecules/breadcrumb/breadcrumb.stories';

export default {
  title: 'Organisms/Banner',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Banner = (props = {}) => {
  const theme = knobRadios(
    'Theme',
    {
      Light: 'light',
      Dark: 'dark',
    },
    'dark',
    props.theme,
    props.knobTab,
  );

  const withBgImage = knobBoolean('With background image', true, props.with_background_image, props.knobTab);

  const knobs = {
    theme,
    title: knobText('Title', 'Providing visually engaging digital experiences', props.title, props.knobTab),
    background_image: withBgImage ? BACKGROUNDS[knobSelect('Background', Object.keys(BACKGROUNDS), Object.keys(BACKGROUNDS)[0], props.background_image, 'Background')] : null,
    background_image_blend_mode: withBgImage ? knobSelect(
      'Blend mode',
      objectFromArray(SCSS_VARIABLES['ct-background-blend-modes']),
      SCSS_VARIABLES['ct-background-blend-modes'][0],
      props.blend_mode,
      'Background Image',
    ) : null,
    featured_image: knobBoolean('With featured image', true, props.with_featured_image, props.knobTab) ? {
      url: generateImage(0),
      alt: 'Featured image alt text',
    } : null,
    is_decorative: knobBoolean('Decorative', true, props.is_decorative, props.knobTab),
    site_section: knobBoolean('With site section', true, props.site_section, props.knobTab) ? 'Site section name' : '',
    show_content_text: knobBoolean('With content text', true, props.show_content_text, props.knobTab),
    show_content_below: knobBoolean('With content below', false, props.show_content_below, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
  };

  knobs.breadcrumb = knobBoolean('With breadcrumb', true, props.with_breadcrumb, props.knobTab) ? Breadcrumb('Breadcrumb', {
    theme: knobs.theme,
    modifier_class: new KnobValue('ct-banner__breadcrumb'),
  }) : '';

  return shouldRender(props) ? CivicThemeBannerExample({
    ...knobs,
    ...generateSlots([
      'content_top1',
      'content_top2',
      'content_top3',
      'content_middle',
      'content',
      'content_bottom',
    ]),
  }) : knobs;
};
