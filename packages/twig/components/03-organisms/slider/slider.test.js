const template = 'components/03-organisms/slider/slider.twig';

describe('Slider Component', () => {
  test('renders with only required attributes', async () => {
    const c = await dom(template, {
      slides: '<div class="slide">Slide 1</div>',
    });

    expect(c.querySelectorAll('.ct-slider')).toHaveLength(1);
    expect(c.querySelector('.ct-slider__slides__inner').textContent.trim()).toBe('Slide 1');
    expect(c.querySelector('.ct-slider__controls__previous').textContent.trim()).toBe('Previous');
    expect(c.querySelector('.ct-slider__controls__next').textContent.trim()).toBe('Next');

    assertUniqueCssClasses(c);
  });

  test('renders with all attributes provided', async () => {
    const c = await dom(template, {
      content_top: 'Top Content',
      title: 'Slider Title',
      slides: '<div class="slide">Slide 1</div><div class="slide">Slide 2</div>',
      previous_label: 'Previous Slide',
      next_label: 'Next Slide',
      content_bottom: 'Bottom Content',
      theme: 'dark',
      vertical_spacing: 'both',
      with_background: true,
      attributes: 'data-test="true"',
      modifier_class: 'additional-class',
    });

    expect(c.querySelectorAll('.ct-slider')).toHaveLength(1);
    expect(c.querySelector('.ct-slider').classList).toContain('ct-theme-dark');
    expect(c.querySelector('.ct-slider').classList).toContain('ct-slider--with-background');
    expect(c.querySelector('.ct-slider').classList).toContain('ct-vertical-spacing-inset--both');
    expect(c.querySelector('.ct-slider').classList).toContain('additional-class');
    expect(c.querySelector('.ct-slider__content__top').textContent.trim()).toBe('Top Content');
    expect(c.querySelector('.ct-slider__title').textContent.trim()).toBe('Slider Title');
    expect(c.querySelector('.ct-slider__slides__inner').textContent.trim()).toBe('Slide 1Slide 2');
    expect(c.querySelector('.ct-slider__controls__previous').textContent.trim()).toBe('Previous Slide');
    expect(c.querySelector('.ct-slider__controls__next').textContent.trim()).toBe('Next Slide');
    expect(c.querySelector('.ct-slider__content__bottom').textContent.trim()).toBe('Bottom Content');
    expect(c.querySelector('.ct-slider').getAttribute('data-test')).toBe('true');

    assertUniqueCssClasses(c);
  });

  test('renders without some attributes', async () => {
    const c = await dom(template, {
      content_top: 'Top Content',
      title: 'Slider Title',
      slides: '<div class="slide">Slide 1</div>',
      previous_label: 'Previous Slide',
      next_label: 'Next Slide',
      content_bottom: '',
      theme: 'light',
      vertical_spacing: '',
      with_background: false,
    });

    expect(c.querySelectorAll('.ct-slider')).toHaveLength(1);
    expect(c.querySelector('.ct-slider').classList).toContain('ct-theme-light');
    expect(c.querySelector('.ct-slider').classList).not.toContain('ct-slider--with-background');
    expect(c.querySelector('.ct-slider').classList).not.toContain('ct-vertical-spacing-inset--both');
    expect(c.querySelector('.ct-slider__content__top').textContent.trim()).toBe('Top Content');
    expect(c.querySelector('.ct-slider__title').textContent.trim()).toBe('Slider Title');
    expect(c.querySelector('.ct-slider__slides__inner').textContent.trim()).toBe('Slide 1');
    expect(c.querySelector('.ct-slider__controls__previous').textContent.trim()).toBe('Previous Slide');
    expect(c.querySelector('.ct-slider__controls__next').textContent.trim()).toBe('Next Slide');
    expect(c.querySelector('.ct-slider__content__bottom')).toBeNull();

    assertUniqueCssClasses(c);
  });

  test('does not render when slides are empty', async () => {
    const c = await dom(template, {
      slides: '',
    });

    expect(c.querySelectorAll('.ct-slider')).toHaveLength(0);
  });
});
