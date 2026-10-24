import DrupalAttribute from '@civictheme/drupal-attribute';

const template = 'components/01-atoms/horizontal-rule/horizontal-rule.twig';

describe('Horizontal Rule Component', () => {
  test('renders with default attributes', async () => {
    const c = await dom(template, {});

    expect(c.querySelectorAll('hr.ct-horizontal-rule.ct-theme-light')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      theme: 'dark',
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'custom-class',
    });

    expect(c.querySelectorAll('hr.ct-horizontal-rule.ct-theme-dark.custom-class')).toHaveLength(1);
    expect(c.querySelector('.ct-horizontal-rule').getAttribute('data-test')).toEqual('true');

    assertUniqueCssClasses(c);
  });
});
