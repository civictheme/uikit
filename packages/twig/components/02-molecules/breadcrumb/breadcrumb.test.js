const template = 'components/02-molecules/breadcrumb/breadcrumb.twig';

describe('Breadcrumb Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      links: [
        { text: 'Home', url: '/' },
        { text: 'Category', url: '/category' },
        { text: 'Subcategory', url: '/category/subcategory' },
      ],
    });

    expect(c.querySelectorAll('.ct-breadcrumb')).toHaveLength(1);
    expect(c.querySelector('.ct-breadcrumb__links__link--active').textContent.trim()).toEqual('Subcategory');

    const links = c.querySelectorAll('.ct-breadcrumb__links__link');
    expect(links).toHaveLength(4);

    // Mobile.
    expect(links[0].textContent.trim()).toEqual('Category');

    // Desktop.
    expect(links[1].textContent.trim()).toEqual('Home');
    expect(links[2].textContent.trim()).toEqual('Category');
    expect(links[3].textContent.trim()).toEqual('Subcategory');

    const separators = c.querySelectorAll('.ct-breadcrumb__links__separator');
    expect(separators).toHaveLength(2);

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      links: [
        { text: 'Home', url: '/' },
        { text: 'Category', url: '/category' },
        { text: 'Subcategory', url: '/category/subcategory' },
      ],
      theme: 'dark',
      active_is_link: true,
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
    });

    expect(c.querySelectorAll('.ct-breadcrumb.custom-class.ct-theme-dark')).toHaveLength(1);
    expect(c.querySelector('.ct-breadcrumb').getAttribute('data-test')).toEqual('true');

    const activeLink = c.querySelector('.ct-breadcrumb__links__link--active');
    expect(activeLink.tagName).toEqual('A');
    expect(activeLink.getAttribute('href')).toEqual('/category/subcategory');

    assertUniqueCssClasses(c);
  });

  test('renders without links', async () => {
    const c = await dom(template, {
      links: [],
    });

    expect(c.querySelectorAll('.ct-breadcrumb')).toHaveLength(0);
  });

  test('renders active element as span when active_is_link is false', async () => {
    const c = await dom(template, {
      links: [
        { text: 'Home', url: '/' },
        { text: 'Category', url: '/category' },
        { text: 'Subcategory', url: '/category/subcategory' },
      ],
      active_is_link: false,
    });

    const activeElement = c.querySelector('.ct-breadcrumb__links__link--active');
    expect(activeElement.tagName).toEqual('SPAN');
    expect(activeElement.getAttribute('aria-current')).toEqual('location');

    assertUniqueCssClasses(c);
  });
});
