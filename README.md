### Environment Setup

Follow the guide to setup your PC from [React-Native Environment Setup](https://reactnative.dev/docs/environment-setup)

OR:

- Install node using brew `brew install node` but it's preferred to manage node using nvm [nvm installation guide](https://tecadmin.net/install-nvm-macos-with-homebrew/)
- brew install watchman
- For mac system, install [XCode](https://apps.apple.com/ng/app/xcode/id497799835?mt=12)

Required to run android
- Download Java Development Kit `brew tap homebrew/cask-versions` && `brew install --cask zulu11`
- Download and Install [Android Studio](https://developer.android.com/studio)
- Install Android SDK
  - To do that, open Android Studio, click on "More Actions" button and select "SDK Manager".
  - Select the "SDK Platforms" tab from within the SDK Manager, then check the box next to "Show Package Details" in the bottom right corner. Look for and expand the Android 12 (S) entry, then make sure the following items are checked:
    - Android SDK Platform 31
    - Intel x86 Atom_64 System Image or Google APIs Intel x86 Atom System Image or (for Apple M1 Silicon) Google APIs ARM 64 v8a System Image
- Configure the ANDROID_HOME environment variable
  - Add the following lines to your ~/.zprofile or ~/.zshrc config file:
    - Open your terminal
    - run `vim ~/.zshrc`
    - Press `i` on your keyboard and use your arrow keys to navigate to the last line of the editor
    - Add the following files to the last line of the opened editor
  ```
      export ANDROID_HOME=$HOME/Library/Android/sdk
      export PATH=$PATH:$ANDROID_HOME/emulator
      export PATH=$PATH:$ANDROID_HOME/platform-tools
  ```
    - Press `Esc` key key then type `:wq` to save and quit the editor
  - Alternatively, you can create a `local.properties` file in the `android` folder of the project with this line `sdk.dir =/Users/{username}/Library/Android/sdk`
- Create a new Virtual Device
  - Click `More Actions` on `Android Studio`
  - Select `Virtual Device Manager`
  - Select Any of the google arm packages and click next
  - Give the device a name or leave the default name and click Next
  - Select `Portrait` orientation and click finish

### To run the project
- Clone the project
- Run `yarn && yarn run link && npx pod-install`

To run on android:
- Run `yarn run android`

To run on iOS
- Run `yarn run ios`

### Possible Error
- 144 duplicate symbols for architecture arm64 (This happens mostly on Apple Silicon chip machines)
#### Fix:
- Open `ios` directory and open `BufferProject.xcworkspace`
- Tap on the folder icon by the top left of XCode
- Select `Pods` from the left pane on XCode
- Under `Targets`, locate and select `react-native-udp`
  - Select `Build Phases` and expand `Compile Sources`
  - Delete `GCDASyncUdpSocket.m` from the list
- Under `Targets` again, locate and select `TcpSockets`
  - Select `Build Phases` and expand `Compile Sources`
  - Delete `GCDASyncUdpSocket.m` from the list
- Click the `Play` icon by the top left of Xcode

### Problem
- Click the encrypt button on the initial screen
- Currently, the encrypt function uses the `HashWasm.argon2id` to encrypt
```
const hashOptions = {
        password: 'password',
        salt: salt,
        parallelism: 1,
        iterations: 256,
        memorySize: 2024,
        hashLength: 32, // we use output size = 32 bytes
        outputType: 'binary', // we use output binary
      };

      const result = await HashWasm.argon2id(hashOptions);
```
- This throws an error: `[TypeError: undefined is not an object (evaluating 'buffer.toString')]`
- NB: This happens only when debugger mode is disabled. If you're debugging with chrome, the function works fine without any errors

### My Opinion
I feel the difference in node environment used by chrome-debug mode plays a role to this error.
