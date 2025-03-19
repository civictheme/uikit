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
    attributes: 'data-test="true"',
    modifier_class: 'custom-modifier',
    description: 'attributes and modifier class with container',
  },
  {
    items: ['1'],
    use_container: false,
    attributes: 'data-test="true"',
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
      attributes: 'data-test="true"',
      modifier_class: 'custom-modifier',
      use_container: true,
    },
    {
      attributes: 'data-test="true"',
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
