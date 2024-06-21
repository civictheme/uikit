/**
 * @file
 * Layout component.
 */
function CivicThemeLayout(el) {
  this.el = el;
  this.grid = el.querySelector('.ct-layout__inner');
  const gridStyle = getComputedStyle(this.grid);

  if (gridStyle.gridTemplateRows === 'masonry' || this.grid.hasAttribute('data-masonry')) {
    return;
  }

  this.grid.setAttribute('data-masonry', true);

  this.stl = this.grid.querySelector('.ct-layout__sidebar_top_left');
  this.str = this.grid.querySelector('.ct-layout__sidebar_top_right');
  this.sbl = this.grid.querySelector('.ct-layout__sidebar_bottom_left');
  this.sbr = this.grid.querySelector('.ct-layout__sidebar_bottom_right');

  // Only enable masonry if all 4 elements are present.
  if (this.stl && this.str && this.sbl && this.sbr) {
    // Prepare redraw variables.
    this.gap = parseFloat(gridStyle.gridRowGap);
    this.items = Array.from(this.grid.children);
    this.height = 0;

    // Listen for redraw events.
    this.resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        this.masonryRedraw();
      });
    });
    this.resizeObserver.observe(this.grid);
    this.masonryRedraw();
  }
}

/**
 * Position element in relation to it's above element.
 */
CivicThemeLayout.prototype.masonryPositionElement = function (el, aboveEl, gap) {
  const aboveChildIdx = aboveEl.children.length - 1;
  const aboveChild = (aboveChildIdx >= 0) ? aboveEl.children[aboveChildIdx] : null;
  const aboveBottom = aboveChild ? aboveChild.getBoundingClientRect().bottom : aboveEl.getBoundingClientRect().top;
  const currentTop = el.getBoundingClientRect().top;
  el.style.marginTop = `${aboveBottom + gap - currentTop}px`;
};

/**
 * Reposition grid elements.
 */
CivicThemeLayout.prototype.masonryRedraw = function () {
  // Ignore redraw if grid items total height hasn't changed since last redraw.
  const newHeight = this.items.reduce((t, el) => t + el.getBoundingClientRect().height, 0);

  if (newHeight !== this.height) {
    this.height = newHeight;

    // Clear existing positioning.
    this.sbl.style.removeProperty('margin-top');
    this.sbr.style.removeProperty('margin-top');

    // Set new position (if masonry css has been applied).
    if (getComputedStyle(this.grid).getPropertyValue('--js-masonry-enabled')) {
      this.masonryPositionElement(this.sbl, this.stl, this.gap);
      this.masonryPositionElement(this.sbr, this.str, this.gap);
    }
  }
};

// Initialize CivicThemeLayout on every element.
document.querySelectorAll('.ct-layout').forEach((layout) => {
  // eslint-disable-next-line no-new
  new CivicThemeLayout(layout);
});
