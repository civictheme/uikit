const template = 'components/03-organisms/header/header.twig';

describe('Header Component', () => {
  test('renders with all attributes provided', async () => {
    const c = await dom(template, {
      theme: 'dark',
      content_top1: 'Top content 1',
      content_top2: 'Top content 2',
      content_top3: 'Top content 3',
      content_middle1: 'Middle content 1',
      content_middle2: 'Middle content 2',
      content_middle3: 'Middle content 3',
      content_bottom1: 'Bottom content 1',
      modifier_class: 'additional-class',
    });

    expect(c.querySelectorAll('.ct-header')).toHaveLength(1);
    expect(c.querySelector('.ct-header').classList).toContain('ct-theme-dark');
    expect(c.querySelector('.ct-header').classList).toContain('additional-class');
    expect(c.querySelector('.ct-header__content-top1').textContent).toContain('Top content 1');
    expect(c.querySelector('.ct-header__content-top2').textContent).toContain('Top content 2');
    expect(c.querySelector('.ct-header__content-top3').textContent).toContain('Top content 3');
    expect(c.querySelector('.ct-header__content-middle1').textContent).toContain('Middle content 1');
    expect(c.querySelector('.ct-header__content-middle2').textContent).toContain('Middle content 2');
    expect(c.querySelector('.ct-header__content-middle3').textContent).toContain('Middle content 3');
    expect(c.querySelector('.ct-header__content-bottom1').textContent).toContain('Bottom content 1');

    assertUniqueCssClasses(c);
  });

  test('renders with some attributes missing', async () => {
    const c = await dom(template, {
      theme: 'light',
      content_top1: 'Top content 1',
      content_top2: '',
      content_top3: '',
      content_middle1: '',
      content_middle2: 'Middle content 2',
      content_middle3: '',
      content_bottom1: 'Bottom content 1',
      modifier_class: '',
    });

    expect(c.querySelectorAll('.ct-header')).toHaveLength(1);
    expect(c.querySelector('.ct-header').classList).toContain('ct-theme-light');
    expect(c.querySelector('.ct-header__content-top1').textContent).toContain('Top content 1');
    expect(c.querySelector('.ct-header__content-top2')).toBeNull();
    expect(c.querySelector('.ct-header__content-top3')).toBeNull();
    expect(c.querySelector('.ct-header__content-middle1')).toBeNull();
    expect(c.querySelector('.ct-header__content-middle2').textContent).toContain('Middle content 2');
    expect(c.querySelector('.ct-header__content-middle3')).toBeNull();
    expect(c.querySelector('.ct-header__content-bottom1').textContent).toContain('Bottom content 1');

    assertUniqueCssClasses(c);
  });

  test('does not render when all slots are empty', async () => {
    const c = await dom(template, {
      theme: 'light',
      content_top1: '',
      content_top2: '',
      content_top3: '',
      content_middle1: '',
      content_middle2: '',
      content_middle3: '',
      content_bottom1: '',
      modifier_class: '',
    });

    expect(c.querySelectorAll('.ct-header')).toHaveLength(0);
  });
});
