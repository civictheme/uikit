import CivicThemeBreadcrumb from './breadcrumb.twig';
import { knobBoolean, knobNumber, knobRadios, knobText, randomLinks, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Molecules/Breadcrumb',
};

export const Breadcrumb = (props = {}) => {
  const knobs = {
    theme: knobRadios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      props.theme,
      props.knobTab,
    ),
    active_is_link: knobBoolean('Active is a link', false, props.active_is_link, props.knobTab),
    links: randomLinks(knobNumber(
      'Count of links',
      3,
      {
        range: true,
        min: 0,
        max: 10,
        step: 1,
      },
      props.count_of_links,
      props.knobTab,
    ), knobNumber(
      'Length of links',
      6,
      {
        range: true,
        min: 6,
        max: 100,
        step: 1,
      },
      props.length_of_links,
      props.knobTab,
    ) - 6),
    modifier_class: knobText('Additional classes', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeBreadcrumb(knobs) : knobs;
};
