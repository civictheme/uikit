import {
  boolean, number, radios, text,
} from '@storybook/addon-knobs';
import CivicThemeBreadcrumb from './breadcrumb.twig';
import { randomLinks } from '../../00-base/base.utils';

export default {
  title: 'Molecules/Breadcrumb',
};

export const Breadcrumb = (knobTab, doRender = true, useKnobs = true, defaultTheme = 'light') => {
  const generalKnobTab = typeof knobTab === 'string' ? knobTab : 'General';

  const generalKnobs = {
    theme: useKnobs ? radios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      defaultTheme,
      generalKnobTab,
    ) : defaultTheme,
    active_is_link: useKnobs ? boolean('Active is a link', false, generalKnobTab) : false,
    links: useKnobs ? randomLinks(number(
      'Count of links',
      3,
      {
        range: true,
        min: 0,
        max: 10,
        step: 1,
      },
      generalKnobTab,
    ), number(
      'Length of links',
      6,
      {
        range: true,
        min: 6,
        max: 100,
        step: 1,
      },
      generalKnobTab,
    ) - 6) : randomLinks(3, 6),
    modifier_class: useKnobs ? text('Additional classes', '', generalKnobTab) : '',
    attributes: useKnobs ? text('Additional attributes', '', generalKnobTab) : '',
  };

  return doRender ? CivicThemeBreadcrumb({
    ...generalKnobs,
  }) : generalKnobs;
};
