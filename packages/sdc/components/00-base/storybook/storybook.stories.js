/**
 * CivicTheme Storybook utilities demonstration stories.
 *
 * Demonstrates the story container, docs, and placeholder CSS classes
 * available for use in component stories.
 */

import { placeholder } from './storybook.generators.utils';

export default {
  title: 'Base/Storybook/Containers',
  parameters: {
    layout: 'fullscreen',
  },
};

export const StoryContainers = {
  render: () => {
    let html = '';

    html += '<div class="story-container">';
    html += '<div class="story-container__title">Story Container</div>';
    html += '<div class="story-container__content">';
    html += placeholder('Use <code>.story-container</code> to wrap story sections with titles and subtitles.');
    html += '</div>';
    html += '</div>';

    html += '<div class="story-container">';
    html += '<div class="story-container__title">Container with subtitle</div>';
    html += '<div class="story-container__subtitle">Subtitle for context</div>';
    html += '<div class="story-container__content">';
    html += placeholder('Content goes here');
    html += '</div>';
    html += '<div class="story-container__subtitle">Another subtitle</div>';
    html += '<div class="story-container__content">';
    html += placeholder('More content');
    html += '</div>';
    html += '</div>';

    html += '<div class="story-container story-container--columns story-container--columns--2">';
    html += '<div class="story-container__column story-container__column--light">';
    html += '<div class="story-container__title">Light theme</div>';
    html += '<div class="story-container__content">';
    html += placeholder('Light theme column');
    html += '</div>';
    html += '</div>';
    html += '<div class="story-container__column story-container__column--dark">';
    html += '<div class="story-container__title">Dark theme</div>';
    html += '<div class="story-container__content">';
    html += placeholder('Dark theme column');
    html += '</div>';
    html += '</div>';
    html += '</div>';

    return html;
  },
};

export const Placeholders = {
  render: () => {
    let html = '<div class="story-container">';

    html += '<div class="story-container__title">Placeholder variants</div>';

    html += '<div class="story-container__subtitle"><code>.story-placeholder</code> — Full width (default)</div>';
    html += '<div class="story-container__content">';
    html += placeholder('Full width placeholder');
    html += '</div>';

    html += '<div class="story-container__subtitle"><code>.story-placeholder--hugged</code> — Width: auto</div>';
    html += '<div class="story-container__content">';
    html += '<div class="story-placeholder--hugged" contenteditable="true">Hugged placeholder</div>';
    html += '</div>';

    html += '<div class="story-container__subtitle"><code>.story-placeholder--fixed</code> — Fixed width</div>';
    html += '<div class="story-container__content">';
    html += '<div class="story-placeholder--fixed" contenteditable="true">Fixed width placeholder</div>';
    html += '</div>';

    html += '<div class="story-container__title">Slots</div>';

    html += '<div class="story-container__subtitle"><code>.story-slot</code> — Empty component slot</div>';
    html += '<div class="story-container__content">';
    html += '<div class="story-slot">Slot placeholder</div>';
    html += '</div>';

    html += '</div>';

    return html;
  },
};
