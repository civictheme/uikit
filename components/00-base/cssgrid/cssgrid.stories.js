export default {
  title: 'Base/CSSGrid',
  parameters: {
    layout: 'fullscreen',
  },
};

export const CSSGrid = () => {
  let html = '';

  let colCount = 12;
  let rowCount = 5;
  html += `<div class="example-container"><div class="example-container__title">${colCount} columns, ${rowCount} rows</div>`;
  html += `<div class="grid-${colCount}-${rowCount}">`;
  for (let r = 1; r <= rowCount; r++) {
    for (let c = 1; c <= colCount; c++) {
      html += `<div class="g-row-1 g-row-start-${r} g-col-1 g-col-start-${c}"><span class="story-placeholder">${c}, ${r}</span></div>`;
    }
  }
  html += '</div></div>';

  colCount = 12;
  rowCount = 3;
  html += `<div class="example-container"><div class="example-container__title">${colCount} columns, ${rowCount} rows, gaps</div>`;
  html += `<div class="grid-${colCount}-${rowCount} g-gap">`;
  for (let r = 1; r <= rowCount; r++) {
    for (let c = 1; c <= colCount; c++) {
      html += `<div class="g-row-1 g-row-start-${r} g-col-1 g-col-start-${c}"><span class="story-placeholder">${c}, ${r}</span></div>`;
    }
  }
  html += '</div></div>';

  colCount = 12;
  rowCount = 5;
  html += `<div class="example-container"><div class="example-container__title">${colCount} columns, ${rowCount} rows, spans</div>`;
  html += `<div class="grid-${colCount}-${rowCount}">`;
  for (let r = 1; r <= rowCount; r += 2) {
    for (let c = 1; c <= colCount; c += 2) {
      html += `<div class="g-row-2 g-row-start-${r} g-col-2 g-col-start-${c}"><span class="story-placeholder">${c}, ${r}</span></div>`;
    }
  }
  html += '</div></div>';

  colCount = 12;
  rowCount = 5;
  html += `<div class="example-container"><div class="example-container__title">${colCount} columns, ${rowCount} rows, row spans and responsive</div>`;
  html += `<div class="grid-${colCount}-1 grid-m-${colCount}-${rowCount}">`;
  html += `<div class="g-row-1 g-row-start-1 g-row-m-start-1 g-col-2 g-col-start-1"><span class="story-placeholder">1</span></div>`;
  html += `<div class="g-row-1 g-row-start-1 g-row-2 g-row-m-start-2 g-col-2 g-col-start-3"><span class="story-placeholder">2</span></div>`;
  html += `<div class="g-row-1 g-row-start-1 g-row-2 g-row-m-start-3 g-col-2 g-col-start-5"><span class="story-placeholder">3</span></div>`;
  html += `<div class="g-row-1 g-row-start-1 g-row-2 g-row-m-start-4 g-col-6 g-col-m-2 g-col-start-7"><span class="story-placeholder">4</span></div>`;
  html += '</div></div>';

  return html;
};
