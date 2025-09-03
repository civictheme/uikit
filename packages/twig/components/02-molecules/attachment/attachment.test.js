const template = 'components/02-molecules/attachment/attachment.twig';

describe('Attachment Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      files: [
        { name: 'File 1', ext: 'pdf', url: 'https://example.com/file1.pdf', size: '1MB', created: '2023-01-01', changed: '2023-01-02', icon: 'pdf-file' },
        { name: 'File 2', ext: 'docx', url: 'https://example.com/file2.docx', size: '2MB', created: '2023-01-03', changed: '2023-01-04', icon: 'word-file' },
      ],
    });

    expect(c.querySelectorAll('.ct-attachment')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-attachment__links__link')).toHaveLength(2);
    expect(c.querySelector('.ct-attachment__links__link').textContent.trim()).toContain('File 1');
    expect(c.querySelector('.ct-attachment__links__link__changed').textContent.trim()).toContain('LAST UPDATED: 2023-01-02');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      content_top: 'Top content',
      title: 'Attachment Title',
      content: 'Attachment content',
      files: [
        { name: 'File 1', ext: 'pdf', url: 'https://example.com/file1.pdf', size: '1MB', created: '2023-01-01', changed: '2023-01-02', icon: 'pdf-file' },
      ],
      content_bottom: 'Bottom content',
      theme: 'dark',
      vertical_spacing: 'both',
      with_background: true,
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
    });

    expect(c.querySelectorAll('.ct-attachment.custom-class.ct-theme-dark.ct-attachment--with-background.ct-vertical-spacing-inset--both')).toHaveLength(1);
    expect(c.querySelector('.ct-attachment__content-top').textContent.trim()).toEqual('Top content');
    expect(c.querySelector('.ct-attachment__title').textContent.trim()).toEqual('Attachment Title');
    expect(c.querySelector('.ct-attachment__content').textContent.trim()).toEqual('Attachment content');
    expect(c.querySelector('.ct-attachment__content-bottom').textContent.trim()).toEqual('Bottom content');
    expect(c.querySelector('.ct-attachment').getAttribute('data-test')).toEqual('true');
    expect(c.querySelector('.ct-attachment__links__link').textContent.trim()).toContain('File 1');

    assertUniqueCssClasses(c);
  });

  test('does not render when files are empty', async () => {
    const c = await dom(template, {
      files: [],
    });

    expect(c.querySelectorAll('.ct-attachment')).toHaveLength(0);
  });

  test('renders with multiple files and attributes', async () => {
    const c = await dom(template, {
      files: [
        { name: 'File 1', ext: 'pdf', url: 'https://example.com/file1.pdf', size: '1MB', created: '2023-01-01', changed: '2023-01-02', icon: 'pdf-file' },
        { name: 'File 2', ext: 'docx', url: 'https://example.com/file2.docx', size: '2MB', created: '2023-01-03', changed: '2023-01-04', icon: 'word-file' },
        { name: 'File without extension', url: 'https://example.com/file3' },
        { name: 'File with only extension', ext: 'txt', url: 'https://example.com/file4.txt' },
        { name: 'File with only size', url: 'https://example.com/file5', size: '500KB' },
      ],
    });

    expect(c.querySelectorAll('.ct-attachment__links__link')).toHaveLength(5);
    expect(c.querySelectorAll('.ct-attachment__links__link')[0].textContent.trim()).toContain('File 1');
    expect(c.querySelectorAll('.ct-attachment__links__link')[1].textContent.trim()).toContain('File 2');
    expect(c.querySelectorAll('.ct-attachment__links__link__changed')[0].textContent.trim()).toContain('LAST UPDATED: 2023-01-02');
    expect(c.querySelectorAll('.ct-attachment__links__link__changed')[1].textContent.trim()).toContain('LAST UPDATED: 2023-01-04');

    expect(c.querySelectorAll('.ct-attachment__links__link')[2].textContent.trim()).toBe('File without extension');
    expect(c.querySelectorAll('.ct-attachment__links__link')[2].textContent.trim()).not.toContain('docx');
    expect(c.querySelectorAll('.ct-attachment__links__link')[2].textContent.trim()).not.toContain('2MB');

    expect(c.querySelectorAll('.ct-attachment__links__link')[3].textContent.trim()).toContain('File with only extension');
    expect(c.querySelectorAll('.ct-attachment__links__link')[3].textContent.trim()).toContain('(txt)');

    expect(c.querySelectorAll('.ct-attachment__links__link')[4].textContent.trim()).toContain('File with only size');
    expect(c.querySelectorAll('.ct-attachment__links__link')[4].textContent.trim()).toContain('(500KB)');
  });
});
