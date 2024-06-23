const template = 'components/03-organisms/footer/footer.twig';

describe('Footer Component', () => {
  test('renders with all attributes provided', async () => {
    const c = await dom(template, {
      theme: 'dark',
      content_top1: 'Top content 1',
      content_top2: 'Top content 2',
      content_middle1: 'Middle content 1',
      content_middle2: 'Middle content 2',
      content_middle3: 'Middle content 3',
      content_middle4: 'Middle content 4',
      content_bottom1: 'Bottom content 1',
      content_bottom2: 'Bottom content 2',
      background_image: 'path/to/image.jpg',
      modifier_class: 'additional-class',
    });

    expect(c.querySelectorAll('.ct-footer')).toHaveLength(1);
    expect(c.querySelector('.ct-footer').classList).toContain('ct-theme-dark');
    expect(c.querySelector('.ct-footer').classList).toContain('additional-class');
    expect(c.querySelector('.ct-footer__top__content-top1').textContent).toBe('Top content 1');
    expect(c.querySelector('.ct-footer__top__content-top2').textContent).toBe('Top content 2');
    expect(c.querySelector('.ct-footer__middle__content-middle1').textContent).toBe('Middle content 1');
    expect(c.querySelector('.ct-footer__middle__content-middle2').textContent).toBe('Middle content 2');
    expect(c.querySelector('.ct-footer__middle__content-middle3').textContent).toBe('Middle content 3');
    expect(c.querySelector('.ct-footer__middle__content-middle4').textContent).toBe('Middle content 4');
    expect(c.querySelector('.ct-footer__bottom__content-bottom1').textContent).toBe('Bottom content 1');
    expect(c.querySelector('.ct-footer__bottom__content-bottom2').textContent).toBe('Bottom content 2');
    expect(c.querySelector('.ct-footer').getAttribute('style')).toContain('background-image: url(\'path/to/image.jpg\')');

    assertUniqueCssClasses(c);
  });

  test('renders with some attributes missing', async () => {
    const c = await dom(template, {
      theme: 'light',
      content_top1: 'Top content 1',
      content_top2: '',
      content_middle1: '',
      content_middle2: 'Middle content 2',
      content_middle3: '',
      content_middle4: '',
      content_bottom1: 'Bottom content 1',
      content_bottom2: '',
      background_image: '',
      modifier_class: '',
    });

    expect(c.querySelectorAll('.ct-footer')).toHaveLength(1);
    expect(c.querySelector('.ct-footer').classList).toContain('ct-theme-light');
    expect(c.querySelector('.ct-footer__top__content-top1').textContent).toBe('Top content 1');
    expect(c.querySelector('.ct-footer__top__content-top2')).toBeNull();
    expect(c.querySelector('.ct-footer__middle__content-middle1')).toBeNull();
    expect(c.querySelector('.ct-footer__middle__content-middle2').textContent).toBe('Middle content 2');
    expect(c.querySelector('.ct-footer__middle__content-middle3')).toBeNull();
    expect(c.querySelector('.ct-footer__middle__content-middle4')).toBeNull();
    expect(c.querySelector('.ct-footer__bottom__content-bottom1').textContent).toBe('Bottom content 1');
    expect(c.querySelector('.ct-footer__bottom__content-bottom2')).toBeNull();

    assertUniqueCssClasses(c);
  });

  test('does not render when all slots are empty', async () => {
    const c = await dom(template, {
      theme: 'light',
      content_top1: '',
      content_top2: '',
      content_middle1: '',
      content_middle2: '',
      content_middle3: '',
      content_middle4: '',
      content_bottom1: '',
      content_bottom2: '',
      background_image: '',
      modifier_class: '',
    });

    expect(c.querySelectorAll('.ct-footer')).toHaveLength(0);
  });
});
