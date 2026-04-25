/**
 * CivicTheme Grid component stories.
 */

import DrupalAttribute from 'drupal-attribute';
import Component from './grid.twig';
import { placeholder, code, generateItems } from '../storybook/storybook.generators.utils';

const meta = {
  title: 'Base/Grid',
  component: Component,
  argTypes: {
    items: {
      control: { type: 'object' },
    },
    row_element: {
      control: { type: 'text' },
    },
    row_class: {
      control: { type: 'text' },
    },
    column_element: {
      control: { type: 'text' },
    },
    column_class: {
      control: { type: 'text' },
    },
    use_container: {
      control: { type: 'boolean' },
    },
    is_fluid: {
      control: { type: 'boolean' },
    },
    template_column_count: {
      control: { type: 'number' },
    },
    auto_breakpoint: {
      control: { type: 'boolean' },
    },
    fill_width: {
      control: { type: 'boolean' },
    },
    modifier_class: {
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Grid = {
  parameters: {
    layout: 'centered',
  },
  args: {
    items: [
      '<div class="story-placeholder" contenteditable="true">Item 1</div>',
      '<div class="story-placeholder" contenteditable="true">Item 2</div>',
      '<div class="story-placeholder" contenteditable="true">Item 3</div>',
      '<div class="story-placeholder" contenteditable="true">Item 4</div>',
      '<div class="story-placeholder" contenteditable="true">Item 5</div>',
      '<div class="story-placeholder" contenteditable="true">Item 6</div>',
      '<div class="story-placeholder" contenteditable="true">Item 7</div>',
      '<div class="story-placeholder" contenteditable="true">Item 8</div>',
      '<div class="story-placeholder" contenteditable="true">Item 9</div>',
      '<div class="story-placeholder" contenteditable="true">Item 10</div>',
      '<div class="story-placeholder" contenteditable="true">Item 11</div>',
      '<div class="story-placeholder" contenteditable="true">Item 12</div>',
    ],
    row_element: 'div',
    row_class: 'row',
    row_attributes: null,
    column_element: 'div',
    column_class: 'col',
    column_attributes: null,
    use_container: false,
    is_fluid: false,
    template_column_count: 0,
    auto_breakpoint: false,
    fill_width: false,
    attributes: null,
    modifier_class: 'row--equal-heights-content row--vertically-spaced',
  },
  render: (args) => {
    // Transform object inputs to DrupalAttribute instances
    const transformedArgs = { ...args };

    if (args.attributes && typeof args.attributes === 'object') {
      transformedArgs.attributes = new DrupalAttribute(
        Object.entries(args.attributes),
      );
    }

    if (args.row_attributes && typeof args.row_attributes === 'object') {
      transformedArgs.row_attributes = new DrupalAttribute(
        Object.entries(args.row_attributes),
      );
    }

    if (args.column_attributes && typeof args.column_attributes === 'object') {
      transformedArgs.column_attributes = new DrupalAttribute(
        Object.entries(args.column_attributes),
      );
    }

    return Component(transformedArgs);
  },
};

export const GridDemo = {
  parameters: {
    layout: 'fullscreen',
    storyDocs: '<div class="grid-story-docs story-grid-outlines row row--no-grow"><strong>Outline colors: </strong><br/><span class="col grid-story-docs-color-container-contained">Contained container</span><span class="col grid-story-docs-color-container-fluid">Fluid container</span><span class="col grid-story-docs-color-row">Row</span><span class="col grid-story-docs-color-template-column">Template column</span><span class="col grid-story-docs-color-auto-column">Auto column</span><span class="col grid-story-docs-color-placeholder">Placeholder</span></div>',
    storyDocsClass: 'story-docs--conditional',
  },
  argTypes: {
    show_outlines: {
      control: { type: 'boolean' },
    },
    items: { table: { disable: true } },
    row_element: { table: { disable: true } },
    row_class: { table: { disable: true } },
    column_element: { table: { disable: true } },
    column_class: { table: { disable: true } },
    use_container: { table: { disable: true } },
    is_fluid: { table: { disable: true } },
    template_column_count: { table: { disable: true } },
    auto_breakpoint: { table: { disable: true } },
    fill_width: { table: { disable: true } },
    modifier_class: { table: { disable: true } },
  },
  args: {
    show_outlines: false,
  },
  render: (args) => {
    const showOutline = args.show_outlines;
    let cols;
    let html = `<div class="story-container ${showOutline ? 'story-grid-outlines' : ''}">`;

    // Container section.
    html += '<div class="story-container__title">Container</div>';

    html += `<div class="story-container__subtitle">Contained container ${code('.container')}</div>`;
    cols = [12];
    for (let j = 0; j < cols.length; j++) {
      html += Component({
        items: generateItems(cols[j], placeholder(code(Math.floor(12 / cols[j])))),
        column_attributes: `data-story-total-columns="${cols[j]}"`,
        template_column_count: cols[j],
      });
    }

    html += `<div class="story-container__subtitle">Fluid container ${code('.container-fluid')}</div>`;
    cols = [12];
    for (let j = 0; j < cols.length; j++) {
      html += Component({
        items: generateItems(cols[j], placeholder(code(Math.floor(12 / cols[j])))),
        column_attributes: `data-story-total-columns="${cols[j]}"`,
        template_column_count: cols[j],
        is_fluid: true,
      });
    }

    // Columns section.
    html += '<div class="story-container__title">Columns</div>';

    html += `<div class="story-container__subtitle">Template column in container ${code('.container > .row > .col-[breakpoint]-[column]')}</div>`;
    cols = [1, 2, 3, 4, 6, 12];
    for (let j = 0; j < cols.length; j++) {
      html += Component({
        items: generateItems(cols[j], placeholder(code(Math.floor(12 / cols[j])))),
        column_attributes: `data-story-total-columns="${cols[j]}"`,
        template_column_count: cols[j],
      });
    }

    html += `<div class="story-container__subtitle">Template column in fluid container ${code('.container-fluid > .row > .col-[breakpoint]-[column]')}</div>`;
    cols = [1];
    for (let j = 0; j < cols.length; j++) {
      html += Component({
        items: generateItems(cols[j], placeholder(code(Math.floor(12 / cols[j])))),
        column_attributes: `data-story-total-columns="${cols[j]}"`,
        template_column_count: cols[j],
        is_fluid: true,
      });
    }

    html += `<div class="story-container__subtitle">Auto column in container ${code('.container .row > .col')}</div>`;
    cols = [1, 2, 3, 4, 6, 12];
    for (let j = 0; j < cols.length; j++) {
      html += Component({
        items: generateItems(cols[j], placeholder(code('auto'))),
        column_attributes: `data-story-total-columns="${cols[j]}"`,
      });
    }

    // Offsets and order section.
    html += '<div class="story-container__title">Offsets and order</div>';

    html += `<div class="story-container__subtitle">Template column in container ${code('.container > .row > .col-[breakpoint]-offset-[column]')}</div>`;
    cols = [1, 2, 3, 4, 6, 12];
    const offsets = [1, 2, 3, 4, 6, 8];
    for (let j = 0; j < cols.length; j++) {
      html += Component({
        items: [placeholder(`width ${code(Math.floor(12 / cols[j]))}, offset ${code(offsets[j])}`)],
        column_attributes: 'data-story-total-columns="1"',
        column_class: `col-m-offset-${offsets[j]}`,
        template_column_count: cols[j],
      });
    }

    html += `<div class="story-container__subtitle">Auto column in container ${code('.container > .row > .col.col-[breakpoint]-offset-[column]')}</div>`;
    for (let j = 0; j < cols.length; j++) {
      html += Component({
        items: [placeholder(`width ${code('auto')}, offset ${code(offsets[j])}`)],
        column_attributes: 'data-story-total-columns="1"',
        column_class: `col col-m-offset-${offsets[j]}`,
      });
    }

    // Content width section.
    html += '<div class="story-container__title">Content width</div>';

    html += `<div class="story-container__subtitle">Filled ${code('width: 100%')}</div>`;
    const letters = ['A', 'B', 'C', 'D', 'E'];
    html += Component({
      items: generateItems(letters.length, (i) => placeholder(letters[i - 1])),
      column_attributes: `data-story-total-columns="${letters.length}"`,
      column_class: 'col',
    });

    html += `<div class="story-container__subtitle">Hugged ${code('width: auto')}</div>`;
    html += Component({
      items: generateItems(letters.length, (i) => placeholder(letters[i - 1], 'story-placeholder--hugged')),
      column_attributes: `data-story-total-columns="${letters.length}"`,
      column_class: 'col',
    });

    html += `<div class="story-container__subtitle">Fixed ${code('width: 184px')}</div>`;
    html += Component({
      items: generateItems(letters.length, (i) => placeholder(`${letters[i - 1]} fixed width`, 'story-placeholder--fixed')),
      column_attributes: `data-story-total-columns="${letters.length}"`,
      column_class: 'col',
    });

    // Nested rows section.
    html += '<div class="story-container__title">Nested Rows (container-less)</div>';

    html += `<div class="story-container__subtitle">Template column wraps template column ${code('.row > .col-[breakpoint]-[column] > .row > .col-[breakpoint]-[column]')}</div>`;
    html += Component({
      items: [
        Component({
          items: generateItems(3, placeholder('Nested')),
          use_container: false,
          template_column_count: 3,
          column_attributes: 'data-story-total-columns="3"',
        }),
        placeholder('Parent'),
      ],
      use_container: false,
      template_column_count: 2,
      column_attributes: 'data-story-total-columns="2"',
      modifier_class: 'row--no-gutters',
    });

    html += `<div class="story-container__subtitle">Template column wraps auto column ${code('.row > .col-[breakpoint]-[column] > .row > .col')}</div>`;
    html += Component({
      items: [
        Component({
          items: generateItems(3, placeholder('Nested')),
          use_container: false,
          column_attributes: 'data-story-total-columns="3"',
        }),
        placeholder('Parent'),
      ],
      use_container: false,
      template_column_count: 2,
      column_attributes: 'data-story-total-columns="2"',
      modifier_class: 'row--no-gutters',
    });

    html += `<div class="story-container__subtitle">Auto column wraps auto-column ${code('.row > .col > .row > .col')}</div>`;
    html += Component({
      items: [
        Component({
          items: generateItems(3, placeholder('Nested')),
          use_container: false,
        }),
        placeholder('Parent'),
      ],
      use_container: false,
      modifier_class: 'row--no-gutters',
    });

    html += `<div class="story-container__subtitle">Auto column wraps template column ${code('.row > .col > .row > .col-[breakpoint]-[column]')}</div>`;
    html += Component({
      items: [
        Component({
          items: generateItems(3, placeholder('Nested')),
          use_container: false,
          template_column_count: 3,
          column_attributes: 'data-story-total-columns="3"',
        }),
        placeholder('Parent'),
      ],
      use_container: false,
      modifier_class: 'row--no-gutters',
    });

    // Nested containers section.
    html += '<div class="story-container__title">Nested Containers</div>';

    html += `<div class="story-container__subtitle">Container with template columns wraps container with template columns ${code('.container .row > .col-[breakpoint]-[column] .container > .row > .col-[breakpoint]-[column]')}</div>`;
    html += Component({
      items: [
        Component({
          items: generateItems(3, placeholder('Nested')),
          use_container: true,
          is_fluid: false,
          column_attributes: 'data-story-total-columns="3"',
        }),
        placeholder('Parent'),
      ],
      use_container: true,
      is_fluid: false,
      template_column_count: 2,
      column_attributes: 'data-story-total-columns="2"',
    });

    html += `<div class="story-container__subtitle">Fluid container with template columns wraps container with template columns ${code('.container-fluid .row > .col-[breakpoint]-[column] .container > .row > .col-[breakpoint]-[column]')}</div>`;
    html += Component({
      items: [
        Component({
          items: generateItems(3, placeholder('Nested')),
          use_container: true,
          is_fluid: false,
          column_attributes: 'data-story-total-columns="3"',
        }),
        placeholder('Parent'),
      ],
      use_container: true,
      is_fluid: true,
      template_column_count: 2,
      column_attributes: 'data-story-total-columns="2"',
    });

    html += `<div class="story-container__subtitle">Fluid container with template columns wraps container with template columns (single column) ${code('.container-fluid .row > .col-[breakpoint]-[column] .container > .row > .col-[breakpoint]-[column]')}</div>`;
    html += Component({
      items: [
        Component({
          items: generateItems(3, placeholder('Nested')),
          use_container: true,
          is_fluid: false,
          column_attributes: 'data-story-total-columns="3"',
        }),
      ],
      use_container: true,
      is_fluid: true,
      template_column_count: 1,
    });

    html += `<div class="story-container__subtitle">Container with template columns wraps fluid container with template columns ${code('.container .row > .col-[breakpoint]-[column] .container-fluid > .row > .col-[breakpoint]-[column]')}</div>`;
    html += Component({
      items: [
        Component({
          items: generateItems(3, placeholder('Nested')),
          use_container: true,
          is_fluid: true,
          column_attributes: 'data-story-total-columns="3"',
        }),
        placeholder('Parent'),
      ],
      use_container: true,
      is_fluid: false,
      template_column_count: 2,
      column_attributes: 'data-story-total-columns="2"',
    });

    html += `<div class="story-container__subtitle">Fluid container with template columns wraps fluid container with template columns ${code('.container-fluid .row > .col-[breakpoint]-[column] .container-fluid > .row > .col-[breakpoint]-[column]')}</div>`;
    html += Component({
      items: [
        Component({
          items: generateItems(3, placeholder('Nested')),
          use_container: true,
          is_fluid: true,
          column_attributes: 'data-story-total-columns="3"',
        }),
        placeholder('Parent'),
      ],
      use_container: true,
      is_fluid: true,
      template_column_count: 2,
      column_attributes: 'data-story-total-columns="2"',
    });

    // Row utilities section.
    html += '<div class="story-container__title">Row utilities</div>';

    html += `<div class="story-container__subtitle">No gutters ${code('.row.row--no-gutters')}</div>`;
    html += Component({
      items: generateItems(5, (i) => placeholder(letters[i - 1])),
      column_attributes: 'data-story-total-columns="5"',
      use_container: false,
      row_class: 'row row--no-gutters',
    });

    html += `<div class="story-container__subtitle">No gutters within container ${code('.container > .row.row--no-gutters')}</div>`;
    html += Component({
      items: generateItems(5, (i) => placeholder(letters[i - 1])),
      column_attributes: 'data-story-total-columns="5"',
      use_container: true,
      is_fluid: false,
      row_class: 'row row--no-gutters',
    });

    html += `<div class="story-container__subtitle">No gutters within fluid container ${code('.container-fluid > .row.row--no-gutters')}</div>`;
    html += Component({
      items: generateItems(5, (i) => placeholder(letters[i - 1])),
      column_attributes: 'data-story-total-columns="5"',
      use_container: true,
      is_fluid: true,
      row_class: 'row row--no-gutters',
    });

    html += `<div class="story-container__subtitle">Reversed columns ${code('.row.row--reverse')}</div>`;
    html += Component({
      items: generateItems(4, (i) => placeholder(letters[i - 1])),
      column_attributes: 'data-story-total-columns="4"',
      template_column_count: 4,
      row_class: 'row row--reverse',
    });

    const shortText = 'Lorem ipsum dolor sit amet';
    const longText = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris';

    html += '<div class="story-container__subtitle">Equal column heights by default</div>';
    html += Component({
      items: [
        placeholder(`<strong>Content should not fill - height is not 100%.</strong> ${shortText}`),
        placeholder(longText),
        placeholder(shortText),
        placeholder(shortText),
      ],
      column_attributes: 'data-story-total-columns="4"',
      template_column_count: 4,
    });

    html += `<div class="story-container__subtitle">Equal column heights propagated to content ${code('.row.row--equal-heights-content > .col-[breakpoint]-[column]')}</div>`;
    html += Component({
      items: [
        placeholder(`<strong>Content should fill - height is propagated to be 100%.</strong> ${shortText}`),
        placeholder(longText),
        placeholder(shortText),
        placeholder(shortText),
      ],
      column_attributes: 'data-story-total-columns="4"',
      template_column_count: 4,
      row_class: 'row row--equal-heights-content',
    });

    html += `<div class="story-container__subtitle">Equal column heights propagated to content ${code('.row.row--equal-heights-content > .col')} - Auto column</div>`;
    html += Component({
      items: [
        placeholder(`<strong>Content should fill - height is propagated to be 100%.</strong> ${shortText}`),
        placeholder(longText),
        placeholder(shortText),
        placeholder(shortText),
      ],
      column_attributes: 'data-story-total-columns="4"',
      row_class: 'row row--equal-heights-content',
    });

    html += `<div class="story-container__subtitle">Unequal column heights ${code('.row.row--unequal-heights > .col-[breakpoint]-[column]')}</div>`;
    html += Component({
      items: [
        placeholder(shortText),
        placeholder(longText),
        placeholder(shortText),
        placeholder(shortText),
      ],
      column_attributes: 'data-story-total-columns="4"',
      template_column_count: 4,
      row_class: 'row row--unequal-heights',
    });

    html += `<div class="story-container__subtitle">Unequal column heights ${code('.row.row--unequal-heights > .col')} - Auto column</div>`;
    html += Component({
      items: [
        placeholder(shortText),
        placeholder(longText),
        placeholder(shortText),
        placeholder(shortText),
      ],
      column_attributes: 'data-story-total-columns="4"',
      row_class: 'row row--unequal-heights',
    });

    html += `<div class="story-container__subtitle">Vertical spacing ${code('.row.row--vertically-spaced > .col-[breakpoint]-[column]')}</div>`;
    cols = [4, 3, 4];
    for (let j = 0; j < cols.length; j++) {
      html += Component({
        items: generateItems(cols[j] + (j % 2), placeholder(code(Math.floor(12 / cols[j])))),
        column_attributes: `data-story-total-columns="${cols[j]}"`,
        template_column_count: cols[j],
        row_class: 'row row--vertically-spaced',
      });
    }

    html += `<div class="story-container__subtitle">Vertical spacing ${code('.row.row--vertically-spaced > .col')} - Autocolumn</div>`;
    for (let j = 0; j < cols.length; j++) {
      html += Component({
        items: generateItems(cols[j] + (j % 2), placeholder(code(Math.floor(12 / cols[j])), 'story-placeholder--fixed')),
        column_attributes: `data-story-total-columns="${cols[j]}"`,
        row_class: 'row row--vertically-spaced',
      });
    }

    // Column utilities section.
    html += '<div class="story-container__title">Column utilities</div>';

    html += `<div class="story-container__subtitle">Reversed items ${code('.row > .col-[breakpoint]-[column].col--reverse')}</div>`;
    html += Component({
      items: generateItems(4, (i) => `${placeholder(`${letters[i - 1]}-1`)} ${placeholder(`${letters[i - 1]}-2`)}`),
      column_attributes: 'data-story-total-columns="4"',
      template_column_count: 4,
      column_class: 'col--reverse',
    });

    html += `<div class="story-container__subtitle">Reversed items ${code('.row > .col.col--reverse')} - Auto column</div>`;
    html += Component({
      items: generateItems(4, (i) => `${placeholder(`${letters[i - 1]}-1`)} ${placeholder(`${letters[i - 1]}-2`)}`),
      column_attributes: 'data-story-total-columns="4"',
      column_class: 'col col--reverse',
    });

    html += `<div class="story-container__subtitle">No grow ${code('.row > .col-[breakpoint]-[column].col--no-grow')}</div>`;
    html += Component({
      items: generateItems(4, (i) => placeholder(letters[i - 1])),
      column_attributes: 'data-story-total-columns="4"',
      template_column_count: 4,
      column_class: 'col--no-grow',
    });

    html += `<div class="story-container__subtitle">No grow ${code('.row > .col.col--no-grow')} - Auto column</div>`;
    html += Component({
      items: generateItems(4, (i) => placeholder(letters[i - 1])),
      column_attributes: 'data-story-total-columns="4"',
      column_class: 'col col--no-grow',
    });

    html += `<div class="story-container__subtitle">No gap ${code('.row > .col-[breakpoint]-[column].col--no-gap')}</div>`;
    html += Component({
      items: generateItems(4, (i) => placeholder(letters[i - 1])),
      column_attributes: 'data-story-total-columns="4"',
      template_column_count: 4,
      column_class: 'col--no-gap',
    });

    html += `<div class="story-container__subtitle">No gap ${code('.row > .col.col--no-gap')} - Auto column</div>`;
    html += Component({
      items: generateItems(4, (i) => placeholder(letters[i - 1])),
      column_attributes: 'data-story-total-columns="4"',
      column_class: 'col col--no-gap',
    });

    html += '</div>';

    return html;
  },
};
