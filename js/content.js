/* ======================================================================
   PORTFOLIO CONTENT  (js/content.js)
   Everything visitors read lives in this file. Change the text in quotes.
   You never need to touch js/app.js or css/styles.css to update content.

   WHAT'S IN THIS FILE, TOP TO BOTTOM
     SITE      switch features on or off
     WINDOWS   which windows exist, their order, names and colours
     PROFILE   your name, intro, bio, contact links
     PROJECTS  case studies (add or delete freely)
     CV        your CV, plus the link to the PDF download
     CHAT      the Messages auto-reply

   ADD A PROJECT     Copy one { ... } block inside PROJECTS, paste it after
                     the last one (mind the comma between blocks), give it a
                     new id, and change the text. There's a blank template at
                     the end of the list.
   DELETE A PROJECT  Remove its whole { ... } block and the comma after it.

   The Work window, its count, the Previous/Next buttons, the chat's
   "best work" answer and links such as  yoursite.com/#case-lull  all
   update on their own.
   ====================================================================== */

/* SITE: turn features on or off. Visitors can still mute sound and
   pause animation from the top bar. */
const SITE = {
  sounds: true,            // hover and click sounds
  animatedSky: true,       // drifting clouds and twinkling stars
  chat: true,              // the Messages window and the "Ask me anything" button
  openChatOnLoad: true,    // open Messages when the page loads (desktop only, when there's room)
  pixelCursor: true,       // pixel-art mouse pointer (visitors can switch back to their own in the top bar)
  cursorSparkles: true,    // small sparkles on click and behind the pointer; off whenever animation is off
  showDrafts: true,        // false hides projects marked draft: true
  // Buttons under your intro. "open" is the id of a window from WINDOWS below.
  heroButtons: [
    { label: "See my work", open: "work", primary: true },
    { label: "Read my CV", open: "cv" }
  ]
};

/* WINDOWS: every window on the site. The order here is the order in the
   menu bar and on the desktop. Delete an entry to remove that window
   everywhere (menu, desktop icon, buttons that point to it).
   type     "about", "work", "cv", "messages", "goals" and "affirmations" are built-in layouts.
            "page" is a simple window built from sections, like a case study.
   icon     "about", "work", "cv", "messages", "goals", "notes" or "case"
   menu     false keeps a window off the top menu (it still gets a desktop icon)
   desktop  false keeps a window off the desktop (it stays in the menu)
   side     "right" puts its desktop icon in the column on the right (for extras)
   iconImage  your own artwork instead of the pixel icon, e.g. "icons/goals.png"
   color    "pink", "butter", "mint", "lilac", "sky" or "peach"
   width/height  starting size in rem (16px each); it shrinks to fit small screens
   id       lowercase letters, numbers and hyphens. It's also the link: yoursite.com/#about */
// Your own icons: add iconImage: "icons/work.png" to a line. One image works
// in both themes.
const WINDOWS = [
  { id: "about",    title: "About me", type: "about",    icon: "about",    iconImage: "icons/aboutme.png", color: "pink",   width: 38, height: 40 },
  { id: "work",     title: "Work",     type: "work",     icon: "work", iconImage: "icons/work.png",     color: "butter", width: 48, height: 41 },
  { id: "cv",       title: "CV",       type: "cv",       icon: "cv", iconImage: "icons/cv.png",       color: "mint",   width: 42, height: 42 },
  { id: "messages", title: "Messages", type: "messages", icon: "messages", iconImage: "icons/messages.png", color: "lilac",  width: 24, height: 38 },
  { id: "goals",    title: "Goals",    type: "goals",    icon: "goals", iconImage: "icons/goals.png",    color: "peach",  width: 32, height: 36, menu: false, side: "right" },
  // Affirmations is hidden for now. To bring it back, delete the // at the start of the next line
  // (and in the "notes" answer in CHAT).
  // { id: "notes",    title: "Affirmations", type: "affirmations", icon: "notes", iconImage: "icons/affirmations.png", color: "butter", width: 26, height: 30, menu: false, side: "right" }

  /* EXAMPLE: a new window takes one line plus its sections. Add a comma
     after the line above, then paste this (without the slash-star lines).
  { id: "playground", title: "Playground", type: "page", icon: "case", color: "sky", width: 40, height: 36,
    status: "Small experiments",
    sections: [
      { heading: "Things I make for fun", text: "Write a short intro here." },
      { heading: "Recent experiments", list: ["One thing", "Another thing"] }
    ] }
  */
];

const PROFILE = {
  name: "Lisa Nguyen",
  firstName: "Lisa",
  initials: "LN",
  role: "UI/UX designer and front-end developer",
  tagline: "I design and build accessibility-first apps that solve problems I see the people in my life run into.",
  location: "Toronto, Ontario",
  timezone: "America/Toronto",
  timezoneName: "Eastern Time",   // shown after your local time, e.g. "9:16 PM EST (Eastern Time)"
  availability: "Open to front-end, UI/UX and creative roles",
  email: "lisanguyen.tech@yahoo.com",
  //{ src: "iris.jpg", alt: "Iris smiling in a sunny studio" }
  photo: { src: "", alt: "" },
  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/lisa-vo-nguyen/" },
    { label: "GitHub", url: "https://github.com/nguyen-lisa" }  
  ],
  bio: [
    "Most of my projects start with a problem someone in my life is trying to solve: a classmate who couldn't keep track of their bookmarks while studying, or a student who wanted to sell press-on nails to earn money alongside school. I design the fix, then I build it.",
    "I design accessibility first. Contrast, keyboard use, screen readers and plain language are part of the first sketch, so the finished thing works for everyone it was made for."
  ],
  strengths: [
    { title: "Research that changes the plan", text: "I talk with the people I design for and test with them, then turn what I learn into clear design decisions." },
    { title: "Accessible from the first sketch", text: "I design to WCAG 2.2 AA and the AODA from the first wireframe, so contrast, focus order and plain language are settled before visual polish." },
    { title: "Designs I can build", text: "Semantic HTML, CSS and JavaScript, so what I hand over already works with a keyboard and a screen reader." }
  ],
  // About me: the human side. Fill in the [square brackets].
  // "lang" is the language code (fr, es, tl, zh, ar, pa...) so screen readers pronounce the greeting correctly.
  languages: [
    { name: "English", level: "Fluent", greeting: "Hello", lang: "en" },
    { name: "Vietnamese", level: "Intermediate", greeting: "Xin chào", lang: "vi" },
    // Leave greeting empty ("") to show a sparkle instead of a word.
    { name: "Too many to count", level: "Always learning", greeting: "" }
  ],
  hobbiesIntro: "I'm a creative at heart and love exploring different kinds of art.",
  hobbies: ["Cooking", "Reading", "Video games", "Crochet", "Photography", "Fashion"],
  talkAbout: "I could talk about languages and perfumes for hours.",
  values: [
    "Diversity shapes how I design. The people I make things for speak different languages, come from different cultures and use technology in different ways, so I design with them, not just for them.",
    "[What diversity and multicultural community mean to you personally: where you grew up, the communities you're part of, a moment that changed how you see it.]"
  ],
  updated: "November 2026"
};

/* A project, field by field
   id        Short name used in links (#case-lull): lowercase letters, numbers, hyphens.
   color     Title bar and accents: "pink", "butter", "mint", "lilac", "sky" or "peach".
   cover     { style: "..." } draws a mockup: "phone", "browser", "system",
             "desktop", "extension", "shop" or "editorial".
             For your own picture: { image: "lull-cover.png", alt: "What the picture shows" }
   sections  Read top to bottom. Each needs a heading and can mix any of:
             text (one string, or a list of paragraphs), quote, list, steps,
             highlights, metrics, and image: { src, alt, caption }.
   links     buttons under the summary, e.g. [{ label: "Get it on the Chrome Web Store", url: "https://..." }]
   draft     true shows a "Draft" tag. Set showDrafts: false in SITE to hide every draft.
   Leave out anything you don't need. Full examples of every section type are in js/examples.js. */
const PROJECTS = [
  {
    id: "breadcrumbs",
    title: "Breadcrumbs",
    summary: "An accessibility-first Chrome extension, that works on chromium-based browsers, saves highlighted text from any webpage and takes you back to the exact passage in one click. Built with vanilla JavaScript to meet WCAG and the AODA.",
    year: "2026",
    role: "UI/UX designer and full-stack developer",
    timeline: "2 weeks",
    team: "Solo",
    platform: "Chrome extension",
    tools: "Figma, JavaScript, HTML, CSS, Chrome Extension API, Lighthouse, Git and GitHub",
    tags: ["Chrome extension", "Privacy first", "Accessibility"],
    color: "sky",
    cover: { image: "art/breadcrumbs-cover.jpg", alt: "The Breadcrumbs popup side by side in light and dark mode, listing four saved highlights with one selected, above the Visit, Remove and Clear All buttons" },
    links: [
      { label: "Get it on the Chrome Web Store", url: "" }   // paste the store URL between the quotes to show this button
    ],
    sections: [
      { heading: "Overview",
        text: [
          "Breadcrumbs started with a classmate who couldn't keep track of their bookmarks while studying: dozens of tabs, and no way back to the passage that mattered.",
          "Bookmarks save a page, not the line you needed. Breadcrumbs saves the exact text you highlight along with its page, then takes you back and highlights it for you, so there's no scrolling through a long article to find a quote, statistic or reference again.",
          "Everything stays on your device: no accounts, no servers and no tracking."
        ] },
      { heading: "The problem",
        text: [
          "Researchers, students and knowledge workers bookmark pages but lose track of the passages that matter. Standard bookmarks save web addresses, not text, so people waste time scrolling to find what they read before.",
          "Breadcrumbs is for students, researchers, writers and anyone who reads a lot online and keeps track of information across many sources."
        ] },
      { heading: "Goal and constraints",
        text: "Design and build a lightweight extension that saves highlighted text from any webpage and goes straight back to the exact passage, highlighted, with no scrolling.",
        list: [
          "Works offline, with local storage only and no external servers",
          "Under 100 KB, so it loads instantly",
          "Light and dark colour schemes",
          "Meets WCAG and the AODA without compromise",
          "Complete privacy: no data collection, tracking or outside connections"
        ] },
      { heading: "Two weeks, step by step",
        steps: [
          { title: "Research and wireframes (1 day)", text: "Validated the problem and sketched lo-fi layouts." },
          { title: "Core features (2 days)", text: "The right-click menu, local storage and the list of saved breadcrumbs." },
          { title: "Navigation and highlighting (2 days)", text: "Content scripts that find the saved text, scroll it into view and highlight it." },
          { title: "Accessibility (2 days)", text: "Keyboard navigation, ARIA labels and focus management." },
          { title: "Polish and testing (2 days)", text: "Dark mode, visual feedback and edge cases." }
        ] },
      /* Photos of your process. This section stays hidden until at least one
         src is filled in. Put the files in the art folder, e.g. "art/breadcrumbs-sketch.jpg". */
      { heading: "Sketches and screens",
        layout: "wide",
        gallery: [
          { src: "", alt: "", caption: "Early sketches of the popup" },
          { src: "", alt: "", caption: "The popup in Figma" },
          { src: "art/breadcrumbs-saved-light.png", alt: "The Breadcrumbs popup in light mode with four saved highlights, each showing its text and page address. The second one is selected, with an amber background and a thick dark border", caption: "Light mode, with a breadcrumb selected" },
          { src: "art/breadcrumbs-saved-dark.png", alt: "The same list in dark mode. The selected breadcrumb has a brown background and a tan border, and the buttons are light cream", caption: "Dark mode, with a breadcrumb selected" },
          { src: "art/breadcrumbs-light.png", alt: "The Breadcrumbs popup in light mode: a cream panel titled Your Saved Highlights, with instructions for saving a highlight and brown Visit, Remove and Clear All buttons", caption: "Light mode, empty state" },
          { src: "art/breadcrumbs-dark.png", alt: "The same popup in dark mode: an espresso panel with light cream text and dark brown buttons", caption: "Dark mode, empty state" }
        ] },
      { heading: "How it works",
        steps: [
          { title: "Pin it", text: "Click the extension icon and pin Breadcrumbs to the toolbar." },
          { title: "Save a highlight", text: "Highlight text on any page, right-click, and choose “Save to Breadcrumbs”. The text and its page are saved on your device." },
          { title: "Pick one", text: "Open the extension and select a saved breadcrumb, with a click or with Tab and Enter or Space." },
          { title: "Jump back", text: "Choose Visit. The page opens, scrolls to your passage and highlights it. Remove deletes one breadcrumb and Clear All deletes them all, each after a confirmation." }
        ] },
      { heading: "Design system",
        text: "A warm, earthy palette inspired by breadcrumb trails: coffee browns, cream backgrounds and amber highlights. Buttons have a subtle inset shadow, a faux-3D look that shows they can be pressed.",
        list: [
          "Light mode: coffee brown #4B2E20 on cream #FDF3E7, golden amber #F8D89A highlights and a dark walnut #5D4A37 selected border",
          "Dark mode: light cream #FCEFD9 on dark espresso #271912, burnt umber #5C3B27 highlights and a tan #D7B48B selected border",
          "Every combination tested at 4.5:1 contrast or more"
        ] },
      { heading: "Gestalt principles",
        highlights: [
          { title: "Proximity", text: "Related things sit together: the title and theme toggle, the list of breadcrumbs, and the action buttons." },
          { title: "Similarity", text: "Every button and card shares the same styling, so they read as one family." },
          { title: "Common region", text: "The action buttons sit in their own area, with a thin top border and a soft background." },
          { title: "Figure and ground", text: "Strong contrast between controls and backgrounds, and a selected state that uses several cues at once." }
        ] },
      { heading: "Accessible from the start",
        highlights: [
          { title: "Keyboard first", text: "Every breadcrumb and button works with Tab, Enter and Space. Focus shows as a 3 px outline with a 3 px offset, only for keyboard users." },
          { title: "Screen readers", text: "The list is announced as a list, each item has a label like “Breadcrumb 1” with a preview of its text, and its selected state is announced. Actions such as “Breadcrumb removed” are read out." },
          { title: "More than colour", text: "A selected breadcrumb changes background, gets a 3 px border and a shadow, and turns bold, so it's clear without relying on colour." },
          { title: "Private by default", text: "Data stays on your device. No servers, no tracking, no account and no browsing-history permission: the extension only reaches a page when you save from it." }
        ] },
      { heading: "Challenges and solutions",
        highlights: [
          { title: "Dark mode reset every time", text: "I saved the preference with the Chrome Storage API and apply it before the popup draws, so it never flashes the wrong theme." },
          { title: "Disabled buttons failed contrast", text: "I replaced 50% opacity with dedicated colours tested at 5.2:1 in light mode and 4.8:1 in dark mode." },
          { title: "The selection was too subtle", text: "Colour alone wasn't enough, so a selected item now changes background, border, shadow and weight together." },
          { title: "No feedback after a keyboard selection", text: "Focus now moves to the selected item, and its selected state stays in sync for screen readers." },
          { title: "The scrollbar looked cut off", text: "I added padding and gave the scrollbar a border that matches the background." }
        ] },
      { heading: "Testing and iteration",
        text: "I tested with Lighthouse and with the keyboard alone, simulated three types of colour blindness, and asked peers and friends to try it. What changed:",
        list: [
          "A clearer empty state: “Right-click highlighted text to get started”",
          "Clearer button names: “Go to URL” became Visit, and “Clear” became Remove",
          "A hover border on the dark mode toggle, whose icon wasn't obvious",
          "A stronger selected state, from a 1 px to a 3 px border plus an outer ring",
          "A confirmation before anything is deleted"
        ] },
      { heading: "Results",
        metrics: [
          { value: "100", label: "Lighthouse accessibility score" },
          { value: "<100 KB", label: "total extension size" },
          { value: "5.2:1", label: "text contrast in light mode, 4.8:1 in dark" }
        ] },
      { heading: "Reflection",
        text: [
          "Building accessibility in from the start saved a lot of refactoring. My first palette used lighter colours that failed contrast checks, and switching to the warm browns early gave everything a solid base.",
          "The biggest lesson: accessibility needs redundant cues. Colour, shape, size, shadow and weight work together, especially when soft pastels and subtle effects pull against WCAG."
        ] },
      { heading: "What's next",
        list: [
          "Citations: copy a breadcrumb in MLA, APA, Chicago or IEEE format, with the page title, author and access date",
          "Notes and tags: say why a passage matters, tag it by topic or project, then search and filter",
          "Sharing the code on GitHub"
        ] }
    ]
  },
  {
    /* A client project: name the client only if she agrees. */
    id: "nail-shop",
    title: "Nail shop",
    summary: "A finished freelance project: I rebuilt a press-on nail business's older, mostly static shop as the front-facing, skeletal Next.js site my client asked for, mobile-first and accessible, in her playful, product-first style.",
    year: "",   // add the year, e.g. "2025"
    role: "Front-end developer and designer (freelance)",
    team: "Me and my client",
    platform: "Responsive web",
    tools: "Next.js (App Router), React, JavaScript, CSS, ESLint, Lighthouse, axe DevTools, Vercel",
    tags: ["Client project", "Delivered", "Next.js"],
    color: "pink",
    cover: { text: "Coming soon" },   // swap for { image: "...", alt: "..." } once you have screenshots without the client's branding
    links: [
      { label: "View the demo shop", url: "" }   // paste the demo link between the quotes
    ],
    sections: [
      { heading: "The client",
        text: [
          "My client is a full-time student who makes and sells press-on nails on the side. She wanted a shop that felt like her brand: playful, simple and all about the products.",
          "The look was her direction. My job was to make the site modern, easy to maintain and accessible."
        ] },
      { heading: "Project status",
        text: "Done. My client asked for a front-facing, skeletal site: the storefront, header, product list and product pages, ready for her to grow. That's what I delivered. The products shown are placeholders until she adds her own." },
      { heading: "Goals",
        list: [
          "Replace scattered static pages with a maintainable Next.js App Router structure",
          "An accessible two-row header: the brand always visible, and a mobile menu that takes no space when it's closed",
          "A hero with clear choices: Shop, or DM on Instagram",
          "A product list and product pages with a photo gallery that works with a keyboard",
          "Product data in a simple JSON file to start, with a clean path to Prisma, Stripe or Shopify later"
        ] },
      /* Screenshots go here once the client's name, Instagram handle and placeholder
         photos are removed from the shop. Add them as gallery items, e.g.
         gallery: [{ src: "art/shop-home.jpg", alt: "...", caption: "..." }] */
      { heading: "Screenshots",
        text: "Coming soon." },
      { heading: "What I built",
        highlights: [
          { title: "Hero", text: "A split layout, photo and text, with a main button and a lighter second button." },
          { title: "Products", text: "A grid, and a page for each product. The gallery thumbnails are real buttons with labels, and the photo showing is marked as current for screen readers." },
          { title: "Styling", text: "One global stylesheet, with no CSS framework, so styles stay predictable." },
          { title: "Deployment", text: "Hosted on Vercel and rebuilt automatically every time I push a change." }
        ] },
      { heading: "Accessibility and performance",
        text: "I audit it with Lighthouse and axe DevTools. Every Lighthouse category scores 83 or higher, and I'm working toward 100 in accessibility: contrast, heading order, landmark labels, alt text and focus management.",
        metrics: [
          { value: "83+", label: "in every Lighthouse category" }
        ] },
      { heading: "Tech stack",
        list: [
          "Framework: Next.js (App Router)",
          "Language: JavaScript (React and JSX)",
          "Markup and styles: semantic HTML through React, with one global stylesheet",
          "Tooling: ESLint, Lighthouse and axe DevTools",
          "Data: a JSON file of products, shaped to map onto a database later",
          "Hosting: Vercel"
        ] },
      { heading: "Built to grow",
        text: "Products come from a JSON file, which keeps changes quick. The structure leaves a clean path for whenever she wants more: a Prisma database (SQLite or Postgres), payments through Stripe or Shopify, and a way to add products herself." }
    ]
  },
  {
    /* A self-initiated redesign. Keep "Concept" in the tags so nobody
       mistakes it for work commissioned by Yale. */
    id: "yale-art",
    title: "Yale School of Art redesign",
    summary: "A concept redesign of a famously chaotic website into a clean, accessible and functional experience that still feels like an art school.",
    year: "",   // add the year of this redesign, e.g. "2025"
    role: "UI/UX designer",
    timeline: "1 day",
    team: "Solo",
    platform: "Responsive web",
    tools: "Figma",
    tags: ["Concept", "Redesign", "Accessibility"],
    color: "butter",
    cover: { image: "art/yale-cover.jpg", alt: "The redesigned Yale School of Art page on a navy background: a navy menu bar, an About section with the Yale crest beside a photo of a chair under a School of Art blanket, and a blue “Lux et Veritas, Light and Truth” banner over torn paper and polaroid frames" },
    links: [
      { label: "View the prototype on Figma", url: "https://www.figma.com/proto/cKWzJAojyq5QD5tr3pRC8l/Yale-School-of-Art-Redesign?node-id=1-2&p=f&t=552dYV9RDglMqhu3-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1" },
      { label: "See the original site", url: "https://www.art.yale.edu/" }
    ],
    sections: [
      { heading: "Overview",
        text: [
          "I revisited a school project from years ago, a redesign of the Yale School of Art website, and tackled it again with much more design experience.",
          "The original site is known in design circles for its chaotic layout, clashing colours and hard-to-read text. My redesign puts hierarchy, accessibility and people's needs first while respecting the school's creative identity.",
          "It began as a high school assignment. Looking back, I could see how much I'd learned, and I wanted to find out what I could do with fresh eyes and real experience."
        ] },
      { heading: "The problem",
        text: "The site's experimental approach reflects the school's avant-garde spirit, but it puts real barriers in front of the people using it:",
        list: [
          "Hard-to-read type: inconsistent sizes, colours and weights make the page impossible to scan",
          "Colour chaos: bright, clashing colours with no purpose or hierarchy",
          "Buried information: key details are hard to find",
          "Accessibility failures: low contrast, no clear focus states and unpredictable navigation",
          "Not mobile friendly: the layout breaks on small screens and text becomes unreadable"
        ] },
      { heading: "Why redesign it",
        text: "In high school I didn't have the skills to find the root causes or design a system to fix them. Coming back years later was a chance to show that growth on a genuinely hard redesign." },
      { heading: "Goals",
        list: [
          "Turn the chaotic site into a clean, accessible layout",
          "Make it easier to read and scan for everyone who uses it",
          "Keep its creative, artistic identity without giving up usability"
        ] },
      { heading: "Process",
        steps: [
          { title: "Research", text: "Studied Yale's site and other art schools' sites, and noted the key things to include and highlight." },
          { title: "Prototype", text: "Designed the pages in Figma, all in one day." }
        ] },
      { heading: "Visual system",
        highlights: [
          { title: "Typography", text: "A clean sans-serif with a clear hierarchy, so pages are easy to read." },
          { title: "Colour", text: "Cut down to 4 or 5 colours, each with a purpose. Every combination meets contrast requirements." },
          { title: "Grid", text: "Consistent spacing and alignment on every page." }
        ] },
      { heading: "Three versions",
        steps: [
          { title: "Version 1 (2022)", text: "My first redesign, years ago: too minimal, and a bit boring." },
          { title: "Version 2", text: "Better, but the design pulled attention away from the content." },
          { title: "Version 3, final", text: "Balanced: visual interest that still keeps a clear hierarchy." }
        ] },
      { heading: "Landing page, before and after",
        layout: "wide",
        gallery: [
          { src: "art/yale-original-landing.jpg", alt: "The original landing page: a large yellow-highlighted YALE SCHOOL OF ART title over a repeated photo of a chair with a School of Art blanket, a white menu box, an orange text panel, a yellow-to-white gradient text box and a bright green announcement box layered on top", caption: "Original Yale School of Art landing page as of December 22, 2025." },
          { src: "art/yale-2022-landing.jpg", alt: "My 2022 redesign: a grey header with a gold serif title, a grey sidebar menu with beveled buttons, and two grey text boxes describing the school and its wiki", caption: "My initial redesign of Yale School of Art landing page as of 2022." },
          { src: "art/yale-redesign.jpg", alt: "The final redesign: a clear header and navy menu, an About section with readable text beside the Yale crest and a photo, and a collage of torn paper, polaroids and a Lux et Veritas banner that keeps the art school feel", caption: "My final redesign of the landing page." }
        ] },
      { heading: "Event calendar, before and after",
        layout: "wide",
        gallery: [
          { src: "art/yale-original-calendar.jpg", alt: "The original calendar: a pale cyan list of dated events with small coloured bars, sitting over the busy repeated chair photo, with a black-highlighted On the calendar label", caption: "Original Yale School of Art event calendar section as of December 22, 2025." },
          { src: "art/yale-redesign-calendar.jpg", alt: "My redesigned calendar: an Upcoming Events heading over a navy Events Calendar panel with large date numbers and colour-coded event cards, beside three large links to the visiting artist schedule, the exhibition schedule and the community calendar", caption: "My redesign of Yale School of Art event calendar section." }
        ] },
      { heading: "Community bulletin board, before and after",
        layout: "wide",
        gallery: [
          { src: "art/yale-original-bulletin.jpg", alt: "The original bulletin board: yellow-to-white gradient boxes of small dense text, one with its own scrollbar, placed over the busy repeated chair photo", caption: "Original Yale School of Art Community Bulletin Board section as of December 22, 2025." },
          { src: "art/yale-redesign-bulletin.jpg", alt: "My redesigned bulletin board: a blue ribbon heading over a cork-style board holding six pastel sticky notes held on with washi tape, each with a short post", caption: "My redesign of Yale School of Art Community Bulletin Board." }
        ] },
      { heading: "Newsletter, before and after",
        layout: "wide",
        gallery: [
          { src: "art/yale-original-newsletter.jpg", alt: "The original newsletter section: a black-highlighted heading and two gradient boxes, one yellow and one green, with small text and links over the chair photo", caption: "Original Yale School of Art Newsletter section as of December 22, 2025." },
          { src: "art/yale-redesign-newsletter.jpg", alt: "My redesigned newsletter section: a white card on a blue frame with the school's shield, a Get our Newsletters heading, short descriptions of the two newsletters, an email field and a red Subscribe button", caption: "My redesign of Yale School of Art Newsletter." }
        ] },
      { heading: "Reflection",
        text: [
          "In high school I made the site “prettier” without understanding why it was broken. This time I worked systematically: finding the problems, researching solutions, making deliberate decisions and writing down why.",
          "That shift from taste-driven to strategy-driven design is the biggest change in my work.",
          "This is a self-initiated concept and isn't affiliated with Yale."
        ] }
    ]
  },
  {
    id: "portfolio",
    title: "This portfolio",
    summary: "A portfolio dressed as a pastel retro desktop, designed and built accessibility first.",
    year: "2026",
    role: "Designer and developer",
    timeline: "Ongoing",
    team: "Solo",
    platform: "Responsive web",
    tools: "HTML, CSS, JavaScript, Canvas, Web Audio, axe-core",
    tags: ["Front-end", "Accessibility", "Interaction design"],
    color: "lilac",
    cover: { text: "The site you're on right now" },
    sections: [
      { heading: "Overview",
        text: "I wanted a portfolio people would remember, so it looks like a retro desktop: windows you can drag, pixel icons, sounds, and a sky that turns to stars at night. Underneath, it behaves like a regular website. Every window has a heading, works with a keyboard and closes with Esc." },
      { heading: "Inspiration",
        text: [
          "The desktop comes from Emily Is Away, a game told entirely through a chat client on a Windows XP-style desktop, modelled on the early-to-mid 2000s versions of ICQ and AOL Instant Messenger. I borrowed that feeling for the Messages window, which answers like an old instant-messenger away message.",
          "The wallpaper is my take on the classic Windows XP landscape, the rolling green hills under a wide blue sky that greeted everyone who turned on a computer in the 2000s. I redrew it as pixel art, with a night version for dark mode.",
          "The pixel art style and the dreamy feel come from Stardew Valley and Celeste. Stardew Valley gave me the cozy side: soft colours, chunky pixel icons, a little cabin and drifting clouds. Celeste gave me its glowing night skies, layered mountain silhouettes and sparkle effects. I wanted the site to feel as warm as one and as atmospheric as the other."
        ],
        // Your inspiration board. Use your own photos and sketches; for game
        // screenshots, name the game in the caption.
        gallery: [
          { src: "", alt: "", caption: "[My moodboard: colours, skies and pixel art I collected]" },
          { src: "", alt: "", caption: "[First pixel sketches of the day hills]" },
          { src: "", alt: "", caption: "[First pixel sketches of the night sky]" }
        ] },
      { heading: "The challenge",
        text: "Dragging, sound and animation are exactly the features that usually break accessibility. The goal was to keep all of them and still meet WCAG 2.2 AA and the AODA, so every playful feature needed an accessible way in." },
      { heading: "Process",
        steps: [
          { title: "Define", text: "Portfolio first, retro second: the desktop is the look, and the content has to work like a normal site." },
          { title: "Design the palettes", text: "A pastel daytime palette and a celestial night one, with every text colour checked for at least 4.5:1 contrast in both.",
            image: { src: "", alt: "", caption: "[My palette swatches with their contrast scores]" } },   // any step can show a picture
          { title: "Build", text: "Plain HTML, CSS and JavaScript. The icons are pixel art drawn as SVG, the sky is drawn on a canvas, and every sound is synthesized with Web Audio." },
          { title: "Test", text: "Automated accessibility checks in light mode, dark mode and on a phone, a keyboard-only pass, and checks at 320 pixels wide and with reduced motion." }
        ] },
      { heading: "From sketch to screen",
        layout: "wide",
        gallery: [
          { src: "", alt: "", caption: "[A paper or tablet sketch of the desktop]" },
          { src: "", alt: "", caption: "[A window drawn in my art app]" },
          { src: "", alt: "", caption: "[The finished desktop in light and dark mode]" }
        ] },
      { heading: "Decisions that made it accessible",
        highlights: [
          { title: "Dragging has a keyboard twin", text: "Each window has a move button: the arrow keys move it, and Enter centres it." },
          { title: "Sound and motion are optional", text: "Both switch off from the top bar, the choice is remembered, and animation starts off if a device asks for reduced motion." },
          { title: "Legibility over nostalgia", text: "The pixel font made a capital C look like an O at small sizes, so it's only used for large text." },
          { title: "A chat that can't be flooded", text: "Messages takes one question at a time, with a short pause, so rapid clicks can't pile up." }
        ] },
      { heading: "Results",
        metrics: [
          { value: "0", label: "automated WCAG 2.2 AA issues in light, dark and mobile" },
          { value: "4.5:1", label: "minimum text contrast in both themes" },
          { value: "320px", label: "narrowest screen tested, with no sideways scrolling" }
        ] },
      { heading: "Reflection",
        text: "Constraints made it better. Next, I want to test it with people who use screen readers and magnifiers every day, and keep adding case studies through one content file." }
    ]
  }

  /* TEMPLATE: to add a project, put a comma after the block above, then paste
     a copy of this block (without the slash-star lines) and fill it in.
  {
    id: "new-project",
    title: "Project name",
    summary: "One sentence on what it is and who it's for.",
    year: "2026",
    role: "Your role",
    timeline: "How long it took",
    team: "Who you worked with",
    platform: "Where it lives",
    tools: "What you used",
    tags: ["Tag", "Tag"],
    color: "sky",
    cover: { style: "browser" },
    sections: [
      { heading: "Overview", text: "What the project is and why it mattered." },
      { heading: "Process", gallery: [{ src: "art/sketch.jpg", alt: "What the photo shows", caption: "A short caption" }] },
      { heading: "Results", metrics: [{ value: "00%", label: "what changed" }] }
    ],
    links: []
  }
  */
];

/* GOALS: the Goals window. Three groups, each a list of items.
   Move an item between groups as it progresses, or add new groups. */
const GOALS = {
  intro: "What I'm building now, what's next, and what I'm working toward.",
  groups: [
    { title: "In progress",
      items: [
        { title: "Working on my next project :)" }
      ] },
    { title: "Planned",
      items: [
        { title: "Civic reporting app", text: "An app that lets older people with low vision and newcomers still learning English report street problems, like a broken stop sign or a traffic light that's out, in their own language and at a size they can read." },
        { title: "Toronto independent bookstores", text: "A searchable database website with my friend, shining a light on Toronto's independent bookstores so people can find them, visit them and support local shops." }
      ] },
    { title: "Goals",
      items: [
        { title: "Master more Vietnamese", text: "Keep learning the language of my ancestors, so I can share more of their stories and stay close to my family's roots." },
        { title: "Land my next role", text: "Front-end development, UI/UX design or another creative role where accessibility is part of the craft." }
      ] }
  ]
};

/* ART: swap in your own artwork. Leave a line empty ("") to keep the
   built-in art. Pixel art can be drawn small: it's scaled up with crisp pixels.
   Desktop icons are set per window with iconImage in WINDOWS, and case study
   covers with cover: { image } in PROJECTS. The README has sizes for everything. */
const ART = {
  caseStudyIcon: "",       // the small icon on every case study window, e.g. "art/case.png"
  konamiHint: "",          // the faint easter-egg hint under your name, one strip image
  controllerIcon: "icons/controller.png",  // the little controller that plays the secret code, 16 x 16
  wallpaperDay: "art/wallpaper-day.png",   // your sky, horizon and hills, 640 x 360
  wallpaperNight: "art/wallpaper-night.png",   // the same scene at night, 640 x 360
  // A smooth gradient sky with one rolling hill along the bottom, drifting clouds,
  // sparkles by day and stars at night. Set to false to show your wallpapers (art folder).
  skyOnly: true,
  // The gradient, top to bottom. With your wallpapers, it shows through their see-through sky.
  skyGradientDay: ["#FFCFE6", "#BBD7FF", "#FFF0CB"],
  skyGradientNight: ["#0B0A1D", "#24235E", "#9132C6"],
  cursor: "",              // arrow pointer, 32 x 32 or smaller, e.g. "art/cursor.png"
  cursorHotspot: [0, 0],   // the pixel that clicks, counted from the top-left
  cursorHand: "",          // pointer over buttons and links
  cursorHandHotspot: [8, 0],
  // Moving pieces: you draw them, the code only moves, twinkles and fades them.
  // Leave any empty to keep the built-in one. Draw them at your wallpaper's pixel
  // size (one sprite pixel = one wallpaper pixel). Without your own wallpaper,
  // one sprite pixel shows as 4 screen pixels.
  sprites: {
    clouds: [],            // 2 to 4 cloud shapes, e.g. ["art/cloud-1.png", "art/cloud-2.png"]: drift across the sky
    sparkle: "",           // twinkles in the sky, and bursts on clicks, the pointer trail and fireworks
    // Optional extras, only if you want them later:
    star: "",              // a separate night star (otherwise your sparkle is used)
    smoke: "",             // a chimney puff, with smokeFrom below
    shootingStar: ""       // crosses the night sky now and then
  },
  // Only needed with your own wallpaper, in your wallpaper's pixels:
  animate: {
    skyBottom: 189,        // the row where your hills begin; sparkles and clouds stay above it (0 = top 70%)
    skyGradientTo: 256,    // the lowest row where your sky shows, so the gradient ends at the horizon
    smokeFrom: null,       // only with a smoke sprite: the chimney top as [x, y]
    cloudsAtNight: true,   // clouds drift at night too (false keeps the night sky clear)
    cloudCount: 6,
    starCount: 40
  },
  // "theme" uses only the shape of your symbols and fills it with the theme's text
  // colour, so every button passes contrast in both themes. "asDrawn" keeps your
  // colours: then each symbol needs 3:1 contrast on white and on #181640.
  glyphColours: "theme",
  glyphs: {                // small symbols on buttons, 8 x 8 (shown at 2x)
    close: "", maximize: "", restore: "", move: "",
    soundOn: "", soundOff: "", sparkle: "", moon: "",
    send: "", externalLink: "", cursorToggle: ""
  }
};

/* EASTER EGG: what appears when someone enters the Konami code
   (up, up, down, down, left, right, left, right, B, A). */
const EASTER_EGG = {
  title: "Cheat code accepted!",
  lines: ["+30 lives", "Unlimited inspiration unlocked", "Every window is now 10% cozier"]
};

/* AFFIRMATIONS: the sticky notes in the Affirmations window, shown in a
   random order. Add, edit or delete lines freely. */
const AFFIRMATIONS = [
  "You don't have to be finished to be worth something.",
  "Rest is part of the work.",
  "Small steps still move you forward.",
  "Your perspective is something no one else can design.",
  "Asking for help is how good things get built.",
  "Progress, not perfection.",
  "You belong in every room you walk into.",
  "Mistakes are just early drafts.",
  "Be as kind to yourself as you are to the people you design for.",
  "Your languages, your culture and your story are strengths.",
  "Drink some water. Then keep going.",
  "Today counts, even if it was a quiet one."
];

const CV = {
  // The PDF is a separate file so its formatting stays exactly as you made it.
  // Export your CV as a PDF, save it as cv.pdf next to index.html (replacing
  // the sample), or change this to its file name. Leave empty ("") to hide the button.
  pdf: "LisaVoNguyenResume.pdf",
  summary: "Currently SWE AI trainer with experience in front-end development, UI/UX design, and robotics.",
  experience: [
    { role: "SWE AI Trainer", org: "Freelance", place: "Toronto, ON", dates: "2026–present",
      points: ["Evaluated frontier AI models through hands-on agentic coding sessions, resolving real-world engineering tasks (bug fixes, API development, feature implementation) across production-grade codebases in Python, JavaScript, and full-stack environments.", "Conducted rigorous code review of AI-generated solutions, benchmarking output against professional engineering standards and best practices, and produced detailed technical documentation and failure analyses used as training data to improve next-generation coding agents.", "Red-teamed large language models to uncover security vulnerabilities, unsafe code patterns, and false-positive test results, strengthening AI safety guardrails and reducing deployment risk."] },
    { role: "UI/UX Designer and Front-End Developer", org: "Freelance", place: "Toronto, ON", dates: "2025–2026",
      points: ["Designed and built responsive, accessible web interfaces for clients using Figma, HTML, CSS, JavaScript, and React, following WCAG standards and brand guidelines.", "Created and maintained technical documentation, design specifications, and process guides, ensuring content was clear, accurate, and aligned with project standards.", "Gathered client requirements, translated complex technical concepts into accessible documentation, and managed multiple projects simultaneously within agreed timelines."] },
    { role: "Web Developer", org: "VentureLAB", place: "Markham, ON", dates: "2024",
      points: ["Built and maintained web applications using HTML, CSS, and JavaScript, following organizational standards and accessibility best practices.", "Created and maintained internal documentation, reports, and process materials using Microsoft Office Suite, keeping content well-structured, accurate, and aligned with current processes.", "Collaborated cross-functionally with subject matter experts and stakeholders to gather requirements and ensure deliverables reflected current processes and needs."] }
  ],
  education: [
    { title: "Bachelor of Information Technology", org: "York University", dates: "2019–2024" }
  ],
  certifications: [
    { title: "First Aid and CPR", org: "Canadian Red Cross", dates: "Pending Renewal" }
  ],
  skills: [
    { group: "UI/UX", items: ["Figma", "Balsamiq", "Wireframing", "Prototyping", "Interaction design", "Usability testing"] },
    { group: "Accessibility", items: ["WCAG", "AODA", "Colour Contrast Analyzer", "axe DevTools", "Keyboard navigation", "ARIA (basics)"] },
    { group: "Development and programming", items: ["HTML", "CSS", "Bootstrap", "Tailwind CSS", "JavaScript", "React", "TypeScript", "Java", "Python"] }
  ],
  community: [
    "Regular Blood and Plasma Donor"
  ],
  updated: "November 2026"
};

/* The chat answers in your voice. {name}, {firstName}, {email}, {location}
   and {time} (your local time) are filled in for you. Each suggested question
   is a button; "keywords" let typed questions find the right answer. */
const CHAT = {
  status: "Away from my desk, auto-reply is on",
  intro: [
    "Hi, I'm {firstName}! Thanks for stopping by.",
    "I'm away from my desk, so this auto-reply is answering for me. I wrote every answer myself. Pick a question below or type your own."
  ],
  placeholder: "Type your own question",
  // A short hint under the box, so people know which words get good answers.
  typeHint: "Try words like work, process, hiring, contact, languages or hobbies.",
  // Pause between questions, in milliseconds. Suggested questions and Send
  // wait while an answer is being typed, then for this long after it.
  waitBetweenQuestions: 1000,
  questions: [
    { id: "who", chip: "Who are you?",
      keywords: ["who", "about you", "yourself", "bio", "background", "introduce", "your name", "tell me about", "who is"],
      answer: [
        "I'm {name}, a UI/UX designer and front-end developer in {location}.",
        "I design and build accessibility-first apps, and most of them start with a problem I've watched someone in my life struggle with."
      ],
      actions: [{ label: "Open About me", open: "about" }] },
    { id: "work", chip: "Show me your best work",
      keywords: ["work", "project", "portfolio", "case stud", "example", "best", "show me", "made", "design", "apps", "breadcrumbs", "extension", "nail", "yale", "redesign"],
      answer: ["Here are my {projectCount} most recent case studies. Each one covers the problem, the research and what changed after launch."],
      projects: true,
      actions: [{ label: "Open the Work window", open: "work" }] },
    { id: "hire", chip: "Are you open to work?",
      keywords: ["hire", "hiring", "available", "availability", "open to work", "open to", "job", "role", "freelance", "contract", "position", "opportunit", "recruit", "employ", "full time", "part time", "internship", "start"],
      answer: [
        "Yes! I'm open to front-end development, UI/UX design and other creative roles, in Toronto or remote within Canada.",
        "I'm happiest on teams that treat accessibility as part of the craft, not a final check."
      ],
      actions: [{ label: "Open my CV", open: "cv" }], cvPdf: true },
    { id: "process", chip: "How do you design?",
      keywords: ["process", "approach", "method", "how do you design", "how you design", "workflow", "research", "steps", "usability", "user testing", "ux"],
      answer: [
        "I start with research: talking to the people I'm designing for and watching how they use what exists today.",
        "Then I wireframe in low fidelity and test with real people. Accessibility notes sit beside every screen, so contrast, focus order and labels are settled before visual polish.",
        "My everyday tools are Figma and Balsamiq for design, and axe DevTools and the Colour Contrast Analyzer for accessibility checks."
      ] },
    { id: "contact", chip: "How can I reach you?",
      keywords: ["contact", "email", "reach", "in touch", "linkedin", "github", "talk", "call", "connect", "get hold"],
      answer: ["Email is best: {email}. I reply within two working days."],
      copyEmail: true, profileLinks: true },
    { id: "secret", chip: "Psst, any secrets?",
      keywords: ["psst", "any secrets"],
      answer: ["Do you know what the Konami code is? Shhhh\u2026", "Look closely under my name on the desktop. Then click the desktop and type it on your keyboard."],
      actions: [{ label: "No keyboard? Try it here", egg: true }] },
    { id: "fun", chip: "Tell me a fun fact",
      keywords: ["fun", "fact", "random", "surprise", "joke"],
      random: [
        "Pho isn't my favourite Vietnamese dish.",
        "I have participated in handmade markets with my crochet work before.",
        "My favourite movies are the ones that make me cry.",
        "Ask me about perfume and I'll tell you about notes, accords and my current favourite."
      ] }
  ],
  // Answered when someone types a matching question. These have no button.
  extras: [
    { id: "tools", keywords: ["tool", "figma", "software", "stack", "code", "html", "css"],
      answer: ["For design: Figma and Balsamiq for wireframes and prototypes. For code: HTML, CSS, JavaScript, React and TypeScript, plus Bootstrap and Tailwind CSS. I check accessibility with axe DevTools, the Colour Contrast Analyzer and a keyboard."] },
    { id: "where", keywords: ["where", "location", "based", "live", "city", "time zone", "timezone", "toronto", "canada", "remote", "time is it"],
      answer: ["I'm based in {location}, and it's {time} here right now. I'm happy to work remotely across Canadian time zones."] },
    { id: "a11y", keywords: ["accessib", "a11y", "wcag", "aoda", "screen reader", "keyboard", "inclusive", "disab"],
      answer: ["Accessibility is the part of design I care about most. This site is built to WCAG 2.2 AA, which covers the AODA's web rules: every window works with a keyboard and a screen reader, and you can turn sound and animation off in the top bar."],
      actions: [{ label: "Read my accessibility notes", open: "about" }] },
    { id: "retro", keywords: ["retro", "desktop", "inspir", "emily", "stardew", "celeste", "pixel", "aesthetic", "nostalg", "90s", "this site", "website", "built", "why does"],
      answer: [
        "The desktop was inspired by Emily Is Away, a game told through an early-2000s instant messenger on a Windows XP-style desktop. That's why I answer you with an away message!",
        "The wallpaper is the classic Windows XP hills redrawn as pixel art, in a style inspired by Stardew Valley and Celeste.",
        "Underneath, it's a regular website: every window has a heading, works with a keyboard and closes with Esc."
      ] },
    { id: "cv", keywords: ["cv", "resume", "experience", "education", "degree", "school", "certif"],
      answer: ["My CV has my education, experience and skills, and you can download it as a PDF."],
      actions: [{ label: "Open my CV", open: "cv" }], cvPdf: true },
    { id: "next", keywords: ["next", "goal", "plan", "working on", "future", "roadmap", "civic"],
      answer: ["Next up is a civic reporting app, so older people with low vision and newcomers still learning English can report problems like broken traffic lights in their own language. My Goals window has the rest."],
      actions: [{ label: "Open Goals", open: "goals" }] },
    { id: "languages", keywords: ["language", "speak", "bilingual", "multilingual", "french", "learning"],
      answer: ["I speak {languages}. As for the languages I'm learning: too many to count! Languages are a big part of why I care about designing for multicultural communities."],
      actions: [{ label: "Open About me", open: "about" }] },
    { id: "hobbies", keywords: ["hobby", "hobbies", "perfume", "fragrance", "crochet", "cook", "read", "game", "photograph", "fashion", "art", "weekend", "free time", "interests", "outside of work", "for fun"],
      answer: ["I'm a creative at heart. Outside of work you'll find me into {hobbies}.", "And I could talk about languages and perfumes for hours."],
      actions: [{ label: "Open About me", open: "about" }] },
    { id: "diversity", keywords: ["diversity", "diverse", "multicultural", "culture", "inclusion", "community", "values"],
      answer: ["Diversity shapes how I design. The people I make things for speak different languages and come from different cultures, so I design with them, not just for them."] },
    // Hidden with the Affirmations window. Delete the // on the next three lines to bring it back.
    // { id: "notes", keywords: ["affirmation", "sticky", "note", "motivat", "encourag", "kind words"],
    //   answer: ["I keep a stack of sticky notes on my desktop for days that need one. Take as many as you like!"],
    //   actions: [{ label: "Open Affirmations", open: "notes" }] },
    { id: "cheat", keywords: ["konami", "cheat", "easter egg", "secret", "hidden"],
      answer: ["You found the secret question! Try the old cheat code on your keyboard: up, up, down, down, left, right, left, right, B, A. No keyboard? Press the button."],
      actions: [{ label: "Try it", egg: true }] },
    { id: "salary", keywords: ["salary", "rate", "pay", "compensation", "price", "cost", "budget"],
      answer: ["Happy to talk about that directly. Email me at {email} and we'll find a time."] },
    { id: "hello", keywords: ["hi", "hello", "hey", "howdy", "good morning", "good afternoon", "good evening"],
      answer: ["Hi there! What would you like to know?"] },
    { id: "thanks", keywords: ["thank", "thx", "cheers", "appreciate"],
      answer: ["You're welcome! Thanks for spending time with my work."] }
  ],
  fallback: ["My auto-reply only knows a few things. Try one of the suggested questions, or email me at {email}."]
};
