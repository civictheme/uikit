import { number } from '@storybook/addon-knobs';
import CivicThemeLayoutGrid from './layout-grid.twig';

export default {
  title: 'Base/Layout Grid',
  parameters: {
    layout: 'fullscreen',
  },
};

export const LayoutGrid = () => {
  const grid = [
    ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
    ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'S', 'S', 'S'],
    ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'S', 'S', 'S'],
    ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'S', 'S', 'S'],
    ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
  ];

  const map = {
    H: 'Header',
    N: 'Navigation',
    C: 'Main Content',
    S: 'Sidebar',
    F: 'Footer',
  };

  const generalKnobs = {
    grid,
    map,
    gap_col: number('Column gap', 1),
    gap_row: number('Row gap', 1),
  };

  return CivicThemeLayoutGrid({
    ...generalKnobs,
  });
};
