import { render } from 'twig-testing-library';
import each from 'jest-each';

const template = 'components/00-base/grid/grid.twig';

// Data provider for different test cases
const dataProviderGrid = () => [
  {
    items: [1],
    use_container: true,
    description: 'with container',
  },
  {
    items: [1],
    use_container: false,
    description: 'without container',
  },
  {
    items: [1, 2],
    use_container: true,
    description: 'multiple items with container',
  },
  {
    items: [1, 2],
    use_container: true,
    is_fluid: true,
    description: 'multiple items with fluid container',
  },
  {
    items: [1, 2],
    use_container: false,
    description: 'multiple items without container',
  },
  {
    items: [1, 2, 3],
    use_container: true,
    template_column_count: 3,
    description: 'column count with container',
  },
  {
    items: [1, 2, 3],
    use_container: true,
    template_column_count: 3,
    is_fluid: true,
    description: 'column count with fluid container',
  },
  {
    items: [1, 2, 3],
    use_container: false,
    template_column_count: 3,
    description: 'column count without container',
  },
  {
    items: [1, 2],
    use_container: true,
    row_element: 'section',
    column_element: 'span',
    description: 'custom elements with container',
  },
  {
    items: [1, 2],
    use_container: false,
    row_element: 'section',
    column_element: 'span',
    description: 'custom elements without container',
  },
  {
    items: [1],
    use_container: true,
    row_class: 'custom-row',
    column_class: 'custom-col',
    description: 'custom classes with container',
  },
  {
    items: [1],
    use_container: false,
    row_class: 'custom-row',
    column_class: 'custom-col',
    description: 'custom classes without container',
  },
  {
    items: [1, 2],
    use_container: true,
    fill_width: true,
    description: 'fill width with container',
  },
  {
    items: [1, 2],
    use_container: false,
    fill_width: true,
    description: 'fill width without container',
  },
  {
    items: [1],
    use_container: true,
    attributes: 'data-test="true"',
    modifier_class: 'custom-modifier',
    description: 'attributes and modifier class with container',
  },
  {
    items: [1],
    use_container: false,
    attributes: 'data-test="true"',
    modifier_class: 'custom-modifier',
    description: 'attributes and modifier class without container',
  },
];

describe('Grid', () => {
  each(dataProviderGrid()).test('renders correctly %s', async (props) => {
    const { container } = await render(template, props);

    expect(container).toMatchSnapshot();
  });
});

describe('Grid Container', () => {
  each([
    { use_container: true, is_fluid: false },
    { use_container: true, is_fluid: true },
    { use_container: false, is_fluid: false },
    { use_container: false, is_fluid: true },
  ]).test('renders %s', async (props) => {
    const { container } = await render(template, { items: [1], ...props });

    if (props.use_container) {
      if (props.is_fluid) {
        expect(container.querySelectorAll('.container')).toHaveLength(0);
        expect(container.querySelectorAll('.container-fluid')).toHaveLength(1);
      } else {
        expect(container.querySelectorAll('.container')).toHaveLength(1);
        expect(container.querySelectorAll('.container-fluid')).toHaveLength(0);
      }
    } else {
      expect(container.querySelectorAll('.container')).toHaveLength(0);
      expect(container.querySelectorAll('.container-fluid')).toHaveLength(0);
    }
  });
});

describe('Grid Row Fill Width', () => {
  each([
    { fill_width: true },
    { fill_width: false },
  ]).test('renders %s', async (props) => {
    const { container } = await render(template, {
      items: [1],
      use_container: true,
      ...props,
    });

    if (props.fill_width) {
      expect(container.innerHTML).toContain('row--fill-width');
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
    const { container } = await render(template, {
      items: [1],
      ...props,
    });

    if (props.use_container) {
      expect(container.querySelectorAll('.container.custom-modifier')).toHaveLength(1);
      expect(container.querySelectorAll('.container[data-test="true"]')).toHaveLength(1);
    } else {
      expect(container.querySelectorAll('.container')).toHaveLength(0);
      expect(container.querySelectorAll('.row.custom-modifier')).toHaveLength(1);
      expect(container.querySelectorAll('.row[data-test="true"]')).toHaveLength(1);
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
    const { container } = await render(template, {
      items: [1],
      use_container: true,
      ...props,
    });

    const rowElement = props.row_element || 'div';
    const columnElement = props.column_element || 'div';
    expect(container.querySelector(rowElement)).toBeTruthy();
    expect(container.querySelector(columnElement)).toBeTruthy();
  });
});

/**
 * @group wip1
 */
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
    const { container } = await render(template, {
      items: [1],
      use_container: true,
      ...props,
    });

    expect(container.querySelector('div:nth-child(1)>div:nth-child(1)').innerHTML)
      .toContain(`class="${props.expectedRowClass}"`);
    expect(container.querySelector('div:nth-child(1)>div:nth-child(1)>div:nth-child(1)').innerHTML)
      .toContain(`class="${props.expectedColumnClass}"`);
  });
});
