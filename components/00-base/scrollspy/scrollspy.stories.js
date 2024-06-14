import './scrollspy';

export default {
  title: 'Base/Scrollspy',
  parameters: {
    layout: 'fullscreen',
    docs: 'Scroll the viewport to see elements appear when it reaches a specific pixel threshold.',
    docsSize: 'medium',
    docsPlacement: 'before',
  },
};

export const Scrollspy = () => `
  <div class="example-container">
    <div class="example-container__page-content example-scrollspy"></div>
    <button class="example-scrollspy-target1" data-scrollspy data-scrollspy-offset="400">
      This Button appears when the bottom of the red container reaches top when the viewport is scrolled 400px. It disappears when the viewport is scrolled back.
    </button>
    <button class="example-scrollspy-target2" data-scrollspy data-scrollspy-offset="600">
      This Button appears when the bottom of the blue container reaches top when the viewport is scrolled 600px. It disappears when the viewport is scrolled back.
    </button>
  </div>`;
