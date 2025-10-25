import DrupalAttribute from 'drupal-attribute';

const template = 'components/03-organisms/campaign/campaign.twig';

describe('Campaign Component', () => {
  test('renders with attributes', async () => {
    const c = await dom(template, {
      title: 'Campaign Title',
      content: 'This is the main content of the campaign.',
      content_top: 'Top content',
      image: {
        url: 'http://example.com/image.jpg',
        alt: 'Example Image',
      },
      image_position: 'left',
      tags: ['Tag1', 'Tag2'],
      date: '2024-06-19',
      links: [
        { text: 'Link 1', url: 'http://example.com/1', is_new_window: true, is_external: true },
        { text: 'Link 2', url: 'http://example.com/2', is_new_window: false, is_external: false },
      ],
      content_bottom: 'Bottom content',
      theme: 'dark',
      vertical_spacing: 'both',
      modifier_class: 'custom-class',
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
    });

    const element = c.querySelector('.ct-campaign');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('ct-vertical-spacing-inset--both')).toBe(true);
    expect(element.classList.contains('ct-campaign--image-left')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('true');
    expect(element.querySelector('.ct-campaign__content-top').textContent.trim()).toEqual('Top content');
    expect(element.querySelector('.ct-campaign__title').textContent.trim()).toEqual('Campaign Title');
    expect(element.querySelector('.ct-campaign__date').textContent.trim()).toEqual('2024-06-19');
    expect(element.querySelector('.ct-campaign__content').textContent.trim()).toEqual('This is the main content of the campaign.');
    expect(element.querySelector('.ct-campaign__content-bottom').textContent.trim()).toEqual('Bottom content');
    expect(element.querySelector('.ct-campaign__image img').src).toContain('http://example.com/image.jpg');
    expect(element.querySelector('.ct-campaign__image img').alt).toEqual('Example Image');

    const links = element.querySelectorAll('.ct-campaign__links .ct-button');
    expect(links).toHaveLength(2);
    expect(links[0].textContent.trim()).toContain('Link 1');
    expect(links[0].getAttribute('href')).toEqual('http://example.com/1');
    expect(links[0].getAttribute('target')).toEqual('_blank');
    expect(links[1].textContent.trim()).toEqual('Link 2');
    expect(links[1].getAttribute('href')).toEqual('http://example.com/2');
    expect(links[1].getAttribute('target')).toBeNull();
  });

  test('renders with tags', async () => {
    const c = await dom(template, {
      tags: ['Tag1', 'Tag2'],
    });

    const tags = c.querySelectorAll('.ct-campaign__tags .ct-tag');
    expect(tags).toHaveLength(2);
    expect(tags[0].textContent.trim()).toEqual('Tag1');
    expect(tags[1].textContent.trim()).toEqual('Tag2');
  });

  test('renders with image position right', async () => {
    const c = await dom(template, {
      image_position: 'right',
      image: {
        url: 'http://example.com/image.jpg',
        alt: 'Example Image',
      },
    });
    const element = c.querySelector('.ct-campaign');
    expect(element.classList.contains('ct-campaign--image-left')).toBe(false);
    expect(element.classList.contains('ct-campaign--image-right')).toBe(true);
    const imageWrapper = c.querySelector('.ct-campaign__image');
    expect(imageWrapper).not.toBeNull();
    expect(imageWrapper.querySelector('img').src).toContain('http://example.com/image.jpg');
    expect(imageWrapper.querySelector('img').alt).toEqual('Example Image');
  });
});
