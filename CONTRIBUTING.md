# Contributing to Demojis

Thank you for reading this and contributing to Demojis! 💖

## Getting Started

1. Fork and clone the repository.
2. Install the dependencies:

   ```bash
   npm install
   ```

3. Build the project and run the tests to make sure everything works before you change anything:

   ```bash
   npm run build
   npm test
   ```

## Project Structure

- `assets/`: The source PNGs. Each folder is a category (`faces`, `symbols`, `animals`, `food`, `hands`, `people`), and each file is one emoji.
- `scripts/build.js`: Generates the resized images in `dist/images/` (32, 64, 128, and 256 px) and rebuilds `src/data.json`.
- `scripts/grid.js`: Generates a preview grid of every emoji in `dist/grid.png`. Run it with `node scripts/grid.js`.
- `src/`: The package source code.
- `test/`: Tests for the ESM, CJS, and browser builds.
- `UNICODE.md`: The table mapping Unicode emojis to Demojis.
- `CHANGELOG.md`: The history of notable changes.

## Adding or Changing an Emoji

Every emoji is a 256×256 PNG placed inside a category folder under `assets/`. The file name, without the `.png` extension, is the emoji's name, so use lowercase names with no spaces or separators (for example, `grinningclosedeyes.png`). Put the emoji in the category that fits it best. If you want to add a new category, create a new folder under `assets/`.

### Style Guidelines

For emoji creation, here are some things to keep in mind:

- Antialiasing must be off.
- Borders, eyes and most stuff should be 5 pixel wide to make sure they're visible in low resolutions.
- Face emojis (like 😀, 😂, 😋) must be colored `#FFCC00` with their borders set to `#CE9700`, unless the emoji requires a different colored face, border or gradient.
- Mouths must be colored with their insides being `#800002` and the borders `#000000`.
- Eyes should be `#000000` colored, unless the eye requires to be bigger, that way it should be `#FFFFFF`.
- Tears, sweat or drool should be `#85B7FF` colored, with their borders set to `#569CFE`

### Naming Guidelines

- Emoji names shouldn't include spaces or special character.
- If an emoji is a variation of another, the name should start with the name of the base emoji. For example: `grinning` -> `grinningsweat`.

## Submitting Your Changes

1. Create a branch for your change.
2. Add or update the PNG files in `assets/`. Do not edit anything in `dist/`, since it is generated.
3. Run `npm run build` and `npm test`. Make sure both pass.
4. If you added or renamed emojis, update the table in `UNICODE.md` where it applies.
5. Add an entry to `CHANGELOG.md` under an `Unreleased` heading, following the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.
6. Open a pull request that describes what changed and why. If the emoji is a new design or a redesign, include a screenshot or a preview.

## Reporting Issues

If you find a bug or have a suggestion, open an issue and include as much detail as you can, such as the emoji name, the image size, and the environment where the problem happens.

## License

By contributing to Demojis, you agree that your contributions are released under the project's [CC0-1.0](https://creativecommons.org/publicdomain/zero/1.0/) license.
