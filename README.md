# iOS and android version read/write plugin for release-it

This plugin reads and/or writes version/manifest files. It will set CFBundleShortVersionString (iOS) and versionName (android) to the package.json version. CFBundleVersion (iOS) and versionCode (android) will be incremented by 1.

### Installation

```sh
npm install --save-dev @novemberfiveco/release-it-rn-version-bumper
```

### Configuration Options

```json
"plugins": {
  "@novemberfiveco/release-it-react-native-version-bumper": {
    "plistPath": "path-to/Info.plist",
    "gradlePath": "path-to/app/build.gradle"
  }
}
```

#### `plistPath: string`

Required - Path to Info.plist. This will likely be "ios/{PROJECT_NAME}/Info.plist"

#### `gradlePath: string`

Required - Path to app build.gradle. This will likely be "android/app/build.gradle"
