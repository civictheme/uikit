import CivicThemeVideo from './video-player.twig';
import { generateVideoPoster, generateVideos, knobBoolean, knobRadios, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Molecules/Video Player',
};

export const VideoPlayer = (props = {}) => {
  const knobs = {
    theme: knobRadios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      props.theme,
      props.knobTab,
    ),
    source_type: knobRadios('Source type', {
      File: 'file',
      Embedded: 'embedded',
      Raw: 'raw',
    }, 'file', props.source_type, props.knobTab),
    title: knobText('Title', 'Test video', props.title, props.knobTab),
    width: knobText('Width', '', props.width, props.knobTab),
    height: knobText('Height', '500', props.height, props.knobTab),
    with_transcript_link: knobBoolean('With Transcript link', true, props.with_transcript_link, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
  };

  const sourceKnobs = {};
  const sourceKnobTab = 'Source';
  if (knobs.source_type === 'file') {
    sourceKnobs.sources = knobBoolean('With sources', true, props.with_source, sourceKnobTab) ? generateVideos() : null;
    if (sourceKnobs.sources) {
      sourceKnobs.poster = knobBoolean('With poster', true, props.with_poster, sourceKnobTab) ? generateVideoPoster() : null;
    }
  } else if (knobs.source_type === 'embedded') {
    sourceKnobs.embedded_source = knobText('Embedded source', 'https://www.youtube.com/embed/C0DPdy98e4c', props.embedded_source, sourceKnobTab);
  } else {
    sourceKnobs.raw_source = knobBoolean('With raw input', true, props.with_raw_input, sourceKnobTab) ? '<iframe allowfullscreen="" frameborder="0" height="315" src="https://www.youtube.com/embed/C0DPdy98e4c" width="420"></iframe>' : null;
  }

  let transcriptLinkKnobs = {};
  const transcriptLinkKnobTab = 'Transcript Link';
  if (knobs.with_transcript_link) {
    transcriptLinkKnobs = {
      transcript_link: {
        text: knobText('Text', 'View transcript', props.transcript_link_text, transcriptLinkKnobTab),
        title: knobText('Title', 'Open transcription in a new window', props.transcript_link_title, transcriptLinkKnobTab),
        url: knobText('URL', 'https://example.com', props.transcript_link_url, transcriptLinkKnobTab),
        is_new_window: knobBoolean('Open in a new window', true, props.transcript_link_is_new_window, transcriptLinkKnobTab),
        is_external: knobBoolean('Is external', false, props.transcript_link_is_external, transcriptLinkKnobTab),
      },
    };
  }

  const combinedKnobs = { ...knobs, ...sourceKnobs, ...transcriptLinkKnobs };

  return shouldRender(props) ? CivicThemeVideo(combinedKnobs) : combinedKnobs;
};
