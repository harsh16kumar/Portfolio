HOW TO ADD YOUR SCROLL ANIMATION FRAMES:

1. Paste your image sequence files in this folder (`public/frames`).
2. Your files should be named starting from `0001.jpg`, `0002.jpg`, up to whatever your frame count is (e.g., `0100.jpg` for 100 frames).
3. Important: The images MUST be `.jpg` files and padded with zeros to 4 digits (e.g. `0001.jpg`). If you exported them from After Effects, Premiere, or Blender, this is usually the default setting.
4. If you have more or fewer than 100 frames, open `src/App.jsx` and change the `frameCount` prop on the `<HeroSequence>` component to match your total number of frames!

Example `App.jsx` change for 150 frames:
<HeroSequence frameCount={150} imagePath="/frames" />
