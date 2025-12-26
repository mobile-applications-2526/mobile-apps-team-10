# Welcome to your Expo app 👋

## End-to-end tests with Cypress ✅

This project includes a minimal Cypress setup to run E2E tests against the Expo web build.

Quick start:

1. Install dev deps: `npm install` (or `npm install --save-dev cypress`)
2. Start Expo web server: `npm run start:web` (serves on http://localhost:19006)
3. Open Cypress UI: `npm run cypress:open` or run headless tests: `npm run cypress:run`

Run both server and tests in one command: `npm run test:e2e` (uses `start-server-and-test`)

### CI (GitHub Actions)

A GitHub Action workflow has been added at `.github/workflows/e2e.yml` that runs the E2E tests on push and pull requests.

Notes:
- The workflow sets placeholder env vars `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` to avoid startup failures in CI. For realistic tests, add the real values as repository secrets and set them in the Action (or override in the workflow).
- If you want tests to run against a real test supabase project, add the secrets `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in the repository > Settings > Secrets.


Notes:
- The example test checks the home screen welcome text via `testID="home-welcome"`.
- Cypress tests live under `cypress/e2e` and the config is `cypress.config.ts`.


This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
