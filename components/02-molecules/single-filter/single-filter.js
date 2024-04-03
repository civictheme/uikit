/**
 * @file
 * Single Filter component.
 */
function CivicThemeSingleFilterComponent(el) {
  if (this.el) {
    return;
  }

  this.el = el;

  this.el.addEventListener('ct.single-filter.update', this.update.bind(this));

  if (!el.hasEventListener) {
    el.hasEventListener = true;
    el.querySelectorAll('input, textarea, select, [type="checkbox"], [type="radio"]').forEach((input) => {
      input.addEventListener('change', () => {
        el.dispatchEvent(new CustomEvent('ct.single-filter.update', { detail: { parent: input.parentElement } }));
      });
    });
  }
}

/**
 * Update the instance.
 */
CivicThemeSingleFilterComponent.prototype.update = function (el) {
  el.detail.parent.setAttribute('aria-live', 'polite');
};

document.querySelectorAll('.ct-single-filter__list').forEach((el) => {
  new CivicThemeSingleFilterComponent(el);
});
