import ContentLink from '../../01-atoms/content-link/content-link.twig';
import Button from '../../01-atoms/button/button.twig';
import Table from '../../01-atoms/table/table.twig';
import Figure from '../figure/figure.twig';
import VideoPlayer from '../video-player/video-player.twig';

const svg_html = '<svg class="ct-icon ct-basic-content__external-icon" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24"><path d="M17.9199 6.62C17.8185 6.37565 17.6243 6.18147 17.3799 6.08C17.2597 6.02876 17.1306 6.00158 16.9999 6H6.99994C6.73472 6 6.48037 6.10536 6.29283 6.29289C6.1053 6.48043 5.99994 6.73478 5.99994 7C5.99994 7.26522 6.1053 7.51957 6.29283 7.70711C6.48037 7.89464 6.73472 8 6.99994 8H14.5899L6.28994 16.29C6.19621 16.383 6.12182 16.4936 6.07105 16.6154C6.02028 16.7373 5.99414 16.868 5.99414 17C5.99414 17.132 6.02028 17.2627 6.07105 17.3846C6.12182 17.5064 6.19621 17.617 6.28994 17.71C6.3829 17.8037 6.4935 17.8781 6.61536 17.9289C6.73722 17.9797 6.86793 18.0058 6.99994 18.0058C7.13195 18.0058 7.26266 17.9797 7.38452 17.9289C7.50638 17.8781 7.61698 17.8037 7.70994 17.71L15.9999 9.41V17C15.9999 17.2652 16.1053 17.5196 16.2928 17.7071C16.4804 17.8946 16.7347 18 16.9999 18C17.2652 18 17.5195 17.8946 17.707 17.7071C17.8946 17.5196 17.9999 17.2652 17.9999 17V7C17.9984 6.86932 17.9712 6.74022 17.9199 6.62Z" /></svg>';

export default {
  args: (theme = 'light') => ({
    theme,
    content: `<h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
      <h6>Heading 6</h6>
      <p>Text without a class sed aute in sed consequat veniam excepteur minim mollit.</p>
      <p class="ct-text-large">Large text sed aute in sed consequat veniam excepteur minim mollit.</p>
      <p class="ct-text-regular">Regular text veniam reprehenderit velit ea veniam occaecat magna est sed duis quis elit occaecat dolore ut enim est do in dolor non elit aliquip commodo aliquip sint veniam ullamco adipisicing tempor ad.</p>
      <p class="ct-text-small">Small text <span>duis sunt velit.</span><span>Ea eu non.</span></p>
      <p>In mollit in minim ut non ${ContentLink({
      theme,
      text: 'commodo dolore',
      url: 'https://example.com',
    })} nisi anim.</p>
      <p><a class="ct-button ct-theme-light ct-button--primary ct-button--regular ct-button--secondary ct-button--large" href="https://duck.com" target="_blank" data-button="true"> <strong>External Link <span class="ct-text-no-wrap">Button<span class="ct-visually-hidden">(Opens in a new tab/window)</span>${svg_html}</span></strong></a></p>
      <p>Deserunt in ex dolore <a href="http://duck.com" target="_blank">mollit <span class="ct-text-no-wrap">culpas${svg_html}</span></a>.</p>
      <p>Deserunt in ex dolore. <sup>Super cupidatat esse.</sup> <sub>Sub do mollit aute labore.</sub></p>
      <p>Primary button link within text mollit in minim ut non ${Button({
      theme,
      kind: 'link',
      type: 'primary',
      text: 'Primary button text',
      url: 'https://example.com',
    })} nisi anim.</p>
      <p>Secondary button link within text mollit in minim ut non ${Button({
      theme,
      kind: 'link',
      type: 'secondary',
      text: 'Secondary button text',
      url: 'https://example.com',
    })} nisi anim.</p>
      <p>Tertiary button link within text mollit in minim ut non ${Button({
      theme,
      kind: 'link',
      type: 'tertiary',
      text: 'Tertiary button text',
      url: 'https://example.com',
    })} nisi anim.</p>
      <p>Sed aute in sed consequat veniam excepteur minim mollit.</p>
      <blockquote>Culpa laboris sit fugiat minim ad commodo eu id sint eu sed nisi.</blockquote>
      <blockquote>Culpa laboris sit fugiat minim ad commodo eu id sint eu sed nisi.<cite>Sed aute</cite></blockquote>
      <ul>
        <li>Sint pariatur quis tempor.</li>
        <li>Lorem ipsum dolore laborum nulla ut.</li>
        <li>Deserunt ullamco occaecat anim cillum.</li>
      </ul>
      <ol>
        <li>Id nostrud id sit nulla.</li>
        <li>Dolore ea cillum culpa nulla.</li>
        <li>Lorem ipsum ex excepteur.</li>
      </ol>
      <p>Number list with bullet children</p>
      <ol>
          <li>Number</li>
          <li>Number</li>
          <li>Number
            <ul>
              <li>Bullet</li>
              <li>Bullet</li>
            </ul>
          </li>
          <li>Number</li>
          <li>Number</li>
      </ol>
      <p>Bullet list with number children</p>
      <ul>
          <li>Bullet</li>
          <li>Bullet
            <ol>
              <li>Number</li>
              <li>Number</li>
            </ol>
          </li>
          <li>Bullet</li>
          <li>Bullet</li>
          <li>Bullet</li>
      </ul>
      ${
    Figure({
      theme,
      url: './demo/images/demo1.jpg',
      alt: 'Occaecat laborum voluptate cupidatat.',
      caption: 'Commodo anim sint minim.',
    })
    }
      ${
    VideoPlayer({
      theme,
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
      transcript_link: {
        text: 'View transcript',
        title: 'Open transcription in a new window',
        url: 'https://example.com',
        is_new_window: true,
        is_external: false,
        attributes: null,
      },
    })
    }
      ${
    Table({
      theme,
      header: [
        'Column A',
        'Column B',
        'Column C',
      ],
      rows: [
        [
          'Do duis minim cupidatat eu.',
          'Ullamco sunt dolore.',
          'Dolor in officia.',
        ],
        [
          'Do duis minim cupidatat eu.',
          'Ullamco sunt dolore.',
          'Dolor in officia.',
        ],
        [
          'Lorem ipsum magna sint.',
          'Consequat qui anim.',
          'Lorem ipsum aliqua veniam deserunt.',
        ],
      ],
    })
    }
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc auctor risus nec nisl tempor, vel sodales metus bibendum.</p>
      `,
    is_contained: true,
    vertical_spacing: 'none',
    with_background: false,
    modifier_class: '',
    attributes: null,
  }),
};
