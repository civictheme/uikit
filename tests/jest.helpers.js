import { render } from 'twig-testing-library';

global.dom = async function (template, props, matchSnapshot = true) {
  const { container } = await render(template, props, {
    base: 'components/00-base',
    atoms: 'components/01-atoms',
    molecules: 'components/02-molecules',
    organisms: 'components/03-organisms',
    templates: 'components/04-templates',
  });

  if (matchSnapshot) {
    expect(container).toMatchSnapshot();
  }

  return container;
};

global.assertUniqueCssClasses = function (element) {
  const elements = element.querySelectorAll('*');
  elements.forEach((el) => {
    const classes = el.className.split(' ').filter((cls) => cls);
    const classOccurrences = classes.reduce((acc, cls) => {
      acc[cls] = (acc[cls] || 0) + 1;
      return acc;
    }, {});
    const duplicates = Object.entries(classOccurrences).filter(([, count]) => count > 1);
    expect(duplicates).toHaveLength(0);
  });
};
