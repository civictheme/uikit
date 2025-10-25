import DrupalAttribute from 'drupal-attribute';

const template = 'components/02-molecules/tabs/tabs.twig';

describe('Tabs Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      panels: [
        { title: 'Tab 1', content: 'Content for Tab 1', id: 'tab1', is_selected: true },
        { title: 'Tab 2', content: 'Content for Tab 2', id: 'tab2', is_selected: false },
      ],
    });

    expect(c.querySelectorAll('.ct-tabs')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-tabs__links a')).toHaveLength(2);
    expect(c.querySelectorAll('.ct-tabs__panels__panel')).toHaveLength(2);

    const selectedPanel = c.querySelector('.ct-tabs__panels__panel.selected');
    expect(selectedPanel).not.toBeNull();
    expect(selectedPanel.getAttribute('id')).toEqual('tab1');
    expect(selectedPanel.textContent.trim()).toEqual('Content for Tab 1');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      panels: [
        { title: 'Tab 1', content: 'Content for Tab 1', id: 'tab1', is_selected: true },
        { title: 'Tab 2', content: 'Content for Tab 2', id: 'tab2', is_selected: false },
      ],
      theme: 'dark',
      vertical_spacing: 'both',
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'custom-class',
    });

    const element = c.querySelector('.ct-tabs');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('ct-vertical-spacing--both')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('true');

    assertUniqueCssClasses(c);
  });

  test('does not render when panels are empty', async () => {
    const c = await dom(template, {
      panels: [],
    });

    expect(c.querySelectorAll('.ct-tabs')).toHaveLength(0);
  });

  test('renders with generated links from panels', async () => {
    const c = await dom(template, {
      panels: [
        { title: 'Tab 1', content: 'Content for Tab 1', id: 'tab1', is_selected: true },
        { title: 'Tab 2', content: 'Content for Tab 2', id: 'tab2', is_selected: false },
      ],
    });

    const links = c.querySelectorAll('.ct-tabs__links a');
    expect(links).toHaveLength(2);

    expect(links[0].getAttribute('href')).toEqual('#tab1-tab');
    expect(links[0].getAttribute('aria-controls')).toEqual('tab1');

    expect(links[1].getAttribute('href')).toEqual('#tab2-tab');
    expect(links[1].getAttribute('aria-controls')).toEqual('tab2');

    assertUniqueCssClasses(c);
  });
});
