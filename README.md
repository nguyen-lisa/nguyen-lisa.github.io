# Retro desktop portfolio: how to update it

A portfolio styled as a pastel retro desktop. Underneath, it's a plain website:
HTML, CSS and JavaScript with no build step, no framework and nothing to install.
Open `index.html` in a browser to see your changes.

## Where everything lives

| File | What it's for | How often you'll edit it |
|---|---|---|
| `js/content.js` | All the words, projects, windows and feature switches | Often |
| `cv.pdf` | The CV visitors download | When your CV changes |
| `css/styles.css` | Colours, fonts, layout | Rarely |
| `js/app.js` | How windows, chat, sound and the sky work | Only to add new features |
| `js/examples.js` | Three complete sample case studies to copy from (not loaded by the site) | Never needs editing |
| `index.html` | The page skeleton | Almost never |

`js/content.js` is split into labelled blocks, in this order:

1. `SITE`: turns features on and off (sound, animated sky, chat, drafts) and sets the intro buttons
2. `WINDOWS`: which windows exist, their order, names, icons and colours
3. `PROFILE`: your name, intro, bio, strengths and contact links
4. `PROJECTS`: case studies
5. `GOALS`: the Goals window
6. `CV`: the CV window, and the link to `cv.pdf`
7. `CHAT`: the Messages auto-reply

When you change any text, keep the quotes around it. If your text contains a
double quote, type `\"` instead.

---

## Common changes

### Add a case study
1. In `js/content.js`, find `PROJECTS`.
2. Copy a whole project block, from its opening `{` to its closing `},`.
3. Paste it where you want it in the list. The order of the list is the order on the site.
4. Give it a new `id`: lowercase letters, numbers and hyphens, like `civic-app`.
   This is also its link: `yoursite.com/#case-civic-app`.
5. Change the text. Delete any section you don't need.

The Work window, its count, the Previous/Next buttons and the chat's "best work"
answer all update on their own.

**Sections you can use** (see `js/examples.js` for each one filled in):
`text`, `list`, `quote`, `steps`, `highlights`, `metrics`, `image`, `gallery`.

**Process photos and inspiration boards** go in a `gallery`. Every picture opens larger
in a photo viewer (arrow keys or Previous/Next move between them, Esc closes):
```js
{ heading: "From sketch to screen", layout: "wide",
  gallery: [
    { src: "art/sketch.jpg", alt: "Pencil sketch of the desktop with three windows", caption: "First sketch" },
    { src: "art/final.png", alt: "The finished desktop at night", caption: "Where it ended up" }
  ] },
```
`layout: "wide"` shows bigger pictures, two across. Any step in `steps` can also take
`image: { src, alt, caption }`. Slots with an empty `src` are skipped, and a section
with nothing filled in stays hidden, so the empty slots already in each case study
are safe to leave until you have the photos. Save photos about 1600 px wide, under 500 KB.

**Cover styles** (drawn for you): `phone`, `browser`, `system`, `desktop`, `extension`, `shop`, `editorial`.
For words only, like "Coming soon": `cover: { text: "Coming soon" }`.
To use your own picture instead:
```js
cover: { image: "images/civic-cover.png", alt: "The report screen showing a broken traffic light" }
```

**Store or live links** go in `links`, and show as buttons under the summary:
```js
links: [{ label: "Get it on the Chrome Web Store", url: "https://chromewebstore.google.com/detail/..." }]
```

### Remove a case study
Delete its block, from `{` to `},`. That's all.

### Hide an unfinished case study
Add `draft: true` to it. Drafts show a "Draft" tag. Set `showDrafts: false` in `SITE`
to hide every draft before you share the site.

### Add, remove or reorder windows
Edit `WINDOWS`. Each window is one line:
```js
{ id: "goals", title: "Goals", type: "goals", icon: "goals", color: "peach", width: 32, height: 36, menu: false },
```
- **Remove a window:** delete its line. Its menu item, desktop icon and any buttons
  that point to it disappear too.
- **Reorder:** move the lines.
- `menu: false` keeps a window off the top menu. `desktop: false` keeps it off the desktop.
- **Hide a window for now:** put `//` at the start of its line. Delete the `//` to bring it back.
- **Add a simple new window** with `type: "page"` and sections, the same as a case study:
  ```js
  { id: "playground", title: "Playground", type: "page", icon: "case", color: "sky", width: 40, height: 36,
    sections: [{ heading: "Things I make for fun", text: "..." }] },
  ```
- Don't use these as ids: `settings`, `sidebar`, `customize`, `upgrade`, `downloads`, `main`.

### Update your goals
Edit `GOALS`. Move an item from "Planned" to "In progress" by cutting and pasting its `{ ... }` block.

### Update the CV
- **The CV window:** edit `CV` in `js/content.js`.
- **The download:** export your CV as a PDF, name it `cv.pdf` and replace the file
  next to `index.html`. When you export, turn on the "accessible" or "tagged PDF"
  option (Word, Google Docs, InDesign and Figma plugins all have one) so screen readers can read it.
- To use a different file name, change `pdf:` in `CV`. To hide the button, set it to `""`.

### Change the chat
In `CHAT`, `questions` are the suggested-question buttons and `extras` answer typed
questions that match their `keywords`. `waitBetweenQuestions` sets the pause after
each reply, in milliseconds.

### Add your photo
Put the image next to `index.html` and set it in `PROFILE`:
```js
photo: { src: "me.jpg", alt: "Me at my desk, smiling" },
```

### Turn features off
In `SITE`: `sounds`, `animatedSky`, `chat`, `openChatOnLoad`, `pixelCursor` and
`cursorSparkles` each take `true` or `false`.

- **Pixel cursor:** visitors can switch back to their own cursor from the top bar.
  This matters for people who use a large or high-contrast system cursor.
- **Sparkles:** the click and pointer sparkles only run while animation is on, so they
  stop for anyone who turns animation off or has reduced motion set on their device.

### Edit the affirmations
`AFFIRMATIONS` in `js/content.js` is a plain list of sentences. Add or remove lines.
The Affirmations window shows them in a random order.

### Update languages, hobbies and values
In `PROFILE`, edit `languages`, `hobbies` and `values`. For each language, set `lang`
to its code (`fr` for French, `es` for Spanish, `tl` for Tagalog, `pa` for Punjabi,
`zh` for Chinese) so screen readers pronounce the greeting in the right accent.
For a signed language like ASL, use `signed: true` instead of `lang`.

---

### Use your own icon artwork
1. Draw each icon, ideally as a square PNG with a transparent background. 48 × 48 px works,
   and pixel art can be smaller (16 × 16 or 32 × 32) because it's scaled up crisply.
2. Put the files in an `icons` folder next to `index.html`.
3. Add `iconImage` to that window's line in `WINDOWS`:
   ```js
   { id: "work", title: "Work", type: "work", icon: "work", iconImage: "icons/work.png", color: "butter", width: 48, height: 41 },
   ```
The image appears on the desktop and in the window's title bar. Icons are decorative
(the label next to each one names it), so they don't need alt text. To go back to the
built-in pixel art, delete `iconImage`.

One image is used in both themes, so draw it with a dark outline and light fills.
The **Icon palette** tab of the art checklist has the colours.

### The sky
`skyOnly: true` in `ART` shows a smooth gradient sky (`skyGradientDay`, `skyGradientNight`)
with one rolling hill, clouds, sparkles by day and stars at night. Set it to `false` to show
your wallpapers instead; their skies are see-through, so the gradient shows behind your hills.

### Use your own wallpapers, cursors and button symbols
Everything else is in the `ART` block in `js/content.js`. Leave a line as `""` to keep
the built-in art.
- `wallpaperDay` and `wallpaperNight` replace the drawn scenes. Draw them as pixel art,
  at 640 × 360, with the horizon around row 250. They're scaled up a whole number of times (so pixels stay square)
  and anchored to the bottom, so on some screens the top and sides are cropped: keep
  the important parts near the bottom-middle and paint a little extra sky and edge.
- `sprites` are the moving pieces: `clouds` (a list of a few), `star`, `sparkle`
  (click bursts, pointer trail, fireworks), `smoke` (one puff) and `shootingStar`.
  You draw them, and the code only moves, twinkles and fades them. Draw them at
  your wallpaper's pixel size. Without your own wallpaper, one sprite pixel shows
  as 4 screen pixels. Any you leave empty use the built-in version.
- `animate` places them on your wallpaper, in its pixels: `skyBottom` is the row where
  the sky ends (stars and clouds stay above it) and `smokeFrom` is the chimney's top.
- `cursor` and `cursorHand` replace the pointers. Use 32 × 32 or smaller PNGs with a
  dark body and a light outline so they stay visible on both themes. Set
  `cursorHotspot` to the pixel that clicks.
- `glyphs` replaces the small symbols on buttons (close, maximize, sound...). Draw them
  8 × 8. By default the site uses only their shape and fills it with the theme's text
  colour, so every button passes contrast in both themes. Set `glyphColours: "asDrawn"`
  to keep your own colours; each symbol then needs 3:1 contrast on white and on #181640.
- `controllerIcon` replaces the little controller in the desktop's bottom-left corner,
  which plays the secret code for people who can't use a keyboard.
- `caseStudyIcon` replaces the small icon on every case study window.
- `konamiHint` replaces the faint easter-egg hint under your name.

Case study covers take `cover: { image: "art/cover.png", alt: "..." }` in each project,
and your photo goes in `PROFILE.photo`.

### Move a desktop icon to the right-hand column
Add `side: "right"` to its line in `WINDOWS`. Goals and Affirmations live there as extras.

### The easter egg
Typing the Konami code (up, up, down, down, left, right, left, right, B, A), or clicking
the little controller in the desktop's bottom-left corner, shows fireworks and a message. Edit the message in `EASTER_EGG` in `js/content.js`.

## Changing the look

All colours are tokens at the top of `css/styles.css`: the `:root` block is the light
"daydream" theme, and the `:root[data-mode="dark"]` block is the "night sky" theme.
Change a token once and it updates everywhere.

Every text colour pair meets at least 4.5:1 contrast. If you change a colour, check
it with a contrast checker (WebAIM's is free) against the backgrounds it sits on.

Fonts: Pixelify Sans is for large text only (your name, case study titles), because
its capital C reads like an O at small sizes. Everything else uses Atkinson
Hyperlegible, which was designed for low-vision readers.

---

## Adding a new kind of window (for code changes)

1. In `js/app.js`, write a builder function that fills `w.body.innerHTML`, like `buildGoals`.
2. Add it to `TYPES` near the top of the windows section:
   ```js
   timeline: { build: buildTimeline, status: () => ["Updated today"] },
   ```
3. Use `type: "timeline"` in `WINDOWS`.

Window behaviour (opening, dragging, focus, Esc to close, links like `#about`) comes
from the window manager (`WM` in `app.js`), so new windows get it for free.

---

## Keeping it accessible when you edit

- **Images:** give every image `alt` text that says what it shows. Use `alt: ""` only for decoration.
- **Links:** write labels that make sense on their own ("Get it on the Chrome Web Store", not "Click here").
- **Headings:** case study sections are headings automatically. Keep them short and descriptive.
- **Before sharing:**
  - Tab through the page with the keyboard.
  - Try it at 200% zoom and on a phone.
  - Run a free checker like axe DevTools or WAVE.
  - Listen to it once with a screen reader: NVDA on Windows, VoiceOver on Mac or iPhone.

## Hosting on GitHub Pages

This is a static site (no server, no build step), so GitHub Pages hosts it for free.

1. Sign in at github.com, or create a free account. Your username becomes your
   address: `username.github.io`.
2. Click **+** (top right) → **New repository**. Name it exactly `username.github.io`
   with your own username, set it to **Public**, and click **Create repository**.
3. On the new repository's page, click **uploading an existing file**.
4. Unzip the site on your computer, open the folder, select **everything inside it**
   (`index.html`, `README.md`, `cv.pdf`, and the `css`, `js` and any `art` or
   `icons` folders) and drag it into the upload area. Upload the contents, not the
   folder itself, so `index.html` sits at the top level.
5. Click **Commit changes**.
6. Go to **Settings** → **Pages**. Under **Build and deployment**, set **Source** to
   **Deploy from a branch**, the branch to **main** and the folder to **/ (root)**,
   then click **Save**.
7. Wait a minute or two, then visit `https://username.github.io`. The Pages settings
   page shows the address once it's live.

**Updating later:** open a file on GitHub, click the pencil icon, edit, and commit.
Or use **Add file** → **Upload files** to replace files with new versions of the same
name. The site updates within a minute or two.

**Good to know**
- File names are case-sensitive online: `Icons/Work.png` and `icons/work.png` are different.
- Because the repository is public, anyone can see the code. That's normal for
  portfolios, and employers often like to look.
- A repository with another name also works, at `username.github.io/repository-name`.
- To use your own domain later, add it under **Settings** → **Pages** → **Custom domain**.
