const template = 'components/02-molecules/accordion/accordion.twig';

describe('Accordion Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      panels: [
        { title: 'Panel 1', content: 'Content 1' },
        { title: 'Panel 2', content: 'Content 2' },
      ],
    });

    expect(c.querySelectorAll('.ct-accordion')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-accordion__panels__panel')).toHaveLength(2);
    expect(c.querySelector('.ct-accordion__panels__panel__header__button').textContent.trim()).toEqual('Panel 1');
    expect(c.querySelector('.ct-accordion__panels__panel__content').textContent.trim()).toContain('Content 1');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      content_top: 'Top content',
      expand_all: true,
      panels: [
        { title: 'Panel 1', content: 'Content 1' },
        { title: 'Panel 2', content: 'Content 2', expanded: true },
      ],
      content_bottom: 'Bottom content',
      theme: 'dark',
      with_background: true,
      vertical_spacing: 'both',
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
    });

    expect(c.querySelectorAll('.ct-accordion.custom-class.ct-theme-dark.ct-accordion--with-background.ct-vertical-spacing-inset--both')).toHaveLength(1);
    expect(c.querySelector('.ct-accordion__content-top').textContent.trim()).toEqual('Top content');
    expect(c.querySelector('.ct-accordion__content-bottom').textContent.trim()).toEqual('Bottom content');
    expect(c.querySelectorAll('.ct-accordion__panels__panel')).toHaveLength(2);
    expect(c.querySelector('.ct-accordion__panels__panel__header__button').textContent.trim()).toEqual('Panel 1');
    expect(c.querySelector('.ct-accordion__panels__panel__content').textContent.trim()).toContain('Content 1');
    expect(c.querySelector('.ct-accordion').getAttribute('data-test')).toEqual('true');
    expect(c.querySelector('.ct-accordion__panels__panel__header__button').getAttribute('aria-expanded')).toEqual('true');

    assertUniqueCssClasses(c);
  });

  test('does not render when panels are empty', async () => {
    const c = await dom(template, {
      panels: [],
    });

    expect(c.querySelectorAll('.ct-accordion')).toHaveLength(0);
  });

  test('expands all panels when expand_all is true', async () => {
    const c = await dom(template, {
      expand_all: true,
      panels: [
        { title: 'Panel 1', content: 'Content 1' },
        { title: 'Panel 2', content: 'Content 2' },
      ],
    });

    expect(c.querySelectorAll('.ct-accordion__panels__panel')).toHaveLength(2);
    c.querySelectorAll('.ct-accordion__panels__panel__header__button').forEach((button) => {
      expect(button.getAttribute('aria-expanded')).toEqual('true');
    });
  });

  test('renders individual panels with expanded state', async () => {
    const c = await dom(template, {
      panels: [
        { title: 'Panel 1', content: 'Content 1', expanded: true },
        { title: 'Panel 2', content: 'Content 2' },
      ],
    });

    expect(c.querySelector('.ct-accordion__panels__panel__header__button').getAttribute('aria-expanded')).toEqual('true');
    expect(c.querySelectorAll('.ct-accordion__panels__panel__header__button')[1].getAttribute('aria-expanded')).toEqual('false');
  });
});
