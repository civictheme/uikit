import { render, Twig } from 'twig-testing-library';
import { createAttribute } from '@civictheme/drupal-attribute';
import * as fs from 'node:fs';
import { globSync } from 'glob';

const dir = new URL('.', import.meta.url).pathname;

Twig.extendFunction('source', (src) => {
  if (src.startsWith('@civictheme')) {
    src = src.replace('@civictheme', dir);
  }
  return fs.readFileSync(src, 'utf8');
});

// Resolve SDC Namespaces.
const originalParsePath = Twig.path.parsePath;
Twig.path.parsePath = function (template, _file) {
  // Custom - Support SDC paths.
  const sdcPath = _file.split(':');
  if (sdcPath.length === 2) {
    var [namespace, component] = sdcPath;
    const path = globSync(`./components/**/${component}.twig`);
    if (path.length > 0) {
      return path[0];
    }
  }
  return originalParsePath(template, _file);
};

const originalRender = render;
const wrappedRender = async (template, props = {}, namespaces = {}, twigCallback = () => {}) => {
  const wrappedTwigCallback = (TwigInstance) => {
    const originalTwig = TwigInstance.twig;
    TwigInstance.twig = function (options) {
      options.autoescape = false;
      options.allowInlineIncludes = true;
      // twig-testing-library registers create_attribute as
      // `new DrupalAttribute(Object.entries(value))`, which carries twig.js's
      // `_keys` bookkeeping property into the markup as an attribute. It does so
      // inside loadTemplate, which runs after this callback, so registering at
      // module scope or directly here would be overwritten. loadTemplate only
      // reassigns twigAsync, and twigAsync calls twig() - so this wrapper is the
      // first hook that runs after its registration. createAttribute drops
      // `_keys` and uses it to order the remaining attributes.
      TwigInstance.extendFunction('create_attribute', createAttribute);
      return originalTwig(options);
    };
    twigCallback(TwigInstance);
  };
  return originalRender(template, props, namespaces, wrappedTwigCallback);
};

global.dom = async function (template, props = {}, matchSnapshot = true) {
  const { container } = await wrappedRender(template, props, {});

  if (matchSnapshot) {
    expect(container).toMatchSnapshot();
  }

  return container;
};

global.assertUniqueCssClasses = function (element) {
  const elements = element.querySelectorAll('*');
  elements.forEach((el) => {
    const classes = typeof el.className === 'string' ? el.className.split(' ').filter((cls) => cls) : [];
    const classOccurrences = classes.reduce((acc, cls) => {
      acc[cls] = (acc[cls] || 0) + 1;
      return acc;
    }, {});

    const duplicates = Object.entries(classOccurrences).filter(([, count]) => count > 1);
    expect(duplicates).toHaveLength(0);

    const undefinedClasses = classes.filter((cls) => cls === 'undefined');
    expect(undefinedClasses).toHaveLength(0);
  });
};
