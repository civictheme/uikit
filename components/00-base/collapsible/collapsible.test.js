describe('Collapsible utility', () => {

  beforeEach(() => {
    // jsdom doesn't support innerText by default.
    // https://github.com/jsdom/jsdom/issues/1245
    Object.defineProperty(HTMLDivElement.prototype, 'innerText', {
      get: function() { return this.textContent; },
      set: function(value) { this.textContent = value; }
    });
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

    require('./collapsible.js');

    expect(document.querySelectorAll('[data-collapsible-trigger] .ct-text-icon__group')).toHaveLength(1);
    expect(document.querySelector('[data-collapsible-trigger] .ct-text-icon__group').textContent.trim()).toEqual('trigger');
  });
});
