import DrupalAttribute from 'drupal-attribute';

const template = 'components/02-molecules/callout/callout.twig';

describe('Callout Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      content: 'This is the main content of the callout.',
    });

    expect(c.querySelectorAll('.ct-callout')).toHaveLength(1);
    expect(c.querySelector('.ct-callout__content').textContent.trim()).toEqual('This is the main content of the callout.');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      content_top: 'Top content',
      title: 'Callout Title',
      content: 'This is the main content of the callout.',
      links: [
        { text: 'Link 1', url: 'https://example.com', is_new_window: true, is_external: true },
        { text: 'Link 2', url: 'https://example.com' },
      ],
      content_bottom: 'Bottom content',
      theme: 'dark',
      vertical_spacing: 'both',
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'custom-class',
    });

    const element = c.querySelector('.ct-callout');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('ct-vertical-spacing-inset--both')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('true');

    expect(c.querySelector('.ct-callout__content-top').textContent.trim()).toEqual('Top content');
    expect(c.querySelector('.ct-callout__title').textContent.trim()).toEqual('Callout Title');
    expect(c.querySelector('.ct-callout__content').textContent.trim()).toEqual('This is the main content of the callout.');
    expect(c.querySelector('.ct-callout__content-bottom').textContent.trim()).toEqual('Bottom content');

    const links = c.querySelectorAll('.ct-callout__links .ct-button');
    expect(links).toHaveLength(2);
    expect(links[0].textContent.trim()).toContain('Link 1');
    expect(links[0].getAttribute('href')).toEqual('https://example.com');
    expect(links[0].getAttribute('target')).toEqual('_blank');
    expect(links[1].textContent.trim()).toContain('Link 2');
    expect(links[1].getAttribute('href')).toEqual('https://example.com');

    assertUniqueCssClasses(c);
  });

  test('renders with multiple links', async () => {
    const c = await dom(template, {
      links: [
        { text: 'Link 1', url: 'https://example.com' },
        { text: 'Link 2', url: 'https://example.com' },
        { text: 'Link 3', url: 'https://example.com' },
      ],
    });

    const links = c.querySelectorAll('.ct-callout__links .ct-button');
    expect(links).toHaveLength(3);
    expect(links[0].textContent.trim()).toEqual('Link 1');
    expect(links[1].textContent.trim()).toEqual('Link 2');
    expect(links[2].textContent.trim()).toEqual('Link 3');

    assertUniqueCssClasses(c);
  });
});
