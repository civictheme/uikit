import { jest } from '@jest/globals';

describe('Collapsible utility', () => {
  beforeAll(() => {
    // jsdom doesn't support innerText by default.
    // https://github.com/jsdom/jsdom/issues/1245
    Object.defineProperty(HTMLDivElement.prototype, 'innerText', {
      get() {
        return this.textContent;
      },
      set(value) {
        this.textContent = value;
      },
    });
  });

  beforeEach(() => {
    jest.resetModules();
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());
  });

  afterEach(() => {
    window.requestAnimationFrame.mockRestore();
  });

  test('expands when clicking on the trigger', async () => {
    document.body.innerHTML = `
      <div data-collapsible data-collapsible-collapsed data-collapsible-duration="0">
        <div data-collapsible-trigger>
          My trigger
        </div>
        <div data-collapsible-panel>
          My panel
        </div>
      </div>
    `;

    // eslint-disable-next-line global-require
    await import('./collapsible');

    document.querySelector('[data-collapsible-trigger]').click();

    expect(document.querySelector('[data-collapsible-trigger]').getAttribute('aria-expanded')).toEqual('true');
    expect(document.querySelector('[data-collapsible-panel]').getAttribute('aria-hidden')).toEqual('false');

    document.querySelector('[data-collapsible-trigger]').click();

    expect(document.querySelector('[data-collapsible-trigger]').getAttribute('aria-expanded')).toEqual('false');
    expect(document.querySelector('[data-collapsible-panel]').getAttribute('aria-hidden')).toEqual('true');
  });

  test('renders icons when using icon group', async () => {
    document.body.innerHTML = `
      <div data-collapsible data-collapsible-icon-group>
        <div data-collapsible-trigger>
          My trigger
        </div>
        <div data-collapsible-panel>
          My panel
        </div>
      </div>
    `;

    // eslint-disable-next-line global-require
    await import('./collapsible');

    expect(document.querySelectorAll('[data-collapsible-trigger] .ct-text-icon__group')).toHaveLength(1);
    expect(document.querySelector('[data-collapsible-trigger] .ct-text-icon__group').textContent.trim()).toEqual('trigger');
  });

  test('renders no icon correctly when set', async () => {
    document.body.innerHTML = `
      <div data-collapsible>
        <div data-collapsible-trigger>
          My trigger
        </div>
        <div data-collapsible-panel data-collapsible-trigger-no-icon>
          My panel
        </div>
      </div>
    `;

    // eslint-disable-next-line global-require
    await import('./collapsible');

    expect(document.querySelectorAll('.ct-icon')).toHaveLength(0);
  });

  test('renders in a group when set', async () => {
    document.body.innerHTML = `
      <div class="group-a" data-collapsible data-collapsible-collapsed data-collapsible-duration="0" data-collapsible-group="group_test">
        <div data-collapsible-trigger>
          My trigger
        </div>
        <div data-collapsible-panel data-collapsible-trigger-no-icon>
          My panel
        </div>
      </div>
      <div class="group-b" data-collapsible data-collapsible-collapsed data-collapsible-duration="0" data-collapsible-group="group_test">
        <div data-collapsible-trigger>
          My trigger
        </div>
        <div data-collapsible-panel data-collapsible-trigger-no-icon>
          My panel
        </div>
      </div>
    `;

    // eslint-disable-next-line global-require
    await import('./collapsible');

    // Both closed.
    expect(document.querySelector('.group-a [data-collapsible-trigger]').getAttribute('aria-expanded')).toEqual('false');
    expect(document.querySelector('.group-b [data-collapsible-trigger]').getAttribute('aria-expanded')).toEqual('false');

    // Click A and check A opens, B remains closed.
    document.querySelector('.group-a [data-collapsible-trigger]').click();
    expect(document.querySelector('.group-a [data-collapsible-trigger]').getAttribute('aria-expanded')).toEqual('true');
    expect(document.querySelector('.group-b [data-collapsible-trigger]').getAttribute('aria-expanded')).toEqual('false');

    // Click B and check B opens, A closes.
    document.querySelector('.group-b [data-collapsible-trigger]').click();
    expect(document.querySelector('.group-a [data-collapsible-trigger]').getAttribute('aria-expanded')).toEqual('false');
    expect(document.querySelector('.group-b [data-collapsible-trigger]').getAttribute('aria-expanded')).toEqual('true');

    // Click A and check A opens, B closes.
    document.querySelector('.group-a [data-collapsible-trigger]').click();
    expect(document.querySelector('.group-a [data-collapsible-trigger]').getAttribute('aria-expanded')).toEqual('true');
    expect(document.querySelector('.group-b [data-collapsible-trigger]').getAttribute('aria-expanded')).toEqual('false');

    // Click A and check A and B close.
    document.querySelector('.group-a [data-collapsible-trigger]').click();
    expect(document.querySelector('.group-a [data-collapsible-trigger]').getAttribute('aria-expanded')).toEqual('false');
    expect(document.querySelector('.group-b [data-collapsible-trigger]').getAttribute('aria-expanded')).toEqual('false');
  });

  test('renders transition style when using animation', async () => {
    document.body.innerHTML = `
      <div data-collapsible data-collapsible-collapsed data-collapsible-duration="100">
        <div data-collapsible-trigger>
          My trigger
        </div>
        <div data-collapsible-panel>
          My panel
        </div>
      </div>
    `;

    // eslint-disable-next-line global-require
    await import('./collapsible');

    document.querySelector('[data-collapsible-trigger]').click();
    expect(document.querySelector('[data-collapsible-collapsing]')).not.toBe(undefined);
    expect(document.querySelector('[data-collapsible-panel]').style.transition).toEqual(`height 100ms ease-out`);
  });

  test('does not initialize when collapsible is true', async () => {
    document.body.innerHTML = `
      <div data-collapsible="true">
        <div data-collapsible-trigger>
          My trigger
        </div>
        <div data-collapsible-panel>
          My panel
        </div>
      </div>
    `;

    // eslint-disable-next-line global-require
    await import('./collapsible');

    expect(document.querySelector('[data-collapsible-trigger]').getAttribute('aria-expanded')).toEqual(null);
  });

  test('does not initialize when no inner elements available', async () => {
    document.body.innerHTML = `
      <div data-collapsible>
      </div>
    `;

    // eslint-disable-next-line global-require
    await import('./collapsible');

    expect(document.querySelector('[data-collapsible]').getAttribute('data-collapsible')).toEqual('');
  });
});
