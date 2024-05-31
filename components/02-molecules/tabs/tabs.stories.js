import CivicThemeTabs from './tabs.twig';
import './tabs';
import { knobBoolean, knobNumber, knobRadios, knobText, placeholder, randomText, randomUrl, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Molecules/Tabs',
};

export const Tabs = (props = {}) => {
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
    tabs_count: knobNumber(
      'Tabs count',
      3,
      {
        range: true,
        min: 0,
        max: 10,
        step: 1,
      },
      props.tabs_count,
      props.knobTab,
    ),
    with_panels: knobBoolean('With panels', true, props.with_panels, props.knobTab),
    vertical_spacing: knobRadios(
      'Vertical spacing',
      {
        None: 'none',
        Top: 'top',
        Bottom: 'bottom',
        Both: 'both',
      },
      'none',
      props.vertical_spacing,
      props.knobTab,
    ),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
    modifier_class: knobText('Additional classes', '', props.modifier_class, props.knobTab),
  };

  let panelKnobs = {};

  if (knobs.with_panels) {
    // Use panels.
    const panels = [];

    for (let i = 1; i <= knobs.tabs_count; i++) {
      panels.push({
        id: `tab-${i}`,
        title: `Panel ${i} title `,
        content: placeholder(`Panel ${i} content ${randomText()}`),
      });
    }

    panelKnobs = {
      panels,
    };
  } else {
    // Use tabs.
    const links = [];
    for (let i = 1; i <= knobs.tabs_count; i++) {
      links.push({
        text: `Tab ${i} title `,
        url: randomUrl(),
        modifier_class: i === 1 ? 'ct-tabs__tab--selected' : '',
      });
    }

    panelKnobs = {
      links,
    };
  }

  const combinedKnobs = { ...knobs, ...panelKnobs };

  return shouldRender(props) ? CivicThemeTabs(combinedKnobs) : combinedKnobs;
};
