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
