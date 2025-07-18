export default {
  args: (theme = 'light') => ({
    theme,
    title: 'Snippet name which runs across two or three lines',
    summary: 'Summary of the snippet',
    link: {
      url: 'https://example.com',
      is_new_window: false,
    },
    tags: [
      'Tag 1',
      'Tag 2',
    ],
    show_as_card: false,
    is_title_click: false,
    content_top: '',
    content_middle: '',
    content_bottom: '',
    modifier_class: '',
    attributes: '',
  }),
};
