import DrupalAttribute from 'drupal-attribute';
import jestEach from 'jest-each';

const each = jestEach.default;

const template = 'components/00-base/grid/grid.twig';

const dataProviderGrid = () => [
  {
    items: ['1'],
    use_container: true,
    description: 'with container',
  },
  {
    items: ['1'],
    use_container: false,
    description: 'without container',
  },
  {
    items: ['1', '2'],
    use_container: true,
    description: 'multiple items with container',
  },
  {
    items: ['1', '2'],
    use_container: true,
    is_fluid: true,
    description: 'multiple items with fluid container',
  },
  {
    items: ['1', '2'],
    use_container: false,
    description: 'multiple items without container',
  },
  {
    items: ['1', '2', '3'],
    use_container: true,
    template_column_count: 3,
    description: 'column count with container',
  },
  {
    items: ['1', '2', '3'],
    use_container: true,
    template_column_count: 3,
    is_fluid: true,
    description: 'column count with fluid container',
  },
  {
    items: ['1', '2', '3'],
    use_container: false,
    template_column_count: 3,
    description: 'column count without container',
  },
  {
    items: ['1', '2'],
    use_container: true,
    row_element: 'section',
    column_element: 'span',
    description: 'custom elements with container',
  },
  {
    items: ['1', '2'],
    use_container: false,
    row_element: 'section',
    column_element: 'span',
    description: 'custom elements without container',
  },
  {
    items: ['1'],
    use_container: true,
    row_class: 'custom-row',
    column_class: 'custom-col',
    description: 'custom classes with container',
  },
  {
    items: ['1'],
    use_container: false,
    row_class: 'custom-row',
    column_class: 'custom-col',
    description: 'custom classes without container',
  },
  {
    items: ['1', '2'],
    use_container: true,
    fill_width: true,
    description: 'fill width with container',
  },
  {
    items: ['1', '2'],
    use_container: false,
    fill_width: true,
    description: 'fill width without container',
  },
  {
    items: ['1'],
    use_container: true,
    attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
    modifier_class: 'custom-modifier',
    description: 'attributes and modifier class with container',
  },
  {
    items: ['1'],
    use_container: false,
    attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
    modifier_class: 'custom-modifier',
    description: 'attributes and modifier class without container',
  },
];

describe('Grid', () => {
  each(dataProviderGrid()).test('renders correctly %s', async (props) => {
    await dom(template, props);
  });
});

describe('Grid Container', () => {
  each([
    { use_container: true, is_fluid: false },
    { use_container: true, is_fluid: true },
    { use_container: false, is_fluid: false },
    { use_container: false, is_fluid: true },
  ]).test('renders %s', async (props) => {
    const c = await dom(template, { items: ['1'], ...props });

    if (props.use_container) {
      if (props.is_fluid) {
        expect(c.querySelectorAll('.container')).toHaveLength(0);
        expect(c.querySelectorAll('.container-fluid')).toHaveLength(1);
      } else {
        expect(c.querySelectorAll('.container')).toHaveLength(1);
        expect(c.querySelectorAll('.container-fluid')).toHaveLength(0);
      }
    } else {
      expect(c.querySelectorAll('.container')).toHaveLength(0);
      expect(c.querySelectorAll('.container-fluid')).toHaveLength(0);
    }
  });
});

describe('Grid Row Fill Width', () => {
  each([
    { fill_width: true },
    { fill_width: false },
  ]).test('renders %s', async (props) => {
    const c = await dom(template, {
      items: ['1'],
      use_container: true,
      ...props,
    });

    if (props.fill_width) {
      expect(c.innerHTML).toContain('row--fill-width');
    }
  });
});

describe('Grid Attributes and Modifier Class', () => {
  each([
    {
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'custom-modifier',
      use_container: true,
    },
    {
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'custom-modifier',
      use_container: false,
    },
  ]).test('renders %s', async (props) => {
    const c = await dom(template, {
      items: ['1'],
      ...props,
    });

    if (props.use_container) {
      expect(c.querySelectorAll('.container.custom-modifier')).toHaveLength(1);
      expect(c.querySelectorAll('.container[data-test="true"]')).toHaveLength(1);
    } else {
      expect(c.querySelectorAll('.container')).toHaveLength(0);
      expect(c.querySelectorAll('.row.custom-modifier')).toHaveLength(1);
      expect(c.querySelectorAll('.row[data-test="true"]')).toHaveLength(1);
    }
  });
});

describe('Grid Custom Elements', () => {
  each([
    {
      row_element: 'section',
      column_element: 'span',
    },
    {
      row_element: 'div',
      column_element: 'div',
    },
  ]).test('renders %s', async (props) => {
    const c = await dom(template, {
      items: ['1'],
      use_container: true,
      ...props,
    });

    const rowElement = props.row_element || 'div';
    const columnElement = props.column_element || 'div';
    expect(c.querySelector(rowElement)).toBeTruthy();
    expect(c.querySelector(columnElement)).toBeTruthy();
  });
});

describe('Grid Custom Classes', () => {
  each([
    {
      template_column_count: null,
      row_class: null,
      column_class: null,
      fill_width: false,
      expectedRowClass: 'row',
      expectedColumnClass: 'col',
    },
    {
      template_column_count: null,
      row_class: null,
      column_class: null,
      fill_width: true,
      expectedRowClass: 'row row--fill-width',
      expectedColumnClass: 'col',
    },
    {
      template_column_count: 0,
      row_class: null,
      column_class: null,
      fill_width: false,
      expectedRowClass: 'row',
      expectedColumnClass: 'col',
    },
    {
      template_column_count: 0,
      row_class: null,
      column_class: null,
      fill_width: true,
      expectedRowClass: 'row row--fill-width',
      expectedColumnClass: 'col',
    },
    {
      template_column_count: 0,
      row_class: 'custom-row',
      column_class: 'custom-col',
      fill_width: false,
      expectedRowClass: 'row custom-row',
      expectedColumnClass: 'col custom-col',
    },
    {
      template_column_count: 0,
      row_class: 'custom-row',
      column_class: 'custom-col',
      fill_width: true,
      expectedRowClass: 'row row--fill-width custom-row',
      expectedColumnClass: 'col custom-col',
    },
    {
      template_column_count: 12,
      row_class: null,
      column_class: null,
      fill_width: false,
      expectedRowClass: 'row',
      expectedColumnClass: 'col-xxs-12 col-m-1',
    },
    {
      template_column_count: 12,
      row_class: null,
      column_class: null,
      fill_width: true,
      expectedRowClass: 'row row--fill-width',
      expectedColumnClass: 'col-xxs-12 col-m-1',
    },
    {
      template_column_count: 12,
      row_class: 'custom-row',
      column_class: null,
      fill_width: false,
      expectedRowClass: 'row custom-row',
      expectedColumnClass: 'col-xxs-12 col-m-1',
    },
    {
      template_column_count: 12,
      row_class: 'custom-row',
      column_class: null,
      fill_width: true,
      expectedRowClass: 'row row--fill-width custom-row',
      expectedColumnClass: 'col-xxs-12 col-m-1',
    },
    {
      template_column_count: 12,
      row_class: 'custom-row',
      column_class: 'custom-col',
      fill_width: false,
      expectedRowClass: 'row custom-row',
      expectedColumnClass: 'col-xxs-12 col-m-1 custom-col',
    },
    {
      template_column_count: 12,
      row_class: 'custom-row',
      column_class: 'custom-col',
      fill_width: true,
      expectedRowClass: 'row row--fill-width custom-row',
      expectedColumnClass: 'col-xxs-12 col-m-1 custom-col',
    },
  ]).test('renders %s', async (props) => {
    const c = await dom(template, {
      items: ['1'],
      use_container: true,
      ...props,
    });

    expect(c.querySelector('div:nth-child(1)>div:nth-child(1)').outerHTML)
      .toContain(`class="${props.expectedRowClass}"`);
    expect(c.querySelector('div:nth-child(1)>div:nth-child(1)>div:nth-child(1)').outerHTML)
      .toContain(`class="${props.expectedColumnClass}"`);
  });
});

describe('Grid Template Columns (no auto breakpoint)', () => {
  each([
    { template_column_count: 12 },
    { template_column_count: 6 },
    { template_column_count: 4 },
    { template_column_count: 3 },
    { template_column_count: 2 },
    { template_column_count: 1 },
  ]).test('renders %s', async (props) => {
    const c = await dom(template, {
      items: ['1'],
      column_element: 'div',
      auto_breakpoint: false,
      ...props,
    });

    const el = c.querySelector('.row > div');
    if (props.template_column_count === 12) {
      expect(el.classList.toString()).toEqual('col-xxs-12 col-m-1');
    } else if (props.template_column_count === 6) {
      expect(el.classList.toString()).toEqual('col-xxs-12 col-m-2');
    } else if (props.template_column_count === 4) {
      expect(el.classList.toString()).toEqual('col-xxs-12 col-m-3');
    } else if (props.template_column_count === 3) {
      expect(el.classList.toString()).toEqual('col-xxs-12 col-m-4');
    } else if (props.template_column_count === 2) {
      expect(el.classList.toString()).toEqual('col-xxs-12 col-m-6');
    } else if (props.template_column_count === 1) {
      expect(el.classList.toString()).toEqual('col-xxs-12 col-m-12');
    }
  });
});

describe('Grid Template Columns with Auto Breakpoint', () => {
  each([
    { template_column_count: 12 },
    { template_column_count: 6 },
    { template_column_count: 4 },
    { template_column_count: 3 },
    { template_column_count: 2 },
    { template_column_count: 1 },
  ]).test('renders %s', async (props) => {
    const c = await dom(template, {
      items: ['1'],
      column_element: 'div',
      auto_breakpoint: true,
      ...props,
    });

    const el = c.querySelector('.row > div');
    if (props.template_column_count === 12) {
      expect(el.classList.toString()).toEqual('col-xxs-12 col-m-1');
    } else if (props.template_column_count === 6) {
      expect(el.classList.toString()).toEqual('col-xxs-12 col-m-6 col-xl-4 col-xxl-2');
    } else if (props.template_column_count === 4) {
      expect(el.classList.toString()).toEqual('col-xxs-12 col-m-6 col-xl-4 col-xxl-3');
    } else if (props.template_column_count === 3) {
      expect(el.classList.toString()).toEqual('col-xxs-12 col-m-6 col-xl-4');
    } else if (props.template_column_count === 2) {
      expect(el.classList.toString()).toEqual('col-xxs-12 col-m-6');
    } else if (props.template_column_count === 1) {
      expect(el.classList.toString()).toEqual('col-xxs-12');
    }
  });
});

describe('Grid Attribute Handling', () => {
  test('renders with null attributes', async () => {
    const c = await dom(template, {
      items: ['1'],
      use_container: true,
      attributes: null,
    });

    expect(c.querySelectorAll('.container')).toHaveLength(1);
    expect(c.querySelectorAll('.row')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders with undefined attributes', async () => {
    const c = await dom(template, {
      items: ['1'],
      use_container: true,
      attributes: undefined,
    });

    expect(c.querySelectorAll('.container')).toHaveLength(1);
    expect(c.querySelectorAll('.row')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders with null row_attributes', async () => {
    const c = await dom(template, {
      items: ['1'],
      use_container: true,
      row_attributes: null,
    });

    expect(c.querySelectorAll('.container')).toHaveLength(1);
    expect(c.querySelectorAll('.row')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders with null column_attributes', async () => {
    const c = await dom(template, {
      items: ['1', '2'],
      use_container: true,
      column_attributes: null,
    });

    expect(c.querySelectorAll('.container')).toHaveLength(1);
    expect(c.querySelectorAll('.row')).toHaveLength(1);
    expect(c.querySelectorAll('.col')).toHaveLength(2);

    assertUniqueCssClasses(c);
  });

  test('merges attributes and row_attributes correctly', async () => {
    const c = await dom(template, {
      items: ['1'],
      use_container: true,
      attributes: new DrupalAttribute().setAttribute('data-grid', 'test'),
      row_attributes: new DrupalAttribute().setAttribute('data-row', 'row-test'),
    });

    expect(c.querySelectorAll('.container[data-grid="test"]')).toHaveLength(1);
    expect(c.querySelectorAll('.row[data-grid="test"][data-row="row-test"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('applies column_attributes to all columns', async () => {
    const c = await dom(template, {
      items: ['1', '2', '3'],
      use_container: true,
      column_attributes: new DrupalAttribute().setAttribute('data-col', 'col-test'),
    });

    expect(c.querySelectorAll('.col[data-col="col-test"]')).toHaveLength(3);

    assertUniqueCssClasses(c);
  });

  test('renders with multiple DrupalAttribute properties on container', async () => {
    const c = await dom(template, {
      items: ['1'],
      use_container: true,
      attributes: new DrupalAttribute()
        .setAttribute('data-test', 'true')
        .setAttribute('data-custom', 'value')
        .setAttribute('id', 'grid-1'),
    });

    expect(c.querySelector('.container').getAttribute('data-test')).toEqual('true');
    expect(c.querySelector('.container').getAttribute('data-custom')).toEqual('value');
    expect(c.querySelector('.container').getAttribute('id')).toEqual('grid-1');

    assertUniqueCssClasses(c);
  });

  test('renders with multiple DrupalAttribute properties on row', async () => {
    const c = await dom(template, {
      items: ['1'],
      use_container: true,
      row_attributes: new DrupalAttribute()
        .setAttribute('data-test', 'true')
        .setAttribute('data-custom', 'value')
        .setAttribute('id', 'row-1'),
    });

    expect(c.querySelector('.row').getAttribute('data-test')).toEqual('true');
    expect(c.querySelector('.row').getAttribute('data-custom')).toEqual('value');
    expect(c.querySelector('.row').getAttribute('id')).toEqual('row-1');

    assertUniqueCssClasses(c);
  });

  test('renders with multiple DrupalAttribute properties on columns', async () => {
    const c = await dom(template, {
      items: ['1', '2'],
      use_container: true,
      column_attributes: new DrupalAttribute()
        .setAttribute('data-test', 'true')
        .setAttribute('data-custom', 'value'),
    });

    c.querySelectorAll('.col').forEach((col) => {
      expect(col.getAttribute('data-test')).toEqual('true');
      expect(col.getAttribute('data-custom')).toEqual('value');
    });

    assertUniqueCssClasses(c);
  });

  test('renders without container and applies attributes to row', async () => {
    const c = await dom(template, {
      items: ['1'],
      use_container: false,
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
    });

    expect(c.querySelectorAll('.container')).toHaveLength(0);
    expect(c.querySelectorAll('.row[data-test="true"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders with aria-live attribute on container', async () => {
    const c = await dom(template, {
      items: ['1'],
      use_container: true,
    });

    expect(c.querySelector('.container').getAttribute('aria-live')).toEqual('polite');

    assertUniqueCssClasses(c);
  });

  test('preserves custom attributes when merging with row attributes', async () => {
    const c = await dom(template, {
      items: ['1', '2'],
      use_container: true,
      attributes: new DrupalAttribute()
        .setAttribute('data-attr1', 'value1')
        .setAttribute('data-attr2', 'value2'),
      row_attributes: new DrupalAttribute()
        .setAttribute('data-attr3', 'value3')
        .setAttribute('data-attr4', 'value4'),
    });

    const row = c.querySelector('.row');
    expect(row.getAttribute('data-attr1')).toEqual('value1');
    expect(row.getAttribute('data-attr2')).toEqual('value2');
    expect(row.getAttribute('data-attr3')).toEqual('value3');
    expect(row.getAttribute('data-attr4')).toEqual('value4');

    assertUniqueCssClasses(c);
  });

  test('handles empty items array gracefully', async () => {
    const c = await dom(template, {
      items: [],
      use_container: true,
    });

    expect(c.querySelectorAll('.container')).toHaveLength(0);
    expect(c.querySelectorAll('.row')).toHaveLength(0);
  });

  test('renders with fluid container and attributes', async () => {
    const c = await dom(template, {
      items: ['1'],
      use_container: true,
      is_fluid: true,
      attributes: new DrupalAttribute().setAttribute('data-fluid', 'true'),
    });

    expect(c.querySelectorAll('.container-fluid[data-fluid="true"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('applies modifier_class with attributes correctly', async () => {
    const c = await dom(template, {
      items: ['1'],
      use_container: true,
      modifier_class: 'custom-grid',
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
    });

    expect(c.querySelectorAll('.container.custom-grid[data-test="true"]')).toHaveLength(1);
    expect(c.querySelectorAll('.row.custom-grid')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders column attributes with custom column element', async () => {
    const c = await dom(template, {
      items: ['1', '2'],
      use_container: true,
      column_element: 'span',
      column_attributes: new DrupalAttribute().setAttribute('data-col', 'span-col'),
    });

    expect(c.querySelectorAll('span.col[data-col="span-col"]')).toHaveLength(2);

    assertUniqueCssClasses(c);
  });
});

describe('Grid Edge Cases', () => {
  test('renders with empty string modifier_class', async () => {
    const c = await dom(template, {
      items: ['1'],
      use_container: true,
      modifier_class: '',
    });

    expect(c.querySelectorAll('.container')).toHaveLength(1);
    expect(c.querySelectorAll('.row')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders with items containing empty strings', async () => {
    const c = await dom(template, {
      items: ['content1', '', 'content2'],
      use_container: true,
    });

    expect(c.querySelectorAll('.col')).toHaveLength(2);

    assertUniqueCssClasses(c);
  });

  test('renders with zero template_column_count', async () => {
    const c = await dom(template, {
      items: ['1', '2'],
      use_container: true,
      template_column_count: 0,
    });

    expect(c.querySelectorAll('.col')).toHaveLength(2);

    assertUniqueCssClasses(c);
  });

  test('renders with custom row and column classes and attributes', async () => {
    const c = await dom(template, {
      items: ['1', '2'],
      use_container: true,
      row_class: 'my-row',
      column_class: 'my-col',
      row_attributes: new DrupalAttribute().setAttribute('data-row', 'custom'),
      column_attributes: new DrupalAttribute().setAttribute('data-col', 'custom'),
    });

    expect(c.querySelectorAll('.row.my-row[data-row="custom"]')).toHaveLength(1);
    expect(c.querySelectorAll('.col.my-col[data-col="custom"]')).toHaveLength(2);

    assertUniqueCssClasses(c);
  });

  test('renders with all possible attributes combined', async () => {
    const c = await dom(template, {
      items: ['1', '2', '3'],
      use_container: true,
      is_fluid: true,
      template_column_count: 3,
      fill_width: true,
      row_element: 'section',
      column_element: 'article',
      row_class: 'custom-row',
      column_class: 'custom-col',
      modifier_class: 'custom-grid',
      attributes: new DrupalAttribute().setAttribute('data-grid', 'main'),
      row_attributes: new DrupalAttribute().setAttribute('data-row', 'row1'),
      column_attributes: new DrupalAttribute().setAttribute('data-col', 'col1'),
    });

    expect(c.querySelectorAll('.container-fluid.custom-grid[data-grid="main"]')).toHaveLength(1);
    expect(c.querySelectorAll('section.row.row--fill-width.custom-row.custom-grid[data-grid="main"][data-row="row1"]')).toHaveLength(1);
    expect(c.querySelectorAll('article.custom-col[data-col="col1"]')).toHaveLength(3);

    assertUniqueCssClasses(c);
  });
});