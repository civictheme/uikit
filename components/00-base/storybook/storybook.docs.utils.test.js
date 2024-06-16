import { decoratorDocs } from './storybook.docs.utils';

describe('decoratorDocs', () => {
  const mockContent = jest.fn(() => '<div>Content</div>');

  test.each([
    [
      { parameters: { docs: '<p>Documentation</p>', docsSize: 'large', docsClass: 'custom-class' } },
      '<div class="story-docs story-docs-size--large custom-class"><p>Documentation</p></div><div>Content</div>',
    ],
    [
      { parameters: { docs: '<p>Documentation</p>', docsSize: 'small', docsPlacement: 'after' } },
      '<div>Content</div><div class="story-docs story-docs-size--small"><p>Documentation</p></div>',
    ],
    [
      { parameters: { docs: '<p>Documentation</p>', docsPlacement: 'before' } },
      '<div class="story-docs story-docs-size--fluid"><p>Documentation</p></div><div>Content</div>',
    ],
    [
      { parameters: { docs: '<p>Documentation</p>' } },
      '<div class="story-docs story-docs-size--fluid"><p>Documentation</p></div><div>Content</div>',
    ],
    [
      { parameters: {} },
      '<div>Content</div>',
    ],
  ])('wraps content correctly based on context parameters', (context, expected) => {
    const result = decoratorDocs(mockContent, context);
    expect(result).toBe(expected);
  });

  test('returns content without wrapping when docs parameter is not present', () => {
    const context = { parameters: {} };
    const result = decoratorDocs(mockContent, context);
    expect(result).toBe('<div>Content</div>');
  });

  test('includes additional classes from docsClass parameter', () => {
    const context = { parameters: { docs: '<p>Documentation</p>', docsClass: 'additional-class' } };
    const result = decoratorDocs(mockContent, context);
    expect(result).toContain('additional-class');
  });
});
