import CivicThemeVideo from './video.twig';
import { generateVideoPoster, generateVideos, knobBoolean, knobOptions, knobRadios, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Video',
  parameters: {
    layout: 'centered',
  },
};

export const Video = (props = {}) => {
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
    has_controls: knobBoolean('Has controls', true, props.has_controls, props.knobTab),
    poster: knobBoolean('Has poster', false, props.poster, props.knobTab) ? generateVideoPoster() : null,
    width: knobText('Width', '', props.width, props.knobTab),
    height: knobText('Height', '', props.height, props.knobTab),
    fallback_text: knobText('Fallback text', 'Your browser doesn\'t support HTML5 video tag.', props.fallback_text, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  const sources = generateVideos();
  const sourcesOptions = {};
  for (const i in sources) {
    sourcesOptions[sources[i].type.substr('video/'.length).toUpperCase()] = sources[i].type;
  }
  const optValues = knobOptions('Sources', sourcesOptions, Object.values(sourcesOptions), { display: 'check' }, props.sources, 'Sources');
  const sourcesKnobs = {
    sources: sources.filter((x) => optValues.includes(x.type)),
  };

  const combinedKnobs = { ...knobs, ...sourcesKnobs };

  return shouldRender(props) ? CivicThemeVideo(combinedKnobs) : combinedKnobs;
};
