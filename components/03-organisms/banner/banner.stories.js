import { generateImage, generateSlots, knobBoolean, knobRadios, knobSelect, knobText, KnobValue, objectFromArray, shouldRender, StoryValues } from '../../00-base/base.utils';
import { Breadcrumb } from '../../02-molecules/breadcrumb/breadcrumb.stories';
import CivicThemeBanner from './banner.twig';
import CivicThemeParagraph from '../../01-atoms/paragraph/paragraph.twig';
import CivicThemeButton from '../../01-atoms/button/button.twig';
import CivicThemeNavigationCard from '../../02-molecules/navigation-card/navigation-card.twig';
import CivicThemeGrid from '../../00-base/grid/grid.twig';

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

  const title = knobText('Title', 'Providing visually engaging digital experiences', props.title, props.knobTab);

  const showBgImage = knobBoolean('Show background image', true, props.show_background_image, props.knobTab);

  const knobs = {
    theme,
    title,
    background_image: showBgImage ? knobSelect('Background image', Object.keys(BACKGROUNDS), Object.keys(BACKGROUNDS)[0], props.background_image, 'Background') : '',
    background_image_blend_mode: showBgImage ? knobSelect(
      'Blend mode',
      objectFromArray(SCSS_VARIABLES['ct-background-blend-modes']),
      'multiply',
      props.background_image_blend_mode,
      'Background',
    ) : null,
    show_featured_image: knobBoolean('Show featured image', true, props.show_featured_image, props.knobTab),
    is_decorative: knobBoolean('Decorative', true, props.is_decorative, props.knobTab),
    show_site_section: knobBoolean('Show site section', true, props.show_site_section, props.knobTab),
    show_breadcrumb: knobBoolean('Show breadcrumb', true, props.show_breadcrumb, props.knobTab),
    show_content_text: knobBoolean('Show content text', true, props.show_content_text, props.knobTab),
    show_content_below: knobBoolean('Show content below', false, props.show_content_below, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
  };

  const slots = {
    title: knobs.title,
    theme,
    is_decorative: knobs.is_decorative,
    modifier_class: knobs.modifier_class,
  };

  if (knobs.background_image) {
    slots.background_image = {
      url: BACKGROUNDS[knobs.background_image],
      alt: knobText('Alt text', 'Background image alt text', props.background_image_alt_text, 'Background'),
    };
    slots.background_image_blend_mode = knobs.background_image_blend_mode;
  }

  if (knobs.show_featured_image) {
    slots.featured_image = {
      url: generateImage(0),
      alt: 'Featured image alt text',
    };
  }

  if (knobs.show_site_section) {
    slots.site_section = 'Site section name';
  }

  if (knobs.show_breadcrumb) {
    slots.breadcrumb = Breadcrumb(new StoryValues({
      theme,
      count_of_links: new KnobValue(),
      knobTab: 'Breadcrumb',
    }, false, props.breadcrumb));
  }

  if (knobs.show_content_text) {
    const button = CivicThemeButton({
      theme,
      text: 'Learn about our mission',
      type: 'primary',
      kind: 'link',
    });

    let content = '';

    content += CivicThemeParagraph({
      theme,
      allow_html: true,
      content: `<p>Government grade set of high quality design themes that are accessible, inclusive and provide a consistent digital experience for your citizen. </p><p>${button}</p>`,
    });

    slots.content = content;
  }

  if (knobs.show_content_below) {
    let contentBelow = '';

    const cards = [];
    for (let i = 0; i < 4; i++) {
      cards.push(CivicThemeNavigationCard({
        theme,
        title: 'Register for a workshop',
        summary: 'Optional summary in the breakdown of tasks.',
        icon: 'mortarboard',
      }));
    }

    contentBelow = CivicThemeGrid({
      theme,
      column_count: 4,
      items: cards,
    });

    slots.content_below = contentBelow;
  }

  return shouldRender(props) ? CivicThemeBanner({
    ...slots,
    ...generateSlots([
      'content_top1',
      'content_top2',
      'content_top3',
      'content_middle',
      'content',
      'content_bottom',
    ]),
  }) : slots;
};
