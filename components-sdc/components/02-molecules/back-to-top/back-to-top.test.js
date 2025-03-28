const template = 'components/02-molecules/back-to-top/back-to-top.twig';

describe('Back to Top Component', () => {
  test('renders correctly', async () => {
    const c = await dom(template);

    expect(c.querySelectorAll('.ct-back-to-top')).toHaveLength(1);
    expect(c.querySelector('.ct-back-to-top').getAttribute('data-component-name')).toEqual('back-to-top');
    expect(c.querySelector('.ct-back-to-top').getAttribute('data-scrollspy')).not.toBeNull();
    expect(c.querySelector('.ct-back-to-top').getAttribute('data-scrollspy-offset')).toEqual('400');

    assertUniqueCssClasses(c);
  });

  test('renders button with correct attributes', async () => {
    const c = await dom(template);

    const button = c.querySelector('.ct-back-to-top__button');
    expect(button.classList.contains('ct-button--link')).toBe(true);
    expect(button.classList.contains('ct-button--primary')).toBe(true);
    expect(button.querySelector('.ct-button__icon')).not.toBeNull();
    expect(button.getAttribute('href')).toEqual('#top');
  });

  test('button contains correct icon', async () => {
    const c = await dom(template);

    const icon = c.querySelector('.ct-button__icon');
    expect(icon).not.toBeNull();
  });
});
