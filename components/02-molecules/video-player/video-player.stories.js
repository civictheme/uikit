import Component from './video-player.twig';

const meta = {
  title: 'Molecules/Video Player',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    sources: {
      control: { type: 'array' },
    },
    poster: {
      control: { type: 'text' },
    },
    embedded_source: {
      control: { type: 'text' },
    },
    raw_source: {
      control: { type: 'text' },
    },
    title: {
      control: { type: 'text' },
    },
    width: {
      control: { type: 'text' },
    },
    height: {
      control: { type: 'text' },
    },
    transcript_link: {
      control: { type: 'object' },
    },
    attributes: {
      control: { type: 'text' },
    },
    modifier_class: {
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Sources = {
  parameters: {
    layout: 'centered',
  },
  args: {
    theme: 'light',
    title: '',
    width: '550',
    height: '400',
    sources: [
      {
        url: 'demo/videos/demo.webm',
        type: 'video/webm',
      },
      {
        url: 'demo/videos/demo.mp4',
        type: 'video/mp4',
      },
      {
        url: 'demo/videos/demo.avi',
        type: 'video/avi',
      },
    ],
    poster: 'demo/videos/demo_poster.png',
    embedded_source: '',
    raw_source: '',
    transcript_link: {
      text: 'View transcript',
      title: 'Open transcription in a new window',
      url: 'https://example.com',
      is_new_window: true,
      is_external: false,
      attributes: '',
    },
    attributes: '',
    modifier_class: '',
  },
};

export const EmbeddedSource = {
  parameters: {
    layout: 'centered',
  },
  args: {
    theme: 'light',
    title: 'Test video',
    width: '550',
    height: '400',
    sources: null,
    poster: '',
    embedded_source: 'https://www.youtube.com/embed/C0DPdy98e4c',
    raw_source: '',
    transcript_link: {
      text: 'View transcript',
      title: 'Open transcription in a new window',
      url: 'https://example.com',
      is_new_window: true,
      is_external: false,
      attributes: '',
    },
    attributes: '',
    modifier_class: '',
  },
};

export const RawSources = {
  parameters: {
    layout: 'centered',
  },
  args: {
    theme: 'light',
    title: '',
    width: '550',
    height: '400',
    sources: null,
    poster: '',
    embedded_source: '',
    raw_source: '<iframe allowfullscreen="" frameborder="0" height="400" src="https://www.youtube.com/embed/C0DPdy98e4c" width="550"></iframe>',
    transcript_link: {
      text: 'View transcript',
      title: 'Open transcription in a new window',
      url: 'https://example.com',
      is_new_window: true,
      is_external: false,
      attributes: '',
    },
    attributes: '',
    modifier_class: '',
  },
};
