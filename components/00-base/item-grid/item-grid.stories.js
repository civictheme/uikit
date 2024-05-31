import CivicThemeItemGrid from './item-grid.twig';
import { generateItems, knobBoolean, knobNumber, knobText, placeholder, shouldRender } from '../base.utils';

export default {
  title: 'Base/Item Grid',
};

export const ItemGrid = (props = {}) => {
  const knobs = {
    column_count: knobNumber(
      'Columns',
      4,
      {
        range: true,
        min: 0,
        max: 4,
        step: 1,
      },
      props.column_count,
      props.knobTab,
    ),
    fill_width: knobBoolean('Fill width', false, props.fill_width, props.knobTab),
    number_of_items: knobNumber(
      'Number of items',
      4,
      {
        range: true,
        min: 0,
        max: 7,
        step: 1,
      },
      props.number_of_items,
      props.knobTab,
    ),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
  };

  knobs.items = generateItems(knobs.number_of_items, placeholder());

  return shouldRender(props) ? CivicThemeItemGrid(knobs) : knobs;
};
