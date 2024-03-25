/**
 * @file
 * Group Filter component.
 */
function CivicThemeGroupFilterComponent(el) {
  if (this.el) {
    return;
  }

  this.el = el;

  this.el.addEventListener('ct.group-filter.update', () => {
    this.update(true);
  });

  // Function to trigger custom event
  const triggerFilterUpdateEvent = function () {
    el.dispatchEvent(new CustomEvent('ct.group-filter.update'));
  };

  // Function to bind event listeners
  const bindEventListeners = function () {
    // Add event listener for filter change
    el.querySelectorAll('input, textarea, select, [type="checkbox"], [type="radio"]').forEach((input) => {
      input.addEventListener('change', triggerFilterUpdateEvent);
    });
  };

  // Bind event listeners
  bindEventListeners();
}

/**
 * Update the instance.
 */
CivicThemeGroupFilterComponent.prototype.update = function () {
  const t = this;
  t.el.setAttribute('aria-live', 'polite');
};

// Find group Filter components and initialize
document.querySelectorAll('[data-ct-group-filter-filters]').forEach((el) => {
  new CivicThemeGroupFilterComponent(el);
});
