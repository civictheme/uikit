import DrupalAttribute from 'drupal-attribute';

const template = 'components/02-molecules/next-step/next-step.twig';

describe('Next Steps Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      title: 'Next Steps Title',
      content: 'This is the content of the next steps.',
    });

    expect(c.querySelectorAll('.ct-next-step')).toHaveLength(1);
    expect(c.querySelector('.ct-next-step__title').textContent.trim()).toEqual('Next Steps Title');
    expect(c.querySelector('.ct-next-step__content').textContent.trim()).toEqual('This is the content of the next steps.');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      content_top: 'Top content',
      title: 'Next Steps Title',
      content: 'This is the content of the next steps.',
      link: { text: 'Learn more', url: 'https://example.com', is_new_window: true, is_external: true },
      content_bottom: 'Bottom content',
      theme: 'dark',
      vertical_spacing: 'both',
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'custom-class',
    });

    const element = c.querySelector('.ct-next-step');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('ct-vertical-spacing-inset--both')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('true');

    expect(c.querySelector('.ct-next-step__content-top').textContent.trim()).toEqual('Top content');
    expect(c.querySelector('.ct-next-step__content-bottom').textContent.trim()).toEqual('Bottom content');
    expect(c.querySelector('.ct-next-step__title').textContent.trim()).toContain('Next Steps Title');
    expect(c.querySelector('.ct-next-step__content').textContent.trim()).toEqual('This is the content of the next steps.');

    const link = c.querySelector('.ct-next-step__title__link');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toEqual('https://example.com');
    expect(link.getAttribute('target')).toEqual('_blank');

    assertUniqueCssClasses(c);
  });

  test('does not render when title is empty', async () => {
    const c = await dom(template, {
      title: '',
      content: 'This is the content of the next steps.',
    });

    expect(c.querySelectorAll('.ct-next-step')).toHaveLength(0);
  });

  test('renders with link when provided', async () => {
    const c = await dom(template, {
      title: 'Next Steps Title',
      content: 'This is the content of the next steps.',
      link: { text: 'Learn more', url: 'https://example.com' },
    });

    const link = c.querySelector('.ct-next-step__title__link');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toEqual('https://example.com');

    assertUniqueCssClasses(c);
  });
});
