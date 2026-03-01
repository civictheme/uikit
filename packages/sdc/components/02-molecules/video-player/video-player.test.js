const template = 'components/02-molecules/video-player/video-player.twig';

describe('Video Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      sources: [
        { url: 'video.mp4', type: 'video/mp4' },
      ],
    });

    expect(c.querySelectorAll('.ct-video-player')).toHaveLength(1);
    expect(c.querySelector('video')).not.toBeNull();
    expect(c.querySelector('video source').getAttribute('src')).toEqual('video.mp4');
    expect(c.querySelector('video source').getAttribute('type')).toEqual('video/mp4');

    assertUniqueCssClasses(c);
  });

  test('renders with oEmbed iframe source', async () => {
    const c = await dom(template, {
      embedded_source: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      title: 'Sample Video',
      width: '560',
      height: '315',
    });

    expect(c.querySelectorAll('.ct-video-player')).toHaveLength(1);
    const iframe = c.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe.getAttribute('src')).toEqual('https://www.youtube.com/embed/dQw4w9WgXcQ');
    expect(iframe.getAttribute('title')).toEqual('Sample Video');
    expect(iframe.getAttribute('width')).toEqual('560');
    expect(iframe.getAttribute('height')).toEqual('315');

    assertUniqueCssClasses(c);
  });

  test('renders with raw source', async () => {
    const c = await dom(template, {
      raw_source: '<iframe src="https://www.example.com" width="560" height="315"></iframe>',
    });

    expect(c.querySelectorAll('.ct-video-player')).toHaveLength(1);
    const iframe = c.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe.getAttribute('src')).toEqual('https://www.example.com');
    expect(iframe.getAttribute('width')).toEqual('560');
    expect(iframe.getAttribute('height')).toEqual('315');

    assertUniqueCssClasses(c);
  });

  test('renders with transcript link', async () => {
    const c = await dom(template, {
      sources: [
        { url: 'video.mp4', type: 'video/mp4' },
      ],
      transcript_link: {
        url: 'transcript.html',
        text: 'View Transcript',
        title: 'Transcript',
        is_new_window: true,
        is_external: false,
      },
    });

    expect(c.querySelectorAll('.ct-video-player')).toHaveLength(1);
    const transcriptLink = c.querySelector('.ct-video-player__links-transcript a');
    expect(transcriptLink).not.toBeNull();
    expect(transcriptLink.getAttribute('href')).toEqual('transcript.html');
    expect(transcriptLink.textContent.trim()).toContain('View Transcript');

    assertUniqueCssClasses(c);
  });

  test('does not render when sources, embedded_source, and raw_source are all empty', async () => {
    const c = await dom(template, {});

    expect(c.querySelectorAll('.ct-video-player')).toHaveLength(0);
  });
});
