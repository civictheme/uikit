//
// Domain-specific generators for Storybook stories.
//

export const placeholder = (content = 'Content placeholder', cssClass = 'story-placeholder') => `<div class="${cssClass}" contenteditable="true">${content}</div>`;

export const code = (content) => `<code>${content}</code>`;

export const generateItems = (count, content) => {
  const items = [];
  for (let i = 1; i <= count; i++) {
    if (typeof content === 'function') {
      items.push(content(i, count));
    } else {
      items.push(content);
    }
  }
  return items;
};
