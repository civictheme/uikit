import DrupalAttribute from 'drupal-attribute';

const template = 'components/01-atoms/popover/popover.twig';

describe('Popover Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      trigger: {
        text: 'Sample Trigger',
      },
      content: '<span>Sample content</span>',
    });

    expect(c.querySelectorAll('.ct-popover')).toHaveLength(1);
    expect(c.querySelector('.ct-popover__link').textContent.trim()).toEqual('Sample Trigger');
    expect(c.querySelector('.ct-popover__content').innerHTML.trim()).toContain('<span>Sample content</span>');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      trigger: {
        text: 'Sample Trigger',
        url: 'https://example.com',
        is_new_window: true,
        is_external: true,
      },
      content: 'Sample content',
      group: 'sample-group',
      theme: 'dark',
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'custom-class',
    });

    expect(c.querySelectorAll('.ct-popover.custom-class.ct-theme-dark')).toHaveLength(1);
    expect(c.querySelector('.ct-popover__link').textContent.trim()).toContain('Sample Trigger');
    expect(c.querySelector('.ct-popover__link').getAttribute('href')).toEqual('https://example.com');
    expect(c.querySelector('.ct-popover__link').getAttribute('target')).toEqual('_blank');
    expect(c.querySelector('.ct-popover').getAttribute('data-test')).toEqual('true');
    expect(c.querySelector('.ct-popover__content').textContent.trim()).toEqual('Sample content');
    expect(c.querySelector('.ct-popover').getAttribute('data-collapsible-group')).toEqual('sample-group');

    assertUniqueCssClasses(c);
  });

  test('does not render when content is empty', async () => {
    const c = await dom(template, {
      trigger: {
        text: 'Sample Trigger',
      },
      content: '',
    });

    expect(c.querySelectorAll('.ct-popover')).toHaveLength(0);
  });
});
