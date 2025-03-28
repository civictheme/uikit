const template = 'components/02-molecules/tag-list/tag-list.twig';

describe('Tag List Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      tags: ['Tag 1', 'Tag 2', 'Tag 3'],
    });

    expect(c.querySelectorAll('.ct-tag-list')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-tag-list__content .ct-tag')).toHaveLength(3);
    expect(c.querySelectorAll('.ct-tag-list__content .ct-tag')[0].textContent.trim()).toEqual('Tag 1');
    expect(c.querySelectorAll('.ct-tag-list__content .ct-tag')[1].textContent.trim()).toEqual('Tag 2');
    expect(c.querySelectorAll('.ct-tag-list__content .ct-tag')[2].textContent.trim()).toEqual('Tag 3');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      tags: ['Tag 1', 'Tag 2'],
      theme: 'dark',
      vertical_spacing: 'both',
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
      content_top: 'Top content',
      content_bottom: 'Bottom content',
    });

    const element = c.querySelector('.ct-tag-list');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('ct-vertical-spacing--both')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('true');

    expect(c.querySelector('.ct-tag-list__content-top').textContent.trim()).toEqual('Top content');
    expect(c.querySelector('.ct-tag-list__content-bottom').textContent.trim()).toEqual('Bottom content');

    assertUniqueCssClasses(c);
  });

  test('does not render when tags are empty', async () => {
    const c = await dom(template, {
      tags: [],
    });

    expect(c.querySelectorAll('.ct-tag-list')).toHaveLength(0);
  });

  test('renders with content slots', async () => {
    const c = await dom(template, {
      tags: ['Tag 1', 'Tag 2'],
      content_top: 'Top content',
      content_bottom: 'Bottom content',
    });

    expect(c.querySelector('.ct-tag-list__content-top').textContent.trim()).toEqual('Top content');
    expect(c.querySelector('.ct-tag-list__content-bottom').textContent.trim()).toEqual('Bottom content');

    assertUniqueCssClasses(c);
  });
});
