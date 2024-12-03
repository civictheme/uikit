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
  });

  test('Clicking trigger when closed expands the panel', async () => {
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
    require('./collapsible');

    document.querySelector('[data-collapsible-trigger]').click();

    expect(document.querySelector('[data-collapsible-trigger]').getAttribute('aria-expanded')).toEqual('true');
    expect(document.querySelector('[data-collapsible-panel]').getAttribute('aria-hidden')).toEqual('false');

    document.querySelector('[data-collapsible-trigger]').click();

    expect(document.querySelector('[data-collapsible-trigger]').getAttribute('aria-expanded')).toEqual('false');
    expect(document.querySelector('[data-collapsible-panel]').getAttribute('aria-hidden')).toEqual('true');
  });

  test('Renders icons when using icon group', async () => {
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
    require('./collapsible');

    expect(document.querySelectorAll('[data-collapsible-trigger] .ct-text-icon__group')).toHaveLength(1);
    expect(document.querySelector('[data-collapsible-trigger] .ct-text-icon__group').textContent.trim()).toEqual('trigger');
  });
});
