module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@root': '.',
          '@screens': './src/screens',
          '@components': './src/components',
          '@utils': './src/utils',
          '@apis': './src/apis',
          '@assets': './src/assets',
          "@contexts": './src/contexts',
          "@hooks": "./src/hooks",
          "@navigators": "./src/navigators",
          "@config":"./src/config"
        },
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.android.js',
          '.android.tsx',
          '.ios.js',
          '.ios.tsx',
        ],
      },
    ],
  ],
};
