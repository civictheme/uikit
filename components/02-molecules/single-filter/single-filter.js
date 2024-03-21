/**
 * @file
 * Single Filter component.
 */
function CivicThemeSingleFilterComponent(el) {
  // Function to trigger custom event
  const triggerFilterUpdateEvent = function () {
    el.dispatchEvent(new CustomEvent('ct.single-filter.update'));
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
CivicThemeSingleFilterComponent.prototype.update = function () {
  // TODO
};

// Find Single Filter components and initialize
document.querySelectorAll('[data-component-name="ct-single-filter"]').forEach((el) => {
  new CivicThemeSingleFilterComponent(el);
});
