import DrupalAttribute from 'drupal-attribute';

const template = 'components/02-molecules/map/map.twig';

describe('Map Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      url: 'https://www.example.com/map',
    });

    expect(c.querySelectorAll('.ct-map')).toHaveLength(1);
    const iframe = c.querySelector('.ct-map__iframe');
    expect(iframe).toBeTruthy();
    expect(iframe.getAttribute('src')).toEqual('https://www.example.com/map');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      content_top: 'Top content',
      address: '123 Main St, Anytown, USA',
      url: 'https://www.example.com/map',
      view_url: 'https://maps.google.com',
      view_text: 'View in Google Maps',
      content_bottom: 'Bottom content',
      theme: 'dark',
      vertical_spacing: 'both',
      with_background: true,
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'custom-class',
    });

    const element = c.querySelector('.ct-map');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('ct-vertical-spacing-inset--both')).toBe(true);
    expect(element.classList.contains('ct-map--with-background')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('true');

    expect(c.querySelector('.ct-map__content-top').textContent.trim()).toEqual('Top content');
    expect(c.querySelector('.ct-map__content-bottom').textContent.trim()).toEqual('Bottom content');

    const iframe = c.querySelector('.ct-map__iframe');
    expect(iframe).toBeTruthy();
    expect(iframe.getAttribute('src')).toEqual('https://www.example.com/map');
    expect(iframe.getAttribute('title')).toEqual('123 Main St, Anytown, USA');

    const link = c.querySelector('.ct-map__link');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toEqual('https://maps.google.com');
    expect(link.textContent.trim()).toContain('View in Google Maps');

    assertUniqueCssClasses(c);
  });

  test('does not render when URL is empty', async () => {
    const c = await dom(template, {
      url: '',
    });

    expect(c.querySelectorAll('.ct-map')).toHaveLength(0);
  });

  test('renders with default view text', async () => {
    const c = await dom(template, {
      url: 'https://www.example.com/map',
      view_url: 'https://maps.google.com',
    });

    const link = c.querySelector('.ct-map__link');
    expect(link).toBeTruthy();
    expect(link.textContent.trim()).toContain('View in Google Maps');

    assertUniqueCssClasses(c);
  });
});
