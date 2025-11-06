import DrupalAttribute from 'drupal-attribute';

const template = 'components/00-base/menu/menu.twig';

describe('Menu Component', () => {
  test('renders with default values', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Home',
          url: '/',
        },
        {
          title: 'About',
          url: '/about',
        },
      ],
    });

    expect(c.querySelectorAll('.ct-menu')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-menu__item')).toHaveLength(2);
    expect(c.querySelector('.ct-menu__item--level-0 .ct-menu__item__link').textContent.trim()).toEqual('Home');
    expect(c.querySelector('.ct-menu__item--level-0 .ct-menu__item__link').getAttribute('href')).toEqual('/');
    expect(c.querySelectorAll('.ct-menu__sub-menu')).toHaveLength(0);

    assertUniqueCssClasses(c);
  });

  test('renders with default values - submenu', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Home',
          url: '/',
        },
        {
          title: 'About',
          url: '/about',
        },
        {
          title: 'Services',
          url: '/services',
          below: [
            {
              title: 'Consulting',
              url: '/services/consulting',
            },
            {
              title: 'Development',
              url: '/services/development',
            },
          ],
        },
      ],
    });

    expect(c.querySelectorAll('.ct-menu')).toHaveLength(2);
    expect(c.querySelectorAll('.ct-menu__item')).toHaveLength(5);
    expect(c.querySelector('.ct-menu__item--level-0 .ct-menu__item__link').textContent.trim()).toEqual('Home');
    expect(c.querySelector('.ct-menu__item--level-0 .ct-menu__item__link').getAttribute('href')).toEqual('/');
    expect(c.querySelectorAll('.ct-menu__sub-menu')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders with theme and custom classes', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Home',
          url: '/',
        },
        {
          title: 'About',
          url: '/about',
        },
        {
          title: 'Services',
          url: '/services',
          below: [
            {
              title: 'Consulting',
              url: '/services/consulting',
            },
            {
              title: 'Development',
              url: '/services/development',
            },
          ],
        },
      ],
      theme: 'dark',
      modifier_class: 'custom-modifier',
    });

    expect(c.querySelectorAll('.ct-menu')).toHaveLength(2);
    expect(c.querySelectorAll('.ct-menu.ct-theme-dark.custom-modifier')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-menu__item')).toHaveLength(5);
    expect(c.querySelector('.ct-menu__item--level-0 .ct-menu__item__link').textContent.trim()).toEqual('Home');
    expect(c.querySelector('.ct-menu__item--level-0 .ct-menu__item__link').getAttribute('href')).toEqual('/');
    expect(c.querySelectorAll('.ct-menu__sub-menu')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders collapsible menu', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Home',
          url: '/',
        },
        {
          title: 'About',
          url: '/about',
        },
        {
          title: 'Services',
          url: '/services',
          in_active_trail: true,
          is_expanded: true,
          below: [
            {
              title: 'Consulting',
              url: '/services/consulting',
            },
            {
              title: 'Development',
              url: '/services/development',
            },
          ],
        },
      ],
      is_collapsible: true,
    });

    expect(c.querySelectorAll('.ct-menu')).toHaveLength(2);
    expect(c.querySelectorAll('.ct-menu__item')).toHaveLength(5);
    expect(c.querySelector('.ct-menu__item--level-0 .ct-menu__item__link').textContent.trim()).toEqual('Home');
    expect(c.querySelector('.ct-menu__item--level-0 .ct-menu__item__link').getAttribute('href')).toEqual('/');
    expect(c.querySelectorAll('.ct-menu__sub-menu')).toHaveLength(1);
    expect(c.querySelectorAll('[aria-expanded="true"]')).toHaveLength(2);
    expect(c.querySelectorAll('[aria-expanded="false"]')).toHaveLength(0);

    assertUniqueCssClasses(c);
  });

  test('renders menu items with correct attributes', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Home',
          url: '/',
          attributes: new DrupalAttribute().setAttribute('data-test', 'home'),
        },
        {
          title: 'About',
          url: '/about',
          attributes: new DrupalAttribute().setAttribute('data-test', 'about'),
        },
        {
          title: 'Services',
          url: '/services',
          attributes: new DrupalAttribute().setAttribute('data-test', 'services'),
          below: [
            {
              title: 'Consulting',
              url: '/services/consulting',
              attributes: new DrupalAttribute().setAttribute('data-test', 'consulting'),
            },
            {
              title: 'Development',
              url: '/services/development',
              attributes: new DrupalAttribute().setAttribute('data-test', 'development'),
            },
          ],
        },
      ],
    });

    expect(c.querySelector('[data-test="home"]')).toBeTruthy();
    expect(c.querySelector('[data-test="about"]')).toBeTruthy();
    expect(c.querySelector('[data-test="services"]')).toBeTruthy();
    expect(c.querySelector('[data-test="consulting"]')).toBeTruthy();
    expect(c.querySelector('[data-test="development"]')).toBeTruthy();

    assertUniqueCssClasses(c);
  });

  test('renders menu items with additional attributes', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Home',
          url: '/',
          attributes: new DrupalAttribute().setAttribute('data-test', 'home').setAttribute('data-extra', 'extra-home'),
        },
        {
          title: 'About',
          url: '/about',
          attributes: new DrupalAttribute().setAttribute('data-test', 'about').setAttribute('data-extra', 'extra-about'),
        },
        {
          title: 'Services',
          url: '/services',
          attributes: new DrupalAttribute().setAttribute('data-test', 'services').setAttribute('data-extra', 'extra-services'),
          below: [
            {
              title: 'Consulting',
              url: '/services/consulting',
              attributes: new DrupalAttribute().setAttribute('data-test', 'consulting').setAttribute('data-extra', 'extra-consulting'),
            },
            {
              title: 'Development',
              url: '/services/development',
              attributes: new DrupalAttribute().setAttribute('data-test', 'development').setAttribute('data-extra', 'extra-development'),
            },
          ],
        },
      ],
    });

    expect(c.querySelector('[data-test="home"][data-extra="extra-home"]')).toBeTruthy();
    expect(c.querySelector('[data-test="about"][data-extra="extra-about"]')).toBeTruthy();
    expect(c.querySelector('[data-test="services"][data-extra="extra-services"]')).toBeTruthy();
    expect(c.querySelector('[data-test="consulting"][data-extra="extra-consulting"]')).toBeTruthy();
    expect(c.querySelector('[data-test="development"][data-extra="extra-development"]')).toBeTruthy();

    assertUniqueCssClasses(c);
  });
});

describe('Menu Attribute Handling', () => {
  test('renders with null item attributes', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Home',
          url: '/',
          attributes: null,
        },
      ],
    });

    expect(c.querySelectorAll('.ct-menu__item')).toHaveLength(1);
    expect(c.querySelector('.ct-menu__item__link').textContent.trim()).toEqual('Home');

    assertUniqueCssClasses(c);
  });

  test('renders with undefined item attributes', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Home',
          url: '/',
          attributes: undefined,
        },
      ],
    });

    expect(c.querySelectorAll('.ct-menu__item')).toHaveLength(1);
    expect(c.querySelector('.ct-menu__item__link').textContent.trim()).toEqual('Home');

    assertUniqueCssClasses(c);
  });

  test('renders with null link_attributes', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Home',
          url: '/',
          link_attributes: null,
        },
      ],
    });

    expect(c.querySelectorAll('.ct-menu__item')).toHaveLength(1);
    expect(c.querySelector('.ct-menu__item__link').textContent.trim()).toEqual('Home');

    assertUniqueCssClasses(c);
  });

  test('renders with undefined link_attributes', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Home',
          url: '/',
          link_attributes: undefined,
        },
      ],
    });

    expect(c.querySelectorAll('.ct-menu__item')).toHaveLength(1);
    expect(c.querySelector('.ct-menu__item__link').textContent.trim()).toEqual('Home');

    assertUniqueCssClasses(c);
  });

  test('renders collapsible menu with collapsed item', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Services',
          url: '/services',
          in_active_trail: false,
          is_expanded: false,
          below: [
            {
              title: 'Consulting',
              url: '/services/consulting',
            },
          ],
        },
      ],
      is_collapsible: true,
    });

    expect(c.querySelectorAll('[data-collapsible-collapsed]')).toHaveLength(1);
    expect(c.querySelectorAll('[aria-expanded="false"]')).toHaveLength(2);

    assertUniqueCssClasses(c);
  });

  test('renders collapsible menu with expanded item', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Services',
          url: '/services',
          in_active_trail: true,
          is_expanded: true,
          below: [
            {
              title: 'Consulting',
              url: '/services/consulting',
            },
          ],
        },
      ],
      is_collapsible: true,
    });

    expect(c.querySelectorAll('[data-collapsible-collapsed]')).toHaveLength(0);
    expect(c.querySelectorAll('[aria-expanded="true"]')).toHaveLength(2);

    assertUniqueCssClasses(c);
  });

  test('renders aria-current on deepest active item', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Services',
          url: '/services',
          in_active_trail: true,
          below: [
            {
              title: 'Consulting',
              url: '/services/consulting',
              in_active_trail: true,
            },
          ],
        },
      ],
    });

    expect(c.querySelector('.ct-menu__item--level-1 .ct-menu__item__link').getAttribute('aria-current')).toEqual('page');
    expect(c.querySelector('.ct-menu__item--level-0 .ct-menu__item__link').getAttribute('aria-current')).toBeNull();

    assertUniqueCssClasses(c);
  });

  test('renders aria-current on level 0 when no children are active', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Services',
          url: '/services',
          in_active_trail: true,
          below: [
            {
              title: 'Consulting',
              url: '/services/consulting',
              in_active_trail: false,
            },
          ],
        },
      ],
    });

    expect(c.querySelector('.ct-menu__item--level-0 .ct-menu__item__link').getAttribute('aria-current')).toEqual('page');

    assertUniqueCssClasses(c);
  });

  test('renders menu items with link_attributes', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Home',
          url: '/',
          link_attributes: new DrupalAttribute().setAttribute('data-link', 'home-link'),
        },
        {
          title: 'About',
          url: '/about',
          link_attributes: new DrupalAttribute().setAttribute('data-link', 'about-link'),
        },
      ],
    });

    expect(c.querySelector('[data-link="home-link"]')).toBeTruthy();
    expect(c.querySelector('[data-link="about-link"]')).toBeTruthy();

    assertUniqueCssClasses(c);
  });

  test('renders nested menu with multiple attribute levels', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Services',
          url: '/services',
          attributes: new DrupalAttribute().setAttribute('data-parent', 'services'),
          link_attributes: new DrupalAttribute().setAttribute('data-link', 'services-link'),
          below: [
            {
              title: 'Consulting',
              url: '/services/consulting',
              attributes: new DrupalAttribute().setAttribute('data-child', 'consulting'),
              link_attributes: new DrupalAttribute().setAttribute('data-link', 'consulting-link'),
            },
          ],
        },
      ],
    });

    expect(c.querySelector('[data-parent="services"]')).toBeTruthy();
    expect(c.querySelector('[data-link="services-link"]')).toBeTruthy();
    expect(c.querySelector('[data-child="consulting"]')).toBeTruthy();
    expect(c.querySelector('[data-link="consulting-link"]')).toBeTruthy();

    assertUniqueCssClasses(c);
  });

  test('renders with is_new_window and is_external flags', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'External Link',
          url: 'https://example.com',
          is_new_window: true,
          is_external: true,
        },
      ],
    });

    expect(c.querySelector('.ct-menu__item__link').getAttribute('target')).toEqual('_blank');

    assertUniqueCssClasses(c);
  });

  test('renders collapsible duration attribute', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Services',
          url: '/services',
          below: [
            {
              title: 'Consulting',
              url: '/services/consulting',
            },
          ],
        },
      ],
      is_collapsible: true,
    });

    expect(c.querySelector('[data-collapsible-duration="0"]')).toBeTruthy();

    assertUniqueCssClasses(c);
  });

  test('renders menu with modifier_class on items', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Home',
          url: '/',
          modifier_class: 'custom-item',
        },
      ],
    });

    expect(c.querySelectorAll('.ct-menu__item.custom-item')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders deeply nested menu structure', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Level 0',
          url: '/level0',
          below: [
            {
              title: 'Level 1',
              url: '/level0/level1',
              below: [
                {
                  title: 'Level 2',
                  url: '/level0/level1/level2',
                },
              ],
            },
          ],
        },
      ],
    });

    expect(c.querySelectorAll('.ct-menu__item--level-0')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-menu__item--level-1')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-menu__item--level-2')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders aria-hidden on sub-menu wrapper', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Services',
          url: '/services',
          in_active_trail: false,
          below: [
            {
              title: 'Consulting',
              url: '/services/consulting',
            },
          ],
        },
      ],
      is_collapsible: true,
    });

    expect(c.querySelector('.ct-menu__sub-menu__wrapper').getAttribute('aria-hidden')).toEqual('true');

    assertUniqueCssClasses(c);
  });

  test('renders without aria-hidden when item is in active trail', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Services',
          url: '/services',
          in_active_trail: true,
          below: [
            {
              title: 'Consulting',
              url: '/services/consulting',
            },
          ],
        },
      ],
      is_collapsible: true,
    });

    expect(c.querySelector('.ct-menu__sub-menu__wrapper').getAttribute('aria-hidden')).toEqual('false');

    assertUniqueCssClasses(c);
  });

  test('renders collapsible trigger with title', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Services',
          url: '/services',
          below: [
            {
              title: 'Consulting',
              url: '/services/consulting',
            },
          ],
        },
      ],
      is_collapsible: true,
    });

    expect(c.querySelector('.ct-menu__item__link-trigger').getAttribute('title')).toEqual('Expand Services menu');

    assertUniqueCssClasses(c);
  });

  test('renders with menu_level_modifier_class', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Level 0',
          url: '/level0',
          below: [
            {
              title: 'Level 1',
              url: '/level0/level1',
            },
          ],
        },
      ],
      menu_level_modifier_class: {
        0: 'level-0-class',
        1: 'level-1-class',
      },
    });

    expect(c.querySelectorAll('.ct-menu--level-0.level-0-class')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-menu--level-1.level-1-class')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });
});

describe('Menu Edge Cases', () => {
  test('renders with empty items array', async () => {
    const c = await dom(template, {
      items: [],
    });

    expect(c.querySelectorAll('.ct-menu')).toHaveLength(0);
  });

  test('renders with empty below array', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Services',
          url: '/services',
          below: [],
        },
      ],
    });

    expect(c.querySelectorAll('.ct-menu__item')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-menu__sub-menu')).toHaveLength(0);

    assertUniqueCssClasses(c);
  });

  test('renders with special characters in title', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Services & Solutions <Company>',
          url: '/services',
        },
      ],
    });

    expect(c.querySelector('.ct-menu__item__link').textContent.trim()).toEqual('Services & Solutions <Company>');

    assertUniqueCssClasses(c);
  });

  test('renders with combined attributes, in_active_trail, and is_expanded', async () => {
    const c = await dom(template, {
      items: [
        {
          title: 'Services',
          url: '/services',
          in_active_trail: true,
          is_expanded: true,
          attributes: new DrupalAttribute().setAttribute('data-custom', 'value'),
          link_attributes: new DrupalAttribute().setAttribute('data-link-custom', 'link-value'),
          below: [
            {
              title: 'Consulting',
              url: '/services/consulting',
              in_active_trail: true,
            },
          ],
        },
      ],
      is_collapsible: true,
    });

    expect(c.querySelector('[data-custom="value"]')).toBeTruthy();
    expect(c.querySelector('[data-link-custom="link-value"]')).toBeTruthy();
    expect(c.querySelector('[aria-expanded="true"]')).toBeTruthy();

    assertUniqueCssClasses(c);
  });
});