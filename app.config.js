// @ts-check

/** @param {{ config: import('@expo/config-types').ExpoConfig }} ctx */
export default ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
  },
  plugins: [
    ...(config.plugins?.filter((p) => {
      const name = Array.isArray(p) ? p[0] : p;
      return name !== '@react-native-firebase/app';
    }) ?? []),
    [
      '@react-native-firebase/app',
      {
        android: {
          googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
        },
      },
    ],
  ],
});
