// storybook.domain.utils.test.js

import { code, demoIcon, demoImage, demoVideoPoster, demoVideos, generateItems, generateSelectOptions, placeholder, themes } from './storybook.generators.utils';

describe('Domain-Specific Generators', () => {
  describe('themes', () => {
    it('returns the correct themes', () => {
      expect(themes()).toEqual({
        light: 'Light',
        dark: 'Dark',
      });
    });
  });

  describe('placeholder', () => {
    it('returns placeholder with default parameters', () => {
      expect(placeholder())
        .toBe('<div class="story-placeholder">Content placeholder</div>');
    });

    it('returns placeholder with custom content and class', () => {
      expect(placeholder('Custom content', 0, 'custom-class'))
        .toBe('<div class="custom-class">Custom content</div>');
    });

    it('returns placeholder with random sentence', () => {
      const result = placeholder('Custom content', 5);
      expect(result.startsWith('<div class="story-placeholder">Custom content '))
        .toBe(true);
    });
  });

  describe('code', () => {
    it('wraps content in code tags', () => {
      expect(code('const x = 1;')).toBe('<code>const x = 1;</code>');
    });
  });

  describe('demoImage', () => {
    const images = [
      'demo/images/demo1.jpg',
      'demo/images/demo2.jpg',
      'demo/images/demo3.jpg',
      'demo/images/demo4.jpg',
      'demo/images/demo5.jpg',
      'demo/images/demo6.jpg',
    ];

    it('returns a random demo image when index is not provided', () => {
      const result = demoImage();
      expect(images).toContain(result);
    });

    it.each([0, 1, 2, 3, 4, 5])('returns the correct image for index %i', (idx) => {
      expect(demoImage(idx)).toBe(images[idx]);
    });

    it('returns the last image for index out of bounds', () => {
      expect(demoImage(6)).toBe(images[5]);
    });
  });

  describe('demoIcon', () => {
    it('returns the correct demo icon path', () => {
      expect(demoIcon()).toBe('./assets/icons/megaphone.svg');
    });
  });

  describe('demoVideoPoster', () => {
    it('returns the correct demo video poster path', () => {
      expect(demoVideoPoster()).toBe('demo/videos/demo_poster.png');
    });
  });

  describe('demoVideos', () => {
    it('returns the correct demo videos array', () => {
      expect(demoVideos()).toEqual([
        {
          url: 'demo/videos/demo.webm',
          type: 'video/webm',
        },
        {
          url: 'demo/videos/demo.mp4',
          type: 'video/mp4',
        },
        {
          url: 'demo/videos/demo.avi',
          type: 'video/avi',
        },
      ]);
    });
  });

  describe('generateItems', () => {
    it('generates items with static content', () => {
      expect(generateItems(3, 'item')).toEqual(['item', 'item', 'item']);
    });

    it('generates items with function content', () => {
      const content = jest.fn((i) => `item ${i}`);
      expect(generateItems(3, content)).toEqual(['item 1', 'item 2', 'item 3']);
    });
  });

  describe('generateSelectOptions', () => {
    it('generates select options with type "option"', () => {
      const options = generateSelectOptions(2, 'option');
      expect(options.length).toBe(2);
      options.forEach((option) => {
        expect(option.type).toBe('option');
        expect(typeof option.is_selected).toBe('boolean');
        expect(typeof option.is_disabled).toBe('boolean');
        expect(typeof option.label).toBe('string');
        expect(typeof option.value).toBe('string');
        expect(option.options).toBe(null);
      });
    });

    it('generates select options with type "optgroup"', () => {
      const options = generateSelectOptions(2, 'optgroup');
      expect(options.length).toBe(2);
      options.forEach((option) => {
        expect(option.type).toBe('optgroup');
        expect(typeof option.is_selected).toBe('boolean');
        expect(typeof option.is_disabled).toBe('boolean');
        expect(typeof option.label).toBe('string');
        expect(typeof option.value).toBe('string');
        expect(Array.isArray(option.options)).toBe(true);
      });
    });
  });
});
