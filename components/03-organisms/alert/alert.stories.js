import { button } from '@storybook/addon-knobs';
import CivicThemeAlert from './alert.twig';
import { knobNumber, knobRadios, knobText, randomText, shouldRender } from '../../00-base/base.utils';
import './alert';

export default {
  title: 'Organisms/Alert',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Alert = (props = {}) => {
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
    type: knobRadios(
      'Type',
      {
        Information: 'information',
        Error: 'error',
        Warning: 'warning',
        Success: 'success',
      },
      'information',
      props.type,
      props.knobTab,
    ),
    title: knobText('Title', 'Site information', props.title, props.knobTab),
    description: knobText('Description', `Alert description ${randomText()}`, props.description, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  const numOfAlerts = knobNumber(
    'Number of alerts',
    1,
    {
      range: true,
      min: 1,
      max: 5,
      step: 1,
    },
    props.number_of_alerts,
    props.knobTab,
  );

  const combinedKnobsArray = [];
  for (let i = 0; i < numOfAlerts; i++) {
    combinedKnobsArray.push({
      ...knobs,
      id: i,
    });
  }

  if (shouldRender(props)) {
    let html = '';
    for (let i = 0; i < combinedKnobsArray.length; i++) {
      html += CivicThemeAlert(combinedKnobsArray[i]);
    }
    return html;
  }

  return combinedKnobsArray;
};

export const AlertApi = (props = {}) => {
  const endpointType = knobRadios(
    'Payload',
    {
      Default: 'default',
      Updated: 'updated',
      Invalid: 'invalid',
    },
    'default',
    props.endpoint_type,
    props.knobTab,
  );

  let endpoint;
  switch (endpointType) {
    case 'updated':
      endpoint = 'api/alerts2.json';
      break;

    case 'invalid':
      endpoint = 'api/alerts3.json';
      break;

    default:
      endpoint = 'api/alerts1.json';
  }

  button('Clear cookie', () => {
    document.cookie = 'ct-alert-hide=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }, 'General');

  let docs = '';
  docs += 'Dismiss alerts by clicking on [X] button.<br/><br/>';
  docs += 'Navigate to another component and return here to assert that dismissed alerts do not appear.<br/><br/>';
  docs += 'Dismissed alerts will be revealed if their content was updated. Change payload to "Updated" to see dismissed alerts appear again.<br/><br/>';
  docs += 'Press "Clear cookie" button to clear alert dismissal settings.';

  return shouldRender(props)
    ? `<div data-component-name="ct-alerts" data-alert-endpoint="${endpoint}" data-test-path="/"></div><div class="docs-container docs-container--large"><div class="docs-container__content">${docs}</div></div>`
    : '';
};
