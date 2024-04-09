export default {
  title: 'Base/CSSGrid',
  parameters: {
    layout: 'fullscreen',
  },
};

export const CSSGrid = () => `
<div class="grid gap-col-4 gap-row-2">
<div class="col-12 row-1">
    Header
</div>
<div class="col-9 row-2">
    Navigation
</div>
<div class="col-3 row-2 row-3 row-4">
    Sidebar
</div>
<div class=" col-9 row-3">
    Main Content
</div>
<div class="col-9 row-4">
    Main Content
</div>
<div class="col-12 row-5">
    Footer
</div>
</div>
`;
