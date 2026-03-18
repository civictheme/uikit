//
// Domain-specific generators for Storybook stories.
//

export const placeholder = (content = 'Content placeholder', words = 0, cssClass = 'story-placeholder') => `<div class="${cssClass}" contenteditable="true">${content}${words > 0 ? ` ${randomSentenceSimple(words)}` : ''}</div>`;

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

// Simple random sentence generator without external dependencies.
const words = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing',
  'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore',
  'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam',
  'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
  'aliquip', 'ex', 'ea', 'commodo', 'consequat',
];

function seededRandom(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) {
    s = ((s << 5) - s + seed.charCodeAt(i)) | 0;
  }
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export const randomSentenceSimple = (count, seed = null) => {
  const rng = seed ? seededRandom(String(seed)) : Math.random.bind(Math);
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(words[Math.floor(rng() * words.length)]);
  }
  const sentence = result.join(' ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
};
