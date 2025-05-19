describe('global.dom', () => {
  it('should render the template with the provided props', async () => {
    const c = await dom('./tests/__fixtures__/dom.twig', {
      w1: 'Hello',
      w2: 'World',
    });
    expect(c.textContent.trim()).toEqual('Hello World');
    expect(c.querySelector('.hello').textContent).toEqual('Hello');
    expect(c.querySelector('.world').textContent).toEqual('World');
  });
});

describe('assertUniqueCssClasses', () => {
  function elementWithClasses(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div;
  }

  const dataProviderAssertUniqueCssClasses = () => [
    // Test case: No duplicate classes
    {
      description: 'should pass when no duplicate classes are present',
      html: '<div class="a"><span class="b"></span></div>',
      shouldThrow: false,
    },
    // Test case: Duplicate classes in different elements
    {
      description: 'should pass when duplicate classes are in different elements',
      html: '<div class="a"><span class="a"></span></div>',
      shouldThrow: false,
    },
    // Test case: Duplicate classes in the same element
    {
      description: 'should throw when duplicate classes are in the same element',
      html: '<div class="a a"><span class="b"></span></div>',
      shouldThrow: true,
    },
    // Test case: Multiple duplicate classes in the same element
    {
      description: 'should throw when multiple duplicate classes are in the same element',
      html: '<div class="a a b b"><span class="c"></span></div>',
      shouldThrow: true,
    },
  ];

  test.each(dataProviderAssertUniqueCssClasses())(
    '$description',
    ({ html, shouldThrow }) => {
      const element = elementWithClasses(html);
      if (shouldThrow) {
        expect(() => global.assertUniqueCssClasses(element)).toThrow();
      } else {
        expect(() => global.assertUniqueCssClasses(element)).not.toThrow();
      }
    },
  );
});
