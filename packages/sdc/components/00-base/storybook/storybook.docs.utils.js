//
// Custom docs decorator for Storybook.
//
// Reads `storyDocs`, `storyDocsSize`, `storyDocsPlacement`, and `storyDocsClass`
// from story parameters and injects a styled documentation block into the
// rendered output.
//
// Note: We use `storyDocs` instead of `docs` to avoid conflicting with
// Storybook's built-in `parameters.docs` used by the docs addon.
//

export const decoratorDocs = (storyFn, context) => {
  const content = storyFn();

  const params = context?.parameters;
  if (!params?.storyDocs || typeof content !== 'string') {
    return content;
  }

  const size = ['small', 'medium', 'large', 'fluid'].includes(context.parameters.storyDocsSize)
    ? context.parameters.storyDocsSize
    : 'fluid';

  let classes = `story-docs story-docs-size--${size}`;

  if (context.parameters.storyDocsClass) {
    classes += ` ${context.parameters.storyDocsClass}`;
  }

  const docsHtml = `<div class="${classes}">${context.parameters.storyDocs}</div>`;

  if (context.parameters.storyDocsPlacement === 'after') {
    return `${content}${docsHtml}`;
  }

  return `${docsHtml}${content}`;
};
