const template = 'components/02-molecules/tooltip/tooltip.twig';

describe('Tooltip Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      content: 'Tooltip content',
    });

    expect(c.querySelectorAll('.ct-tooltip')).toHaveLength(1);
    expect(c.querySelector('.ct-tooltip__description__inner').textContent.trim()).toEqual('Tooltip content');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      content: 'Tooltip content',
      theme: 'dark',
      text: 'Tooltip text',
      title: 'Tooltip title',
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
      icon: 'call',
    });

    const element = c.querySelector('.ct-tooltip');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('true');
    expect(c.querySelector('.ct-tooltip__button').getAttribute('aria-label')).toEqual('Tooltip title');
    expect(c.querySelector('.ct-tooltip__button').getAttribute('title')).toEqual('Tooltip title');
    expect(c.querySelector('.ct-tooltip__description__inner').textContent.trim()).toEqual('Tooltip content');
    expect(c.querySelector('.ct-icon')).not.toBeNull();
    assertUniqueCssClasses(c);
  });

  test('does not render when content is empty', async () => {
    const c = await dom(template, {
      content: '',
    });

    expect(c.querySelectorAll('.ct-tooltip')).toHaveLength(0);
  });

  test('renders with icon and icon size', async () => {
    const c = await dom(template, {
      content: 'Tooltip content',
      icon: 'call',
      icon_size: 'large',
    });

    expect(c.querySelector('.ct-icon.ct-icon--size-large')).not.toBeNull();

    assertUniqueCssClasses(c);
  });
});
