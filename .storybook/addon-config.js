exports.default = function () {
  // Lean storybook config.
  let config = [
    '@storybook/addon-knobs',
    {
      name: '@storybook/addon-essentials',
      options: {
        controls: false,
        docs: false,
        actions: false,
      },
    },
    '@storybook/addon-links',
    '@whitespace/storybook-addon-html',
  ];

  // Html and pseudo knobs.
  if (process.env.STORYBOOK_FULL === '1') {
    config = [
      ...config,
      ...[
        '@storybook/addon-a11y',
      ],
    ];
  }

  return config;
};
