import { decoratorStoryLayout } from './storybook.layout.utils';

describe('decoratorStoryLayout', () => {
  const mockContent = jest.fn(() => '<div>Content</div>');

  test.each([
    [
      { parameters: { storyLayoutSize: 'large', layout: 'centered', storyLayoutClass: 'custom-class' }, globals: {} },
      '<div class="story-layout story-layout-size--large story-layout--centered-vertically custom-class"><div>Content</div></div>',
    ],
    [
      { parameters: { storyLayoutSize: 'medium', storyLayoutIsContainer: true, storyLayoutHtmlBefore: '<p>Before</p>', storyLayoutHtmlAfter: '<p>After</p>' }, globals: {} },
      '<div class="story-layout story-layout-size--medium story-layout--container"><p>Before</p><div>Content</div><p>After</p></div>',
    ],
    [
      { parameters: { layout: 'centered', storyLayoutIsResizable: true }, globals: { resizer: true } },
      '<div class="story-layout story-layout-size--medium story-layout--centered-vertically story-layout--resizable"><div>Content</div></div>',
    ],
    [
      { parameters: {}, globals: {} },
      '<div>Content</div>',
    ],
  ])('wraps content correctly based on context parameters', (context, expected) => {
    const result = decoratorStoryLayout(mockContent, context);
    expect(result).toBe(expected);
  });

  test('returns content without wrapping when storyLayout parameter is not present', () => {
    const context = { parameters: {}, globals: {} };
    const result = decoratorStoryLayout(mockContent, context);
    expect(result).toBe('<div>Content</div>');
  });

  test('includes additional classes from storyLayoutClass parameter', () => {
    const context = { parameters: { storyLayoutClass: 'additional-class' }, globals: {} };
    const result = decoratorStoryLayout(mockContent, context);
    expect(result).toContain('additional-class');
  });
});
