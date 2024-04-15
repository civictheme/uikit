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
      <div class="ct-cssgrid">
        <div class="ct-cssgrid-12-3">
          <div class="ct-cssgrid-col-12 ct-cssgrid-row-1">
              <span>Header</span>
          </div>
          <div class="ct-cssgrid-col-9 ct-cssgrid-row-2">
              <span>Navigation</span>
          </div>
          <div class="ct-cssgrid-col-3 ct-cssgrid-row-2 ct-cssgrid-row-3">
              <span>Sidebar</span>
          </div>
          <div class="ct-cssgrid-col-9 ct-cssgrid-row-3 ct-cssgrid-row-3">
              <span>Main Content</span>
          </div>
          <div class="ct-cssgrid-col-12 ct-cssgrid-row-3">
              <span>Footer</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
