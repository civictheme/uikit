const template = 'components/03-organisms/mobile-navigation/mobile-navigation.twig';

describe('Mobile Navigation Component', () => {
  test('renders with only required attributes', async () => {
    const c = await dom(template, {
      top_menu: [
        { title: 'Home', url: '/', is_external: false },
      ],
    });

    expect(c.querySelectorAll('.ct-mobile-navigation')).toHaveLength(1);
    expect(c.querySelector('.ct-mobile-navigation__content_top')).toBeNull();
    expect(c.querySelector('.ct-mobile-navigation__content_bottom')).toBeNull();

    const topMenuItems = c.querySelectorAll('.ct-mobile-navigation__top-menu .ct-menu__item__link');
    expect(topMenuItems).toHaveLength(1);
    expect(topMenuItems[0].textContent.trim()).toBe('Home');

    expect(c.querySelectorAll('.ct-mobile-navigation__bottom-menu .ct-menu__item__link')).toHaveLength(0);

    assertUniqueCssClasses(c);
  });

  test('renders with all attributes provided', async () => {
    const c = await dom(template, {
      theme: 'dark',
      content_top: 'Top Content',
      content_bottom: 'Bottom Content',
      top_menu: [
        { title: 'Home', url: '/', is_external: false },
        { title: 'About', url: '/about', is_external: false },
      ],
      bottom_menu: [
        { title: 'Contact', url: '/contact', is_external: false },
        { title: 'Help', url: '/help', is_external: false },
      ],
      modifier_class: 'additional-class',
    });

    expect(c.querySelectorAll('.ct-mobile-navigation')).toHaveLength(1);
    expect(c.querySelector('.ct-mobile-navigation').classList).toContain('ct-theme-dark');
    expect(c.querySelector('.ct-mobile-navigation').classList).toContain('additional-class');
    expect(c.querySelector('.ct-mobile-navigation__content_top').textContent.trim()).toBe('Top Content');
    expect(c.querySelector('.ct-mobile-navigation__content_bottom').textContent.trim()).toBe('Bottom Content');

    const topMenuItems = c.querySelectorAll('.ct-mobile-navigation__top-menu .ct-menu__item__link');
    expect(topMenuItems).toHaveLength(2);
    expect(topMenuItems[0].textContent.trim()).toBe('Home');
    expect(topMenuItems[1].textContent.trim()).toBe('About');

    const bottomMenuItems = c.querySelectorAll('.ct-mobile-navigation__bottom-menu .ct-menu__item__link');
    expect(bottomMenuItems).toHaveLength(2);
    expect(bottomMenuItems[0].textContent.trim()).toBe('Contact');
    expect(bottomMenuItems[1].textContent.trim()).toBe('Help');

    assertUniqueCssClasses(c);
  });

  test('renders with some attributes missing', async () => {
    const c = await dom(template, {
      theme: 'light',
      content_top: '',
      content_bottom: '',
      top_menu: [],
      bottom_menu: [],
      modifier_class: '',
    });

    expect(c.querySelectorAll('.ct-mobile-navigation')).toHaveLength(1);
    expect(c.querySelector('.ct-mobile-navigation').classList).toContain('ct-theme-light');
    expect(c.querySelector('.ct-mobile-navigation__content_top')).toBeNull();
    expect(c.querySelector('.ct-mobile-navigation__content_bottom')).toBeNull();
    expect(c.querySelectorAll('.ct-mobile-navigation__top-menu .ct-menu__item__link')).toHaveLength(0);
    expect(c.querySelectorAll('.ct-mobile-navigation__bottom-menu .ct-menu__item__link')).toHaveLength(0);

    assertUniqueCssClasses(c);
  });

  test('renders correctly when only top menu is provided', async () => {
    const c = await dom(template, {
      theme: 'light',
      content_top: '',
      content_bottom: '',
      top_menu: [
        { title: 'Home', url: '/', is_external: false },
        { title: 'About', url: '/about', is_external: false },
      ],
      bottom_menu: [],
      modifier_class: '',
    });

    expect(c.querySelectorAll('.ct-mobile-navigation')).toHaveLength(1);
    expect(c.querySelector('.ct-mobile-navigation').classList).toContain('ct-theme-light');
    expect(c.querySelector('.ct-mobile-navigation__content_top')).toBeNull();
    expect(c.querySelector('.ct-mobile-navigation__content_bottom')).toBeNull();

    const topMenuItems = c.querySelectorAll('.ct-mobile-navigation__top-menu .ct-menu__item__link');
    expect(topMenuItems).toHaveLength(2);
    expect(topMenuItems[0].textContent.trim()).toBe('Home');
    expect(topMenuItems[1].textContent.trim()).toBe('About');

    expect(c.querySelectorAll('.ct-mobile-navigation__bottom-menu .ct-menu__item__link')).toHaveLength(0);

    assertUniqueCssClasses(c);
  });

  test('renders correctly when only bottom menu is provided', async () => {
    const c = await dom(template, {
      theme: 'light',
      content_top: '',
      content_bottom: '',
      top_menu: [],
      bottom_menu: [
        { title: 'Contact', url: '/contact', is_external: false },
        { title: 'Help', url: '/help', is_external: false },
      ],
      modifier_class: '',
    });

    expect(c.querySelectorAll('.ct-mobile-navigation')).toHaveLength(1);
    expect(c.querySelector('.ct-mobile-navigation').classList).toContain('ct-theme-light');
    expect(c.querySelector('.ct-mobile-navigation__content_top')).toBeNull();
    expect(c.querySelector('.ct-mobile-navigation__content_bottom')).toBeNull();

    expect(c.querySelectorAll('.ct-mobile-navigation__top-menu .ct-menu__item__link')).toHaveLength(0);

    const bottomMenuItems = c.querySelectorAll('.ct-mobile-navigation__bottom-menu .ct-menu__item__link');
    expect(bottomMenuItems).toHaveLength(2);
    expect(bottomMenuItems[0].textContent.trim()).toBe('Contact');
    expect(bottomMenuItems[1].textContent.trim()).toBe('Help');

    assertUniqueCssClasses(c);
  });

  test('does not render when all attributes are empty', async () => {
    const c = await dom(template, {});

    expect(c.querySelectorAll('.ct-mobile-navigation__content_top')).toHaveLength(0);
    expect(c.querySelectorAll('.ct-mobile-navigation__content_bottom')).toHaveLength(0);
    expect(c.querySelectorAll('.ct-mobile-navigation__top-menu-wrapper')).toHaveLength(0);
    expect(c.querySelectorAll('.ct-mobile-navigation__bottom-menu-wrapper')).toHaveLength(0);
  });
});
