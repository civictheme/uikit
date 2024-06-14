import CivicThemeGrid from './grid.twig';
import { generateItems, knobBoolean, knobNumber, knobRadios, knobText, shouldRender } from '../base.utils';

export default {
  title: 'Base/Grid',
  parameters: {
    layout: 'fullscreen',
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
    column_count: parseInt(knobRadios(
      'Columns',
      {
        'Not set': '0',
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        6: '6',
        12: '12',
      },
      '12',
      parentKnobs.column_count,
      parentKnobs.knobTab,
    ), 10),
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
    modifier_class: knobText('Additional class', '', parentKnobs.modifier_class, parentKnobs.knobTab),
  };

  if (knobs.render_as === 'ulli') {
    knobs.row_element = 'ul';
    knobs.column_element = 'li';
  } else {
    knobs.row_element = 'div';
    knobs.column_element = 'div';
  }

  knobs.items = generateItems(knobs.number_of_items, () => `<span class="story-placeholder">${Math.floor(12 / (knobs.column_count > 0 ? knobs.column_count : 12))}</span>`);

  const showOutline = knobBoolean('Show outlines', false, parentKnobs.showOutlines, parentKnobs.knobTab);

  return shouldRender(parentKnobs) ? `<div class="${showOutline ? 'story-grid-wrapper' : ''}">${CivicThemeGrid(knobs)}</div>` : knobs;
};

export const GridExample = () => {
  const showOutline = knobBoolean('Show outlines', false);

  let html = `<div class="example-container ${showOutline ? 'story-grid-wrapper' : ''}">`;

  html += `<div class="example-container__title">Columns</div>`;
  let cols = [1, 2, 3, 4, 6, 12];
  for (let j = 0; j < cols.length; j++) {
    html += CivicThemeGrid({
      column_count: cols[j],
      items: generateItems(cols[j], `<span class="story-placeholder">${Math.floor(12 / cols[j])}</span>`),
    });
  }

  html += `<div class="example-container__title">Nested grid</div>`;
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
      }),
      `<span class="story-placeholder">Parent</span>`,
    ],
    column_count: 2,
  });

  html += `<div class="example-container__subtitle">Auto column <code>.col</code></div>`;

  html += `<div class="example-container__title">Fill width elements</div>`;
  cols = ['A', 'B', 'C', 'D', 'E'];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder">${cols[i - 1]}</span>`),
    column_class: 'col',
  });

  html += `<div class="example-container__title">Hugged width elements</div>`;
  cols = ['A', 'B', 'C', 'D', 'E'];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder--hugged">${cols[i - 1]}</span>`),
    column_class: 'col',
  });

  html += `<div class="example-container__title">Fixed width element</div>`;
  cols = ['A', 'B', 'C', 'D', 'E'];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder--fixed">${cols[i - 1]} fixed width</span>`),
    column_class: 'col',
  });

  html += `<div class="example-container__title">Row utilities</div>`;

  html += `<div class="example-container__subtitle">Reversed <code>.row--reverse</code></div>`;
  cols = ['A', 'B', 'C', 'D'];
  html += CivicThemeGrid({
    column_count: cols.length,
    items: generateItems(cols.length, (i) => `<span class="story-placeholder">${cols[i - 1]}</span>`),
    row_class: 'row row--reverse',
  });

  html += `<div class="example-container__title">Column utilities</div>`;

  html += `<div class="example-container__subtitle">Reversed <code>.col--reverse</code></div>`;
  cols = ['A', 'B', 'C', 'D'];
  html += CivicThemeGrid({
    column_count: cols.length,
    items: generateItems(cols.length, (i) => `<span class="story-placeholder--fixed">${cols[i - 1]} - 1</span> <span class="story-placeholder--fixed">${cols[i - 1]} - 2</span>`),
    column_class: 'col--reverse',
  });

  html += `<div class="example-container__subtitle">Reversed <code>.col--reverse</code> - Auto column</div>`;
  cols = ['A', 'B', 'C', 'D'];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder">${cols[i - 1]} - 1</span> <span class="story-placeholder">${cols[i - 1]} - 2</span>`),
    column_class: 'col col--reverse',
  });

  html += `<div class="example-container__subtitle">No grow <code>.col--no-grow</code></div>`;
  cols = ['A', 'B', 'C', 'D', 'E'];
  html += CivicThemeGrid({
    column_count: cols.length,
    items: generateItems(cols.length, (i) => `<span class="story-placeholder--hugged">${cols[i - 1]}</span>`),
    column_class: 'col--no-grow',
  });

  html += `<div class="example-container__subtitle">No grow <code>.col--no-grow</code> - Auto column</div>`;
  cols = ['A', 'B', 'C', 'D', 'E'];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder--hugged">${cols[i - 1]}</span>`),
    column_class: 'col col--no-grow',
  });

  html += `<div class="example-container__subtitle">No column gap <code>.col--no-gap</code></div>`;
  cols = ['A', 'B', 'C', 'D'];
  html += CivicThemeGrid({
    column_count: cols.length,
    items: generateItems(cols.length, (i) => `<span class="story-placeholder">${cols[i - 1]}</span>`),
    column_class: 'col--no-gap',
  });

  html += `<div class="example-container__subtitle">No column gap <code>.col--no-gap</code> - Auto column</div>`;
  cols = ['A', 'B', 'C', 'D'];
  html += CivicThemeGrid({
    items: generateItems(cols.length, (i) => `<span class="story-placeholder">${cols[i - 1]}</span>`),
    column_class: 'col col--no-gap',
  });

  html += '</div>';

  return html;
};
