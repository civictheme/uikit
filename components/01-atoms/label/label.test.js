const template = 'components/01-atoms/label/label.twig';

describe('Label Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      content: 'Sample label',
      tag: 'label',
    });

    expect(c.querySelectorAll('.ct-label')).toHaveLength(1);
    expect(c.querySelector('.ct-label').textContent.trim()).toEqual('Sample label');
    expect(c.querySelector('.ct-label').tagName.toLowerCase()).toEqual('label');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      content: 'Sample label',
      theme: 'dark',
      tag: 'legend',
      size: 'large',
      is_required: true,
      required_text: '(custom-required)',
      for: 'input-id',
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
    });

    expect(c.querySelectorAll('.ct-label.custom-class.ct-theme-dark.ct-label--large.ct-label--required')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-label.ct-label--required .ct-label__required')).toHaveLength(1);
    expect(c.querySelector('.ct-label__required').textContent.trim()).toEqual('(custom-required)');
    expect(c.querySelector('.ct-label').textContent.trim()).toEqual('Sample label (custom-required)');
    expect(c.querySelector('.ct-label').tagName.toLowerCase()).toEqual('legend');
    expect(c.querySelector('.ct-label').getAttribute('for')).toEqual('input-id');
    expect(c.querySelector('.ct-label').getAttribute('data-test')).toEqual('true');

    assertUniqueCssClasses(c);
  });

  test('renders with default tag and size when invalid values are provided', async () => {
    const c = await dom(template, {
      content: 'Sample label',
      tag: 'b', // Invalid value
      size: 'huge', // Invalid value
    });

    expect(c.querySelectorAll('.ct-label.ct-label--regular')).toHaveLength(1); // Default size is 'regular'
    expect(c.querySelector('.ct-label').tagName.toLowerCase()).toEqual('label'); // Default tag is 'label'
    expect(c.querySelector('.ct-label').textContent.trim()).toEqual('Sample label');

    assertUniqueCssClasses(c);
  });

  test('does not render when content is empty', async () => {
    const c = await dom(template, {
      content: '',
    });

    expect(c.querySelectorAll('.ct-label')).toHaveLength(0);
  });

  test('strips HTML tags from attribute values', async () => {
    const c = await dom(template, {
      content: 'Sample label',
      attributes: 'data-test="<script>alert(1)</script>"',
    });

    expect(c.querySelector('.ct-label').textContent.trim()).toEqual('Sample label');
    expect(c.querySelector('.ct-label').getAttribute('data-test')).toEqual('<script>alert(1)</script>');

    assertUniqueCssClasses(c);
  });

  test('allows HTML content', async () => {
    const c = await dom(template, {
      content: 'Start <strong>prefix</strong> middle <script>alert(‘XSS’)</script> end',
      allow_html: true,
    });

    expect(c.querySelectorAll('.ct-label')).toHaveLength(1);
    expect(c.querySelector('.ct-label').innerHTML.trim()).toContain('Start <strong>prefix</strong> middle <script>alert(‘XSS’)</script> end');

    assertUniqueCssClasses(c);
  });

  test('strips HTML content', async () => {
    const c = await dom(template, {
      content: 'Start <strong>prefix</strong> middle <script>alert("XSS")</script> end',
      allow_html: false,
    });

    expect(c.querySelectorAll('.ct-label')).toHaveLength(1);

    const content = c.querySelector('.ct-label').innerHTML.trim();
    expect(content).not.toContain('Start <strong>prefix</strong> middle <script>alert("XSS")</script> end');
    expect(content).toContain('Start &lt;strong&gt;prefix&lt;/strong&gt; middle &lt;script&gt;alert("XSS")&lt;/script&gt; end');

    assertUniqueCssClasses(c);
  });
});
