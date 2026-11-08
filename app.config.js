// Dynamic Expo config. Pulls native secrets (the Google Maps API key) from the
// gitignored .env file so they never land in version control. Static config
// still lives in app.json. Expo CLI loads .env before evaluating this file.
const { expo } = require('./app.json');

const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

module.exports = {
  expo: {
    ...expo,
    android: {
      ...expo.android,
      config: {
        ...(expo.android && expo.android.config ? expo.android.config : {}),
        googleMaps: { apiKey: googleMapsApiKey },
      },
    },
  },
};
