module.exports = function config(api) {
  return {
    presets: ['@babel/preset-env'],

    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      [
        '@babel/plugin-transform-react-jsx',
        {
          runtime: 'automatic'
        }
      ]
    ],

    overrides: [
      {
        test: /\.tsx?$/,
        presets: ['@babel/preset-typescript']
      },
      {
        test: /\.tsx$/,
        presets: [
          [
            '@babel/preset-react',
            {
              development: api.env() === 'development',
              useBuiltIns: true,
              runtime: 'automatic'
            }
          ]
        ]
      },
      {
        test: '**/*.d.ts',
        presets: [['@babel/preset-env', { targets: { esmodules: true } }]]
      }
    ]
  };
};
