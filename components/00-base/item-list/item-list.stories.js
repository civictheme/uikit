import CivicThemeItemList from './item-list.twig';
import { generateItems, knobBoolean, knobNumber, knobRadios, knobText, placeholder, randomSentence, shouldRender } from '../base.utils';

export default {
  title: 'Base/Item List',
  parameters: {
    layout: 'centered',
  },
};

export const ItemList = (props = {}) => {
  const knobs = {
    direction: knobRadios(
      'Direction',
      {
        Horizontal: 'horizontal',
        Vertical: 'vertical',
      },
      'horizontal',
      props.direction,
      props.knobTab,
    ),
    size: knobRadios(
      'Size',
      {
        Large: 'large',
        Regular: 'regular',
        Small: 'small',
      },
      'regular',
      props.size,
      props.knobTab,
    ),
    no_gap: knobBoolean('No gap', false, props.no_gap, props.knobTab),
    items_count: knobNumber(
      'Items count',
      5,
      {
        range: true,
        min: 0,
        max: 10,
        step: 1,
      },
      props.items_count,
      props.knobTab,
    ),
    long_placeholder_text: knobBoolean('Long placeholder text', false, props.long_placeholder_text, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
    modifier_class: `story-wrapper-size--large ${knobText('Additional class', '', props.modifier_class, props.knobTab)}`,
  };
  knobs.items = generateItems(
    knobs.items_count,
    placeholder(knobs.long_placeholder_text ? randomSentence(30) : 'Content placeholder'),
  );

  return shouldRender(props) ? CivicThemeItemList(knobs) : knobs;
};
