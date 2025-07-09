const template = 'components/02-molecules/event-card/event-card.twig';

describe('Event Card Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      title: 'Event Title',
      summary: 'This is a summary of the event.',
      date: '2023-01-01 12:00',
      date_iso: '2023-01-01T12:00:00Z',
      location: 'Event Location',
    });

    expect(c.querySelectorAll('.ct-event-card')).toHaveLength(1);
    expect(c.querySelector('.ct-event-card__title').textContent.trim()).toEqual('Event Title');
    expect(c.querySelector('.ct-event-card__summary').textContent.trim()).toEqual('This is a summary of the event.');
    expect(c.querySelector('.ct-event-card__location').textContent.trim()).toEqual('Event Location');
    expect(c.querySelector('.ct-event-card__date')).toBeTruthy();

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      content_top: 'Top content',
      image_over: 'Image over content',
      content_middle: 'Middle content',
      content_bottom: 'Bottom content',
      image: { url: 'https://example.com/image.jpg', alt: 'Image description' },
      title: 'Event Title',
      summary: 'This is a summary of the event.',
      date: '2023-01-01 12:00',
      date_iso: '2023-01-01T12:00:00Z',
      location: 'Event Location',
      link: { url: 'https://example.com' },
      tags: ['Tag 1', 'Tag 2'],
      theme: 'dark',
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
    });

    const element = c.querySelector('.ct-event-card');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('true');

    expect(c.querySelector('.ct-event-card__content-top').textContent.trim()).toEqual('Top content');
    expect(c.querySelector('.ct-event-card__image__over').textContent.trim()).toEqual('Image over content');
    expect(c.querySelector('.ct-event-card__middle').textContent.trim()).toEqual('Middle content');
    expect(c.querySelector('.ct-event-card__content-bottom').textContent.trim()).toEqual('Bottom content');
    expect(c.querySelector('.ct-event-card__title').textContent.trim()).toEqual('Event Title');
    expect(c.querySelector('.ct-event-card__summary').textContent.trim()).toEqual('This is a summary of the event.');
    expect(c.querySelector('.ct-event-card__location').textContent.trim()).toEqual('Event Location');

    const tags = c.querySelectorAll('.ct-event-card__tags .ct-tag');
    expect(tags).toHaveLength(2);
    expect(tags[0].textContent.trim()).toEqual('Tag 1');
    expect(tags[1].textContent.trim()).toEqual('Tag 2');

    const image = c.querySelector('.ct-event-card__image img');
    expect(image).toBeTruthy();
    expect(image.getAttribute('src')).toEqual('https://example.com/image.jpg');
    expect(image.getAttribute('alt')).toEqual('Image description');

    const titleLink = c.querySelector('.ct-event-card__title__link');
    expect(titleLink).toBeTruthy();
    expect(titleLink.getAttribute('href')).toEqual('https://example.com');

    assertUniqueCssClasses(c);
  });
});
