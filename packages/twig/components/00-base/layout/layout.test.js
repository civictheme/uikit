import DrupalAttribute from 'drupal-attribute';

const template = 'components/00-base/layout/layout.twig';

describe('Layout Component', () => {
  test('renders with default values', async () => {
    const c = await dom(template, {
      content: 'Main content',
    });

    expect(c.querySelectorAll('.ct-layout')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-layout .container-fluid')).toHaveLength(1);
    expect(c.querySelector('.ct-layout__main').textContent.trim()).toEqual('Main content');

    assertUniqueCssClasses(c);
  });

  test('renders with sidebar top left', async () => {
    const c = await dom(template, {
      content: 'Main content',
      sidebar_top_left: 'Top left sidebar',
    });

    expect(c.querySelectorAll('.ct-layout__sidebar_top_left')).toHaveLength(1);
    expect(c.querySelector('.ct-layout__sidebar_top_left').textContent.trim()).toEqual('Top left sidebar');
    assertUniqueCssClasses(c);
  });

  test('renders with sidebar top right', async () => {
    const c = await dom(template, {
      content: 'Main content',
      sidebar_top_right: 'Top right sidebar',
    });

    expect(c.querySelectorAll('.ct-layout__sidebar_top_right')).toHaveLength(1);
    expect(c.querySelector('.ct-layout__sidebar_top_right').textContent.trim()).toEqual('Top right sidebar');
    assertUniqueCssClasses(c);
  });

  test('renders with sidebar bottom left', async () => {
    const c = await dom(template, {
      content: 'Main content',
      sidebar_bottom_left: 'Bottom left sidebar',
    });

    expect(c.querySelectorAll('.ct-layout__sidebar_bottom_left')).toHaveLength(1);
    expect(c.querySelector('.ct-layout__sidebar_bottom_left').textContent.trim()).toEqual('Bottom left sidebar');
    assertUniqueCssClasses(c);
  });

  test('renders with sidebar bottom right', async () => {
    const c = await dom(template, {
      content: 'Main content',
      sidebar_bottom_right: 'Bottom right sidebar',
    });

    expect(c.querySelectorAll('.ct-layout__sidebar_bottom_right')).toHaveLength(1);
    expect(c.querySelector('.ct-layout__sidebar_bottom_right').textContent.trim()).toEqual('Bottom right sidebar');
    assertUniqueCssClasses(c);
  });

  test('renders with all sidebars and content sections', async () => {
    const c = await dom(template, {
      content_top: 'Top content',
      content: 'Main content',
      content_bottom: 'Bottom content',
      sidebar_top_left: 'Top left sidebar',
      sidebar_top_right: 'Top right sidebar',
      sidebar_bottom_left: 'Bottom left sidebar',
      sidebar_bottom_right: 'Bottom right sidebar',
    });

    expect(c.querySelectorAll('.ct-layout__sidebar_top_left')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-layout__sidebar_top_right')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-layout__sidebar_bottom_left')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-layout__sidebar_bottom_right')).toHaveLength(1);
    expect(c.querySelector('.ct-layout__main').textContent.trim()).toEqual('Main content');
    expect(c.querySelector('.ct-layout__sidebar_top_left').textContent.trim()).toEqual('Top left sidebar');
    expect(c.querySelector('.ct-layout__sidebar_top_right').textContent.trim()).toEqual('Top right sidebar');
    expect(c.querySelector('.ct-layout__sidebar_bottom_left').textContent.trim()).toEqual('Bottom left sidebar');
    expect(c.querySelector('.ct-layout__sidebar_bottom_right').textContent.trim()).toEqual('Bottom right sidebar');
    expect(c.querySelector('.ct-layout').innerHTML).toContain('Top content');
    expect(c.querySelector('.ct-layout').innerHTML).toContain('Bottom content');

    assertUniqueCssClasses(c);
  });

  test('hides sidebars when specified', async () => {
    const c = await dom(template, {
      content: 'Main content',
      sidebar_top_left: 'Top left sidebar',
      sidebar_top_right: 'Top right sidebar',
      sidebar_bottom_left: 'Bottom left sidebar',
      sidebar_bottom_right: 'Bottom right sidebar',
      hide_sidebar_left: true,
      hide_sidebar_right: true,
    });

    expect(c.querySelectorAll('.ct-layout .container-fluid')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-layout__sidebar_top_left')).toHaveLength(0);
    expect(c.querySelectorAll('.ct-layout__sidebar_top_right')).toHaveLength(0);
    expect(c.querySelectorAll('.ct-layout__sidebar_bottom_left')).toHaveLength(0);
    expect(c.querySelectorAll('.ct-layout__sidebar_bottom_right')).toHaveLength(0);
    expect(c.querySelector('.ct-layout').classList).toContain('ct-layout--no-sidebar-left');
    expect(c.querySelector('.ct-layout').classList).toContain('ct-layout--no-sidebar-right');

    assertUniqueCssClasses(c);
  });

  test('hides sidebars when specified - contained', async () => {
    const c = await dom(template, {
      content: 'Main content',
      sidebar_top_left: 'Top left sidebar',
      sidebar_top_right: 'Top right sidebar',
      sidebar_bottom_left: 'Bottom left sidebar',
      sidebar_bottom_right: 'Bottom right sidebar',
      hide_sidebar_left: true,
      hide_sidebar_right: true,
      is_contained: true,
    });

    expect(c.querySelectorAll('.ct-layout .container')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-layout__sidebar_top_left')).toHaveLength(0);
    expect(c.querySelectorAll('.ct-layout__sidebar_top_right')).toHaveLength(0);
    expect(c.querySelectorAll('.ct-layout__sidebar_bottom_left')).toHaveLength(0);
    expect(c.querySelectorAll('.ct-layout__sidebar_bottom_right')).toHaveLength(0);
    expect(c.querySelector('.ct-layout').classList).toContain('ct-layout--no-sidebar-left');
    expect(c.querySelector('.ct-layout').classList).toContain('ct-layout--no-sidebar-right');

    assertUniqueCssClasses(c);
  });

  test('only main - contained', async () => {
    const c = await dom(template, {
      content: 'Main content',
      is_contained: true,
    });

    expect(c.querySelectorAll('.ct-layout .container')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('only main - not contained', async () => {
    const c = await dom(template, {
      content: 'Main content',
      is_contained: false,
    });

    expect(c.querySelectorAll('.ct-layout .container-fluid')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders with custom attributes and classes', async () => {
    const c = await dom(template, {
      content: 'Main content',
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'custom-modifier',
    });

    expect(c.querySelectorAll('.ct-layout.custom-modifier')).toHaveLength(1);
    expect(c.querySelector('.ct-layout').getAttribute('data-test')).toEqual('true');
    assertUniqueCssClasses(c);
  });
});
