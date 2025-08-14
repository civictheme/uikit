const template = 'components/02-molecules/snippet/snippet.twig';

describe('Snippet Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      title: 'Snippet Title',
      summary: 'This is the summary of the snippet.',
    });

    expect(c.querySelectorAll('.ct-snippet')).toHaveLength(1);
    expect(c.querySelector('.ct-snippet__title').textContent.trim()).toEqual('Snippet Title');
    expect(c.querySelector('.ct-snippet__summary').textContent.trim()).toEqual('This is the summary of the snippet.');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      content_top: 'Top content',
      title: 'Snippet Title',
      summary: 'This is the summary of the snippet.',
      content_middle: 'Middle content',
      content_bottom: 'Bottom content',
      link: {
        text: 'Read more',
        url: 'https://example.com/read-more',
        is_new_window: true,
        is_external: true,
      },
      tags: ['Tag1', 'Tag2'],
      theme: 'dark',
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
    });

    const element = c.querySelector('.ct-snippet');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('true');

    expect(c.querySelector('.ct-snippet__content-top').textContent.trim()).toEqual('Top content');
    expect(c.querySelector('.ct-snippet__content-bottom').textContent.trim()).toEqual('Bottom content');
    expect(c.querySelector('.ct-snippet__title').textContent.trim()).toContain('Snippet Title');
    expect(c.querySelector('.ct-snippet__summary').textContent.trim()).toEqual('This is the summary of the snippet.');
    expect(c.querySelector('.ct-snippet__content-middle').textContent.trim()).toEqual('Middle content');

    const link = c.querySelector('.ct-snippet__title-link');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toEqual('https://example.com/read-more');
    expect(link.getAttribute('target')).toEqual('_blank');

    const tags = c.querySelectorAll('.ct-snippet__tags .ct-tag');
    expect(tags).toHaveLength(2);
    expect(tags[0].textContent.trim()).toEqual('Tag1');
    expect(tags[1].textContent.trim()).toEqual('Tag2');

    assertUniqueCssClasses(c);
  });

  test('does not render when title is empty', async () => {
    const c = await dom(template, {
      title: '',
    });

    expect(c.querySelectorAll('.ct-snippet')).toHaveLength(0);
  });

  test('renders with link and tags', async () => {
    const c = await dom(template, {
      title: 'Snippet Title',
      link: {
        text: 'Read more',
        url: 'https://example.com/read-more',
      },
      tags: ['Tag1', 'Tag2'],
    });

    const link = c.querySelector('.ct-snippet__title-link');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toEqual('https://example.com/read-more');

    const tags = c.querySelectorAll('.ct-snippet__tags .ct-tag');
    expect(tags).toHaveLength(2);
    expect(tags[0].textContent.trim()).toEqual('Tag1');
    expect(tags[1].textContent.trim()).toEqual('Tag2');

    assertUniqueCssClasses(c);
  });

  test('renders with content slots', async () => {
    const c = await dom(template, {
      content_top: 'Top content',
      title: 'Snippet Title',
      content_middle: 'Middle content',
      content_bottom: 'Bottom content',
    });

    expect(c.querySelector('.ct-snippet__content-top').textContent.trim()).toEqual('Top content');
    expect(c.querySelector('.ct-snippet__content-bottom').textContent.trim()).toEqual('Bottom content');
    expect(c.querySelector('.ct-snippet__title').textContent.trim()).toEqual('Snippet Title');
    expect(c.querySelector('.ct-snippet__content-middle').textContent.trim()).toEqual('Middle content');

    assertUniqueCssClasses(c);
  });
});
