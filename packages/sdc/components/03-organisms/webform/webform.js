// phpcs:ignoreFile
/**
 * @file
 * Webform component.
 *
 * Provides functionality for webforms.
 */
function CivicThemeWebform(el) {
  if (el.getAttribute('data-ct-webform') === 'true' || this.el) {
    return;
  }

  this.el = el;

  // Check for form errors and scroll to error message if present.
  const fieldErrors = this.el.querySelectorAll('.ct-field-message--error');
  if (fieldErrors.length > 0) {
    const errorMessage = document.querySelector('.ct-message--error');
    if (errorMessage) {
      // Make error message focusable if it's not a link.
      if (!errorMessage.matches('a')) {
        errorMessage.setAttribute('tabindex', '-1');
      }
      errorMessage.focus();
      errorMessage.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }

  // Mark as initialized.
  this.el.setAttribute('data-ct-webform', 'true');
}

// Initialize CivicThemeWebform on every element.
document.querySelectorAll('.ct-webform').forEach((webform) => {
  // eslint-disable-next-line no-new
  new CivicThemeWebform(webform);
});
