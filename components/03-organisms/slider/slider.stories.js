import { generateSlots, knobBoolean, knobNumber, knobRadios, knobText, randomLinks, randomTags, shouldRender } from '../../00-base/base.utils';
import { randomSlidesComponent } from './slider.utils';
import './slider';
import CivicThemeSlider from './slider.twig';

export default {
  title: 'Organisms/Slider',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Slider = (parentKnobs = {}) => {
  const theme = knobRadios(
    'Theme',
    {
      Light: 'light',
      Dark: 'dark',
    },
    'light',
    parentKnobs.theme,
    parentKnobs.knobTab,
  );

  const slidesKnobTab = 'Slides';
  const numOfSlides = knobNumber(
    'Number of slides',
    5,
    {
      range: true,
      min: 0,
      max: 10,
      step: 1,
    },
    parentKnobs.number_of_slides,
    slidesKnobTab,
  );

  const slides = randomSlidesComponent(numOfSlides, theme, true, {
    image_position: knobRadios('Image Position', {
      Left: 'left',
      Right: 'right',
    }, 'right', null, slidesKnobTab),
    tags: randomTags(knobNumber(
      'Number of tags',
      2,
      {
        range: true,
        min: 0,
        max: 10,
        step: 1,
      },
      null,
      slidesKnobTab,
    ), true),
    date: knobText('Date', '20 Jan 2023 11:00', null, slidesKnobTab),
    date_end: knobText('End date', '21 Jan 2023 15:00', null, slidesKnobTab),
    links: randomLinks(knobNumber(
      'Number of links',
      2,
      {
        range: true,
        min: 0,
        max: 10,
        step: 1,
      },
      null,
      slidesKnobTab,
    ), 10),
    ...generateSlots([
      'content_top',
      'content_bottom',
    ]),
  }).join(' ');

  const knobs = {
    theme,
    title: knobText('Title', 'Slider title', parentKnobs.title, parentKnobs.knobTab),
    with_background: knobBoolean('With background', false, parentKnobs.with_background, parentKnobs.knobTab),
    vertical_spacing: knobRadios(
      'Vertical spacing',
      {
        None: 'none',
        Top: 'top',
        Bottom: 'bottom',
        Both: 'both',
      },
      'none',
      parentKnobs.vertical_spacing,
      parentKnobs.knobTab,
    ),
    slides,
    previous_label: knobText('Previous Label', 'Previous', parentKnobs.previous_label, parentKnobs.knobTab),
    next_label: knobText('Next Label', 'Next', parentKnobs.next_label, parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab),
    modifier_class: knobText('Additional class', '', parentKnobs.modifier_class, parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemeSlider({
    ...knobs,
    ...generateSlots([
      'content_top',
      'content_bottom',
    ]),
  }) : knobs;
};
