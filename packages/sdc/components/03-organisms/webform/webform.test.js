import DrupalAttribute from 'drupal-attribute';

const template = 'components/03-organisms/webform/webform.twig';

describe('Webform Component', () => {
  test('renders with only required attributes', async () => {
    const c = await dom(template, {
      referenced_webform: '<form>Webform content</form>',
    });

    expect(c.querySelectorAll('.ct-webform')).toHaveLength(1);
    expect(c.querySelector('.ct-webform').textContent.trim()).toBe('Webform content');

    assertUniqueCssClasses(c);
  });

  test('renders with all attributes provided', async () => {
    const c = await dom(template, {
      referenced_webform: '<form>Webform content</form>',
      theme: 'dark',
      vertical_spacing: 'both',
      with_background: true,
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'additional-class',
    });

    expect(c.querySelectorAll('.ct-webform')).toHaveLength(1);
    expect(c.querySelector('.ct-webform').classList).toContain('ct-theme-dark');
    expect(c.querySelector('.ct-webform').classList).toContain('ct-vertical-spacing-inset--both');
    expect(c.querySelector('.ct-webform').classList).toContain('ct-webform--with-background');
    expect(c.querySelector('.ct-webform').classList).toContain('additional-class');
    expect(c.querySelector('.ct-webform').textContent.trim()).toBe('Webform content');
    expect(c.querySelector('.ct-webform').getAttribute('data-test')).toBe('true');

    assertUniqueCssClasses(c);
  });

  test('renders without additional attributes and classes', async () => {
    const c = await dom(template, {
      referenced_webform: '<form>Webform content</form>',
      theme: 'light',
      vertical_spacing: '',
      with_background: false,
      modifier_class: '',
    });

    expect(c.querySelectorAll('.ct-webform')).toHaveLength(1);
    expect(c.querySelector('.ct-webform').classList).toContain('ct-theme-light');
    expect(c.querySelector('.ct-webform').classList).not.toContain('ct-webform--with-background');
    expect(c.querySelector('.ct-webform').classList).not.toContain('ct-vertical-spacing-inset--both');
    expect(c.querySelector('.ct-webform').textContent.trim()).toBe('Webform content');

    assertUniqueCssClasses(c);
  });

  test('does not render when referenced_webform is empty', async () => {
    const c = await dom(template, {
      referenced_webform: '',
    });

    expect(c.querySelectorAll('.ct-webform')).toHaveLength(0);
  });
});
