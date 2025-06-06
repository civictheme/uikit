/**
 * CivicTheme Table component.
 */

function CivicThemeTable(el) {
  if (!el) {
    return;
  }

  this.el = el;

  this.init();
}

// eslint-disable-next-line func-names
CivicThemeTable.prototype.init = function () {
  if (this.el.getAttribute('data-table') === 'true') {
    return;
  }

  this.addTitles();

  // Check if the table has the class 'ct-table--data'
  if (this.el.classList.contains('ct-table--data')) {
    this.addWrapper();
  }

  this.el.setAttribute('data-table', 'true');
};

// Add data-title attributes to cells for display on mobile.
// TODO: Add titles to cells in rows with row-scoped th cells.
// CivicThemeTable.prototype.addRowScopedTitles.
// TODO: Add titles to cells in columns with col-scoped th cells.
// CivicThemeTable.prototype.addColScopedTitles.
CivicThemeTable.prototype.addTitles = function () {
  this.addTheadColumnTitles();
};

CivicThemeTable.prototype.addWrapper = function () {
  // Select the target element you want to wrap.
  const targetElement = this.el;
  // Create the wrapper element.
  const wrapper = document.createElement('div');
  wrapper.classList.add('ct-table--wrapper');
  // Add attributes to the wrapper
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('tabindex', '0');
  // Insert the wrapper before the target element.
  targetElement.parentNode.insertBefore(wrapper, targetElement);
  // Move the target element inside the wrapper.
  wrapper.appendChild(targetElement);
};

// eslint-disable-next-line func-names
CivicThemeTable.prototype.addTheadColumnTitles = function () {
  // Determine whether column titles can be added via thead.
  const theadRows = this.el.querySelectorAll('thead tr');
  const tbodyRows = this.el.querySelectorAll('tbody tr');
  if (!(theadRows.length && tbodyRows.length)) {
    return;
  }
  const theadRow = theadRows[0];
  const theadCells = theadRow.querySelectorAll('th, td');

  tbodyRows.forEach((tbodyRow) => {
    const tbodyRowCells = tbodyRow.querySelectorAll('th, td');
    tbodyRowCells.forEach((tbodyRowCell, index) => {
      if (!tbodyRowCell.hasAttribute('data-title') && theadCells[index]) {
        tbodyRowCell.setAttribute('data-title', theadCells[index].textContent);
      }
    });
  });
};

document.querySelectorAll('.ct-basic-content table, .ct-table').forEach((table) => {
  // eslint-disable-next-line no-new
  new CivicThemeTable(table);
});
