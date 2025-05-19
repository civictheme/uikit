const template = 'components/02-molecules/service-card/service-card.twig';

describe('Service Card Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      title: 'Service Card Title',
      links: [
        { text: 'Link 1', url: 'https://example.com/link1' },
        { text: 'Link 2', url: 'https://example.com/link2' },
      ],
    });

    expect(c.querySelectorAll('.ct-service-card')).toHaveLength(1);
    expect(c.querySelector('.ct-service-card__title').textContent.trim()).toEqual('Service Card Title');

    const links = c.querySelectorAll('.ct-service-card__links .ct-link');
    expect(links).toHaveLength(2);
    expect(links[0].textContent.trim()).toEqual('Link 1');
    expect(links[0].getAttribute('href')).toEqual('https://example.com/link1');
    expect(links[1].textContent.trim()).toEqual('Link 2');
    expect(links[1].getAttribute('href')).toEqual('https://example.com/link2');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      content_top: 'Top content',
      title: 'Service Card Title',
      links: [
        { text: 'Link 1', url: 'https://example.com/link1', is_new_window: true, is_external: true },
        { text: 'Link 2', url: 'https://example.com/link2' },
      ],
      content_bottom: 'Bottom content',
      theme: 'dark',
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
    });

    const element = c.querySelector('.ct-service-card');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('true');

    expect(c.querySelector('.ct-service-card__content-top').textContent.trim()).toEqual('Top content');
    expect(c.querySelector('.ct-service-card__content-bottom').textContent.trim()).toEqual('Bottom content');
    expect(c.querySelector('.ct-service-card__title').textContent.trim()).toEqual('Service Card Title');

    const links = c.querySelectorAll('.ct-service-card__links .ct-link');
    expect(links).toHaveLength(2);
    expect(links[0].textContent.trim()).toContain('Link 1');
    expect(links[0].getAttribute('href')).toEqual('https://example.com/link1');
    expect(links[0].getAttribute('target')).toEqual('_blank');
    expect(links[1].textContent.trim()).toEqual('Link 2');
    expect(links[1].getAttribute('href')).toEqual('https://example.com/link2');

    assertUniqueCssClasses(c);
  });

  test('does not render when title is empty', async () => {
    const c = await dom(template, {
      title: '',
      links: [
        { text: 'Link 1', url: 'https://example.com/link1' },
        { text: 'Link 2', url: 'https://example.com/link2' },
      ],
    });

    expect(c.querySelectorAll('.ct-service-card')).toHaveLength(0);
  });

  test('renders with content slots', async () => {
    const c = await dom(template, {
      content_top: 'Top content',
      title: 'Service Card Title',
      links: [
        { text: 'Link 1', url: 'https://example.com/link1' },
        { text: 'Link 2', url: 'https://example.com/link2' },
      ],
      content_bottom: 'Bottom content',
    });

    expect(c.querySelector('.ct-service-card__content-top').textContent.trim()).toEqual('Top content');
    expect(c.querySelector('.ct-service-card__content-bottom').textContent.trim()).toEqual('Bottom content');

    assertUniqueCssClasses(c);
  });
});
