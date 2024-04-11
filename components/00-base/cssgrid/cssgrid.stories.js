export default {
  title: 'Base/CSSGrid',
  parameters: {
    layout: 'fullscreen',
  },
};

export const CSSGrid = () => `
<div class="example-container">
  <div class="example-container__title">CSS grid layout</div>
  <div class="story-cssgrid-wrapper">
  <div class="cssgrid gap-col-4 gap-row-2">
        <div class="col-12 row-1">
            <span>Header</span>
        </div>
        <div class="col-9 row-2">
            <span>Navigation</span>
        </div>
        <div class="col-3 row-2 row-3 row-4">
            <span>Sidebar</span>
        </div>
        <div class="col-9 row-3 row-4">
            <span>Main Content</span>
        </div>
        <div class="col-12 row-5">
            <span>Footer</span>
        </div>
        </div>
    </div>
  </div>
</div>`;
