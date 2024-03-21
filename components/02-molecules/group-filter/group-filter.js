/**
 * @file
 * Group Filter component.
 */
function CivicThemeGroupFilterComponent(el) {
  // Function to trigger custom event
  const triggerFilterUpdateEvent = function () {
    el.dispatchEvent(new CustomEvent('ct.group-filter.update'));
  };

  // Function to bind event listeners
  const bindEventListeners = function () {
    // Add event listener for filter change
    el.querySelectorAll('input').forEach((input) => {
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
  // TODO
};

// Find group Filter components and initialize
document.querySelectorAll('[data-component-name="ct-group-filter"]').forEach((el) => {
  new CivicThemeGroupFilterComponent(el);
});
