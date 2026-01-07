import DrupalAttribute from 'drupal-attribute';

const template = 'components/00-base/datetime/datetime.twig';

describe('Datetime Component', () => {
  test('does not render when start time is empty', async () => {
    const c = await dom(template, {
      start: '',
    });

    expect(c.querySelectorAll('.ct-datetime')).toHaveLength(0);
  });

  test('renders with start time only', async () => {
    const c = await dom(template, {
      start: '2023-06-15T08:00',
      start_iso: '2023-06-15T08:00:00Z',
    });

    expect(c.querySelectorAll('.ct-datetime')).toHaveLength(1);
    expect(c.querySelector('.ct-timestamp__start').getAttribute('datetime')).toEqual('2023-06-15T08:00:00Z');
    expect(c.querySelector('.ct-timestamp__start').textContent.trim()).toEqual('2023-06-15T08:00');

    assertUniqueCssClasses(c);
  });

  test('renders with start and end time', async () => {
    const c = await dom(template, {
      start: '2023-06-15T08:00',
      start_iso: '2023-06-15T08:00:00Z',
      end: '2023-06-15T17:00',
      end_iso: '2023-06-15T17:00:00Z',
    });

    expect(c.querySelectorAll('.ct-datetime')).toHaveLength(1);
    expect(c.querySelector('.ct-timestamp__start').getAttribute('datetime')).toEqual('2023-06-15T08:00:00Z');
    expect(c.querySelector('.ct-timestamp__start').textContent.trim()).toEqual('2023-06-15T08:00');
    expect(c.querySelector('.ct-timestamp__end').getAttribute('datetime')).toEqual('2023-06-15T17:00:00Z');
    expect(c.querySelector('.ct-timestamp__end').textContent.trim()).toEqual('2023-06-15T17:00');

    assertUniqueCssClasses(c);
  });

  test('renders with custom attributes and classes', async () => {
    const c = await dom(template, {
      start: '2023-06-15T08:00',
      start_iso: '2023-06-15T08:00:00Z',
      modifier_class: 'custom-class',
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
    });

    expect(c.querySelectorAll('.ct-datetime.custom-class')).toHaveLength(1);
    expect(c.querySelector('.ct-datetime').getAttribute('data-test')).toEqual('true');
    expect(c.querySelector('.ct-timestamp__start').getAttribute('datetime')).toEqual('2023-06-15T08:00:00Z');
    expect(c.querySelector('.ct-timestamp__start').textContent.trim()).toEqual('2023-06-15T08:00');

    assertUniqueCssClasses(c);
  });

  test('strips HTML tags from attribute values', async () => {
    const c = await dom(template, {
      start: '<b>2023-06-15T08:00</b>',
      start_iso: '<i>2023-06-15T08:00:00Z</i>',
      end: '<b>2023-06-15T17:00</b>',
      end_iso: '<i>2023-06-15T17:00:00Z</i>',
    });

    expect(c.querySelector('.ct-timestamp__start').getAttribute('datetime')).toEqual('2023-06-15T08:00:00Z');
    expect(c.querySelector('.ct-timestamp__start').innerHTML.trim()).toEqual('<b>2023-06-15T08:00</b>');
    expect(c.querySelector('.ct-timestamp__end').getAttribute('datetime')).toEqual('2023-06-15T17:00:00Z');
    expect(c.querySelector('.ct-timestamp__end').innerHTML.trim()).toEqual('<b>2023-06-15T17:00</b>');

    assertUniqueCssClasses(c);
  });
});
