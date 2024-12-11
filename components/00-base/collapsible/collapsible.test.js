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
  });

  test('renders an icon', async () => {
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
    await import('./collapsible')

    expect(document.querySelectorAll('.ct-collapsible__icon')).toHaveLength(1);
  });
});
