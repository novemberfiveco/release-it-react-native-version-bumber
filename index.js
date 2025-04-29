import { Plugin } from 'release-it';
import fs from 'fs';
import plist from 'plist';
import path from 'path';

class ReactNativeVersionBumperPlugin extends Plugin {
  async beforeRelease() {
    try {
      // Access version from the context provided by release-it
      const version = this.config.getContext("version");

      if (!version) {
        this.log.warn('No version found in release-it context');
        return;
      }

      this.bumpIOSVersion(version);
      this.bumpAndroidVersion(version);
    } catch (error) {
      this.log.error(`Error in beforeRelease: ${error.message}`);
      throw error;
    }
  }

  bumpIOSVersion(version) {
    try {
      const plistPath = this.getContext("plistPath");

      const cwd = process.cwd();
      const infoPlistPath = path.join(cwd, plistPath);

      const plistContent = fs.readFileSync(infoPlistPath, 'utf8');
      const plistObj = plist.parse(plistContent);

      // Update version string
      plistObj.CFBundleShortVersionString = version;

      // Optionally increment build number if present
      if (plistObj.CFBundleVersion) {
        const currentBuild = parseInt(plistObj.CFBundleVersion, 10) || 0;
        plistObj.CFBundleVersion = String(currentBuild + 1);
        this.log.info(`CFBundleVersion incremented to ${plistObj.CFBundleVersion}`);
      }

      const updatedPlist = plist.build(plistObj);
      fs.writeFileSync(infoPlistPath, updatedPlist, 'utf8');
      this.log.info(`CFBundleShortVersionString set to ${version}`);
    } catch (error) {
      this.log.error(`Error updating iOS version: ${error.message}`);
      throw error;
    }
  }

  bumpAndroidVersion(version) {
    try {
      const gradlePath = this.getContext('gradlePath');

      let gradleContent = fs.readFileSync(gradlePath, 'utf8');
      // Update version name
      gradleContent = gradleContent.replace(
        /versionName\s+"[^"]+"/,
        `versionName "${version}"`
      );

      // Increment version code if present
      const versionCodeRegex = /versionCode\s+(\d+)/;
      const match = gradleContent.match(versionCodeRegex);

      if (match) {
        const currentCode = parseInt(match[1], 10);
        const newCode = currentCode + 1;
        gradleContent = gradleContent.replace(
          versionCodeRegex,
          `versionCode ${newCode}`
        );
        this.log.info(`Android versionCode incremented to ${newCode}`);
      }

      fs.writeFileSync(gradlePath, gradleContent, 'utf8');
      this.log.info(`Android versionName set to ${version}`);
    } catch (error) {
      this.log.error(`Error updating Android version: ${error.message}`);
      throw error;
    }
  }
}

export default ReactNativeVersionBumperPlugin;