### Instructions
- Clone the project
- Run `yarn && yarn run link && npx pod-install`
- Run `yarn run ios`

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
- This throws an error: `Module must be either an ArrayBuffer or an Uint8Array (BufferSource), object given.`
- NB: This happens only when debugger mode is disabled. If you're debugging with chrome, the function works fine without any errors

### My Opinion
I feel the difference in node environemt used by chrome-debug mode plays a role to this error.