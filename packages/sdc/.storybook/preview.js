import '../dist/civictheme.stories.css?module';
import '../dist/civictheme.base.css';
import '../dist/civictheme.variables.css';
import '../dist/civictheme.base';
import { useEffect, useChannel } from 'storybook/preview-api';
import { format } from 'prettier/standalone';
import htmlPlugin from 'prettier/plugins/html';
import { decoratorDocs } from '../components/00-base/storybook/storybook.docs.utils';

const ADDON_EVENT = 'storybook/html/codeUpdate';

const withHTML = (storyFn, context) => {
  const emit = useChannel({});
  const parameters = context.parameters?.html || {};

  useEffect(() => {
    if (parameters.disable) return undefined;

    const timer = window.setTimeout(async () => {
      const root = context.canvasElement || document.querySelector('#storybook-root, #root');
      if (!root) return;

      let code = root.innerHTML || '';
      if (!code) return;

      try {
        code = await format(code, {
          parser: 'html',
          plugins: [htmlPlugin],
          htmlWhitespaceSensitivity: 'ignore',
        });
      } catch (e) {
        // Use unformatted HTML if prettier fails.
      }

      emit(ADDON_EVENT, { code, options: parameters });
    }, 0);

    return () => window.clearTimeout(timer);
  });

  return storyFn();
};

export default {
  decorators: [withHTML, decoratorDocs],
  parameters: {
    backgrounds: {
      options: {
        white: {
          name: 'White',
          value: '#ffffff',
        },

        light: {
          name: 'Light',
          value: '#f2f4f5',
        },

        dark: {
          name: 'Dark',
          value: '#003f56',
        },
      },
    },
    viewport: {
      options: {
        xs: {
          name: 'XS',
          styles: {
            width: '368px',
            height: '568px',
          },
          type: 'mobile',
        },
        s: {
          name: 'S',
          styles: {
            width: '576px',
            height: '896px',
          },
          type: 'mobile',
        },
        m: {
          name: 'M',
          styles: {
            width: '768px',
            height: '1112px',
          },
          type: 'tablet',
        },
        l: {
          name: 'L',
          styles: {
            width: '992px',
            height: '1112px',
          },
          type: 'desktop',
        },
        xl: {
          name: 'XL',
          styles: {
            width: '1280px',
            height: '1024px',
          },
          type: 'desktop',
        },
        xxl: {
          name: 'XXL',
          styles: {
            width: '1440px',
            height: '900px',
          },
          type: 'desktop',
        },
      },
    },
    options: {
      storySort: {
        order: [
          'Welcome',
          'About CivicTheme',
          'Base',
          [
            'Colors',
            'Fonts',
            'Typography',
            'Icon',
            'Background',
            'Elevation',
            'Grid',
            'Layout',
            'Spacing',
            'Item List',
            'Utilities',
            'Storybook',
            [
              'Overview',
              '*',
            ],
          ],
          '*',
          'Atoms',
          [
            'Chip',
            'Content Link',
            'Heading',
            'Iframe',
            'Image',
            'Form Controls',
          ],
          '*',
          'Molecules',
          [
            'Accordion',
            'Attachment',
            'Back To Top',
            'Basic Content',
            'Breadcrumb',
            'Callout',
            'Field',
            'Figure',
            'List',
            [
              'Single Filter',
              'Group Filter',
              'Pagination',
              '*',
              'Snippet',
            ],
            '*',
          ],
          '*',
          'Organisms',
          '*',
          'Templates',
          '*',
        ],
      },
    },
    html: {
      prettier: {
        tabWidth: 4,
        useTabs: false,
        htmlWhitespaceSensitivity: 'strict',
      },
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'white',
    },
  },
};
