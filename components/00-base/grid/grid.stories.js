import CivicThemeGrid from './grid.twig';
import { generateItems, knobBoolean, knobNumber, knobRadios, knobText, randomSentence, shouldRender } from '../base.utils';

export default {
  title: 'Base/Grid',
  parameters: {
    layout: 'fullscreen',
    docs: '<div class="grid-story-docs story-grid-outlines row row--no-grow"><span class="col grid-story-docs-color-container">Container</span><span class="col grid-story-docs-color-row">Row</span><span class="col grid-story-docs-color-template-column">Template column</span><span class="col grid-story-docs-color-auto-column">Auto column</span><span class="col grid-story-docs-color-placeholder">Placeholder</span></div>',
    docsSize: 'medium',
    docsPlacement: 'before',
  },
};

export const Grid = (parentKnobs = {}) => {
  const knobs = {
    number_of_items: knobNumber(
      'Number of items',
      4,
      {
        range: true,
        min: 0,
        max: 15,
        step: 1,
      },
      parentKnobs.number_of_items,
      parentKnobs.knobTab,
    ),
    template_column_count: parseInt(knobRadios(
      'Template column count',
      {
        'Not set (use auto columns)': '0',
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        6: '6',
        12: '12',
      },
      '12',
      parentKnobs.template_column_count,
      parentKnobs.knobTab,
    ), 10),
    use_container: knobBoolean('Use container', true, parentKnobs.use_container, parentKnobs.knobTab),
    fill_width: knobBoolean('Fill width', false, parentKnobs.fill_width, parentKnobs.knobTab),
    render_as: knobRadios(
      'Render as',
      {
        'div > div': 'divdiv',
        'ul > li': 'ulli',
      },
      'divdiv',
      parentKnobs.render_as,
      parentKnobs.knobTab,
    ),
    row_class: knobText('Additional row class', '', parentKnobs.row_class, parentKnobs.knobTab),
    row_attributes: knobText('Additional row attributes', '', parentKnobs.row_attributes, parentKnobs.knobTab),
    column_class: knobText('Additional column class', '', parentKnobs.column_class, parentKnobs.knobTab),
    column_attributes: knobText('Additional column attributes', '', parentKnobs.column_attributes, parentKnobs.knobTab),
    modifier_class: knobText('Additional class', '', parentKnobs.modifier_class, parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab),
  };

  const showOutline = knobBoolean('Show outlines', false, parentKnobs.showOutlines, parentKnobs.knobTab);

  const props = {
    items: generateItems(knobs.number_of_items, () => `<span class="story-placeholder">${Math.floor(12 / (knobs.template_column_count > 0 ? knobs.template_column_count : 12))}</span>`),
    row_element: knobs.render_as === 'ulli' ? 'ul' : 'div',
    row_class: knobs.row_class,
    row_attributes: knobs.row_attributes,
    column_element: knobs.render_as === 'ulli' ? 'li' : 'div',
    column_class: knobs.column_class,
    column_attributes: `data-example-total-columns="${knobs.number_of_items}"`,
    use_container: knobs.use_container,
    template_column_count: knobs.template_column_count,
    fill_width: knobs.fill_width,
    attributes: knobs.attributes,
    modifier_class: knobs.modifier_class,
  };

  return shouldRender(parentKnobs) ? `<div class="${showOutline ? 'story-grid-outlines' : ''}">${CivicThemeGrid(props)}</div>` : knobs;
};

export const GridExample = () => {
  const showOutline = knobBoolean('Show outlines', false);

  let cols = [];

  let html = `<div class="example-container ${showOutline ? 'story-grid-outlines' : ''}">`;

  html += `<div class="example-container__title">Columns</div>`;
  html += `<div class="example-container__subtitle">Template column <code>.row > .col-[breakpoint]-[column]</code></div>`;
  cols = [1, 2, 3, 4, 6, 12];
  for (let j = 0; j < cols.length; j++) {
    html += CivicThemeGrid({
      items: generateItems(cols[j], `<span class="story-placeholder">${Math.floor(12 / cols[j])}</span>`),
      column_attributes: `data-example-total-columns="${cols[j]}"`,
      template_column_count: cols[j],
    });
  }

  html += `<div class="example-container__subtitle">Auto column <code>.row > .col</code></div>`;
  cols = [1, 2, 3, 4, 6, 12];
  for (let j = 0; j < cols.length; j++) {
    html += CivicThemeGrid({
      items: generateItems(cols[j], `<span class="story-placeholder">${Math.floor(12 / cols[j])}</span>`),
      column_attributes: `data-example-total-columns="${cols[j]}"`,
    });
  }

  html += `<div class="example-container__title">Contents width</div>`;

  html += `<div class="example-container__subtitle">Filled <code>width: 100%</code></div>`;
  cols = ['A', 'B', 'C', 'D', 'E'];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder">${cols[i - 1]}</span>`),
    column_attributes: `data-example-total-columns="${cols.length}"`,
    column_class: 'col',
  });

  html += `<div class="example-container__subtitle">Hugged <code>width: auto</code></div>`;
  cols = ['A', 'B', 'C', 'D', 'E'];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder--hugged">${cols[i - 1]}</span>`),
    column_attributes: `data-example-total-columns="${cols.length}"`,
    column_class: 'col',
  });

  html += `<div class="example-container__subtitle">Fixed <code>width: 184px</code></div>`;
  cols = ['A', 'B', 'C', 'D', 'E'];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder--fixed">${cols[i - 1]} fixed width</span>`),
    column_attributes: `data-example-total-columns="${cols.length}"`,
    column_class: 'col',
  });

  html += `<div class="example-container__title">Nested</div>`;

  html += `<div class="example-container__subtitle">Template column <code>.row > .col-[breakpoint]-[column]</code></div>`;
  cols = ['A', 'B', 'C', 'D'];
  html += CivicThemeGrid({
    items: [
      CivicThemeGrid({
        items: [
          `<span class="story-placeholder">Nested</span>`,
          `<span class="story-placeholder">Nested</span>`,
          `<span class="story-placeholder">Nested</span>`,
        ],
        use_container: false,
        column_attributes: 'data-example-total-columns="3"',
      }),
      `<span class="story-placeholder">Parent</span>`,
    ],
    template_column_count: 2,
    column_attributes: 'data-example-total-columns="2"',
  });

  html += `<div class="example-container__subtitle">Auto column <code>.row > .col</code></div>`;
  cols = ['A', 'B', 'C', 'D'];
  html += CivicThemeGrid({
    items: [
      CivicThemeGrid({
        items: [
          `<span class="story-placeholder">Nested</span>`,
          `<span class="story-placeholder">Nested</span>`,
          `<span class="story-placeholder">Nested</span>`,
        ],
        use_container: false,
        column_attributes: 'data-example-total-columns="3"',
      }),
      `<span class="story-placeholder">Parent</span>`,
    ],
    column_attributes: 'data-example-total-columns="2"',
  });

  html += `<div class="example-container__title">Row utilities</div>`;

  html += `<div class="example-container__subtitle">Reversed columns <code>.row.row--reverse</code></div>`;
  cols = ['A', 'B', 'C', 'D'];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder">${cols[i - 1]}</span>`),
    column_attributes: `data-example-total-columns="${cols.length}"`,
    template_column_count: cols.length,
    row_class: 'row row--reverse',
  });

  html += `<div class="example-container__subtitle">Equal column heights by default</div>`;
  cols = [randomSentence(5, 'A'), randomSentence(20, 'B'), randomSentence(5, 'C'), randomSentence(5, 'D')];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder">${cols[i - 1]}</span>`),
    column_attributes: `data-example-total-columns="${cols.length}"`,
    template_column_count: cols.length,
  });

  html += `<div class="example-container__subtitle">Equal column heights by default - Auto column</div>`;
  cols = [randomSentence(5, 'A'), randomSentence(20, 'B'), randomSentence(5, 'C'), randomSentence(5, 'D')];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder">${cols[i - 1]}</span>`),
    column_attributes: `data-example-total-columns="${cols.length}"`,
  });

  html += `<div class="example-container__subtitle">Equal column heights propagated to content <code>.row.row--equal-heights-content > .col-[breakpoint]-[column]</code></div>`;
  cols = [randomSentence(5, 'A'), randomSentence(20, 'B'), randomSentence(5, 'C'), randomSentence(5, 'D')];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder">${cols[i - 1]}</span>`),
    column_attributes: `data-example-total-columns="${cols.length}"`,
    template_column_count: cols.length,
    row_class: 'row row--equal-heights-content',
  });

  html += `<div class="example-container__subtitle">Equal column heights propagated to content <code>.row.row--equal-heights-content > .col</code> - Auto column</div>`;
  cols = [randomSentence(5, 'A'), randomSentence(20, 'B'), randomSentence(5, 'C'), randomSentence(5, 'D')];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder">${cols[i - 1]}</span>`),
    column_attributes: `data-example-total-columns="${cols.length}"`,
    row_class: 'row row--equal-heights-content',
  });

  html += `<div class="example-container__subtitle">Unequal column heights <code>.row.row--unequal-heights > .col-[breakpoint]-[column]</code></div>`;
  cols = [randomSentence(5, 'A'), randomSentence(20, 'B'), randomSentence(5, 'C'), randomSentence(5, 'D')];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder">${cols[i - 1]}</span>`),
    column_attributes: `data-example-total-columns="${cols.length}"`,
    template_column_count: cols.length,
    row_class: 'row row--unequal-heights',
  });

  html += `<div class="example-container__subtitle">Unequal column heights <code>.row.row--unequal-heights > .col</code> - Auto column</div>`;
  cols = [randomSentence(5, 'A'), randomSentence(20, 'B'), randomSentence(5, 'C'), randomSentence(5, 'D')];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder">${cols[i - 1]}</span>`),
    column_attributes: `data-example-total-columns="${cols.length}"`,
    row_class: 'row row--unequal-heights',
  });

  html += `<div class="example-container__title">Column utilities</div>`;

  html += `<div class="example-container__subtitle">Reversed items <code>.row > .col-[breakpoint]-[column].col--reverse</code></div>`;
  cols = ['A', 'B', 'C', 'D'];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder--fixed">${cols[i - 1]} - 1</span> <span class="story-placeholder--fixed">${cols[i - 1]} - 2</span>`),
    column_attributes: `data-example-total-columns="${cols.length}"`,
    template_column_count: cols.length,
    column_class: 'col--reverse',
  });

  html += `<div class="example-container__subtitle">Reversed items <code>.row > .col.col--reverse</code> - Auto column</div>`;
  cols = ['A', 'B', 'C', 'D'];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder">${cols[i - 1]} - 1</span> <span class="story-placeholder">${cols[i - 1]} - 2</span>`),
    column_attributes: `data-example-total-columns="${cols.length}"`,
    column_class: 'col col--reverse',
  });

  html += `<div class="example-container__subtitle">No grow <code>.row > .col-[breakpoint]-[column].col--no-grow</code></div>`;
  cols = ['A', 'B', 'C', 'D'];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder--hugged">${cols[i - 1]}</span>`),
    column_attributes: `data-example-total-columns="${cols.length}"`,
    template_column_count: cols.length,
    column_class: 'col--no-grow',
  });

  html += `<div class="example-container__subtitle">No grow <code>.row > .col.col--no-grow</code> - Auto column</div>`;
  cols = ['A', 'B', 'C', 'D'];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder--hugged">${cols[i - 1]}</span>`),
    column_attributes: `data-example-total-columns="${cols.length}"`,
    column_class: 'col col--no-grow',
  });

  html += `<div class="example-container__subtitle">No gap <code>.row > .col-[breakpoint]-[column].col--no-gap</code></div>`;
  cols = ['A', 'B', 'C', 'D'];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder">${cols[i - 1]}</span>`),
    column_attributes: `data-example-total-columns="${cols.length}"`,
    template_column_count: cols.length,
    column_class: 'col--no-gap',
  });

  html += `<div class="example-container__subtitle">No gap <code>.row > .col.col--no-gap</code> - Auto column</div>`;
  cols = ['A', 'B', 'C', 'D'];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder">${cols[i - 1]}</span>`),
    column_attributes: `data-example-total-columns="${cols.length}"`,
    column_class: 'col col--no-gap',
  });

  html += '</div>';

  return html;
};
