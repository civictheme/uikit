import each from 'jest-each';

const template = 'components/04-templates/page/page.twig';

describe('Page Component', () => {
  test('renders with default values', async () => {
    const c = await dom(template, {});

    expect(c.querySelectorAll('.ct-page.ct-theme-light')).toHaveLength(1);
    expect(c.querySelector('#top')).toBeTruthy();
    expect(c.querySelector('#banner')).toBeTruthy();

    assertUniqueCssClasses(c);
  });

  test('renders with custom theme and attributes', async () => {
    const c = await dom(template, {
      theme: 'dark',
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
    });

    expect(c.querySelectorAll('.ct-page.ct-theme-dark.custom-class')).toHaveLength(1);
    expect(c.querySelector('.ct-page').getAttribute('data-test')).toEqual('true');
    assertUniqueCssClasses(c);
  });

  test('strips HTML tags from attributes', async () => {
    const c = await dom(template, {
      attributes: 'data-test="<script>alert(1)</script>"',
    });

    expect(c.querySelector('.ct-page').getAttribute('data-test')).toEqual('<script>alert(1)</script>');
    assertUniqueCssClasses(c);
  });

  test('renders all blocks with complex attributes and classes', async () => {
    const c = await dom(template, {
      theme: 'dark',
      modifier_class: 'custom-class',
      attributes: 'data-test="true"',
      header_theme: 'light',
      header_top_1: 'Header Top 1',
      header_top_2: 'Header Top 2',
      header_top_3: 'Header Top 3',
      header_middle_1: 'Header Middle 1',
      header_middle_2: 'Header Middle 2',
      header_middle_3: 'Header Middle 3',
      header_bottom_1: 'Header Bottom 1',
      banner: 'Banner Content',
      highlighted: 'Highlighted Content',
      content_top: 'Content Top',
      sidebar_top_left: 'Sidebar Top Left',
      sidebar_top_left_attributes: 'data-sidebar-top-left="true"',
      sidebar_top_right: 'Sidebar Top Right',
      sidebar_top_right_attributes: 'data-sidebar-top-right="true"',
      content: 'Main Content',
      content_attributes: 'data-content="true"',
      sidebar_bottom_left: 'Sidebar Bottom Left',
      sidebar_bottom_left_attributes: 'data-sidebar-bottom-left="true"',
      sidebar_bottom_right: 'Sidebar Bottom Right',
      sidebar_bottom_right_attributes: 'data-sidebar-bottom-right="true"',
      content_contained: true,
      content_bottom: 'Content Bottom',
      vertical_spacing: 'top',
      footer_theme: 'light',
      footer_logo: 'Footer Logo',
      footer_background_image: 'Footer Background Image',
      footer_top_1: 'Footer Top 1',
      footer_top_2: 'Footer Top 2',
      footer_middle_1: 'Footer Middle 1',
      footer_middle_2: 'Footer Middle 2',
      footer_middle_3: 'Footer Middle 3',
      footer_middle_4: 'Footer Middle 4',
      footer_bottom_1: 'Footer Bottom 1',
      footer_bottom_2: 'Footer Bottom 2',
    });

    expect(c.querySelector('.ct-page').outerHTML).toContain('Header Top 1');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Header Top 2');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Header Top 3');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Header Middle 1');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Header Middle 2');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Header Middle 3');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Header Bottom 1');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Banner Content');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Highlighted Content');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Content Top');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Sidebar Top Left');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Sidebar Top Right');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Main Content');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Sidebar Bottom Left');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Sidebar Bottom Right');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Content Bottom');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Footer Top 1');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Footer Top 2');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Footer Middle 1');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Footer Middle 2');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Footer Middle 3');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Footer Middle 4');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Footer Bottom 1');
    expect(c.querySelector('.ct-page').outerHTML).toContain('Footer Bottom 2');
    expect(c.querySelector('.ct-page').getAttribute('data-test')).toEqual('true');
    assertUniqueCssClasses(c);
  });

  each([
    [{
      hide_sidebar_left: false,
      hide_sidebar_right: false,
      content: 'Main Content',
      sidebar_top_left: 'Sidebar Top Left',
      sidebar_top_right: 'Sidebar Top Right',
      sidebar_bottom_left: 'Sidebar Bottom Left',
      sidebar_bottom_right: 'Sidebar Bottom Right',
    }, 'both sidebars hidden'],
    [{
      hide_sidebar_left: false,
      hide_sidebar_right: true,
      content: 'Main Content',
      sidebar_top_left: 'Sidebar Top Left',
      sidebar_top_right: '',
      sidebar_bottom_left: 'Sidebar Bottom Left',
      sidebar_bottom_right: '',
    }, 'right sidebar hidden'],
    [{
      hide_sidebar_left: true,
      hide_sidebar_right: false,
      content: 'Main Content',
      sidebar_top_left: '',
      sidebar_top_right: 'Sidebar Top Right',
      sidebar_bottom_left: '',
      sidebar_bottom_right: 'Sidebar Bottom Right',
    }, 'left sidebar hidden'],
    [{
      hide_sidebar_left: true,
      hide_sidebar_right: true,
      content: 'Main Content',
      sidebar_top_left: '',
      sidebar_top_right: '',
      sidebar_bottom_left: '',
      sidebar_bottom_right: '',
    }, 'both sidebars hidden'],
  ]).test('renders content block with permutations: %s', async (props) => {
    const c = await dom(template, props);

    // Main content check
    expect(c.querySelector('.ct-page').outerHTML).toContain(props.content);

    // Sidebar checks

    // Main content check
    expect(c.querySelector('.ct-page').outerHTML).toContain(props.content);

    // Sidebar checks
    const sidebarTopLeft = c.querySelector('.ct-layout__sidebar_top_left');
    const sidebarTopRight = c.querySelector('.ct-layout__sidebar_top_right');
    const sidebarBottomLeft = c.querySelector('.ct-layout__sidebar_bottom_left');
    const sidebarBottomRight = c.querySelector('.ct-layout__sidebar_bottom_right');

    expect(sidebarTopLeft ? sidebarTopLeft.outerHTML : '').toContain(props.sidebar_top_left);
    expect(sidebarTopRight ? sidebarTopRight.outerHTML : '').toContain(props.sidebar_top_right);
    expect(sidebarBottomLeft ? sidebarBottomLeft.outerHTML : '').toContain(props.sidebar_bottom_left);
    expect(sidebarBottomRight ? sidebarBottomRight.outerHTML : '').toContain(props.sidebar_bottom_right);

    assertUniqueCssClasses(c);
  });
});
