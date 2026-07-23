---
name: talk-slides
description: Build or edit a talk deck under slides/ on this site. Use when Bhumika wants slides for a conference talk, seminar, lecture or paper presentation, or wants to change an existing deck. Covers the shared engine in slides/shared/, her house style (cream and ink, Work Sans with Cormorant, Shobhika for Devanagari, click driven fragments), the component library, and the screenshot check loop.
---

# Talk slides

Decks live at `slides/<talk-name>/` and are plain HTML on a fixed 1920x1080 stage. No build step, no
framework, no npm. A deck opens by double clicking `index.html`, and also works served by Jekyll at
`bhumikamittal.in/slides/<talk-name>/`.

Every deck is three things:

| file | what it holds |
| --- | --- |
| `slides/shared/deck.js` | the engine, shared by every deck. Do not fork it into a deck folder. |
| `slides/shared/deck.base.css` | stage, motion, page chrome, the component library, self hosted Shobhika |
| `slides/<talk>/index.html` | the slides, one `<section class="slide">` each |
| `slides/<talk>/deck.css` | that talk's theme override and its own figures |

`slides/ichim26/` is the reference deck. Read it when you need a worked example of anything below.

Keys while presenting: arrows or space step through fragments then slides, `E` inline edit,
`Ctrl/Cmd+S` export an edited copy, `F` fullscreen, `P` print to PDF, `S` presenter view with notes
and a timer. `#7` deep links to slide 7, `#7.2` to slide 7 at fragment 2.

## Starting a new deck

1. `mkdir slides/<talk-name>` and copy `starter/index.html` and `starter/deck.css` from this skill
   folder into it.
2. Fill in the `<title>`, the kicker (spell the conference name out in full, no acronym), the talk
   title, the authors.
3. Ask for the slide plan before writing any content slides. Build exactly the plan you are given,
   in the order given. See "Working method".

Keep the folder flat: `index.html`, `deck.css`, then `audio/`, `figures/`, `paper/` as needed.

## House style

**Copy.** No em dashes, ever. Use commas, periods, colons or semicolons. No decorative arrows or
middots inside a sentence; a middot is only a separator in metadata rows (authors, `antima m = 3 ·
sthāna n = 3`). No "not X but Y" balancing, no filler adjectives, no summary sentence that repeats
the slide title back. Pull phrasing from the source paper or the verses rather than inventing it.
Sentences stay short and plain. Slide titles are Title Case and never italic.

**Type.** Sans is the working font: slide titles, body, labels, numerals inside figures, notes.
Serif is reserved, and used for the title slide `h1`, IAST transliteration, `.bigsay` statements, big
statistics, step numbers, and small italic labels like dates. Italic marks transliteration and those
small labels only, never a heading, never a term inside a heading (`.stitle em` is upright by
design). Devanagari is Shobhika, self hosted from `slides/shared/fonts/`. Never load Devanagari from
Google Fonts, and do not substitute Tiro Devanagari.

**Colour.** Cream paper, dark brown ink, a softer brown for secondary text, and one gold accent for
whatever is being singled out: a milestone cell, a step number, the rule on a claim box. Pastels
(sage, pink, lemon, blush, lilac) are tints for figures, at low opacity, not for text. Cards are
translucent white on the cream. One accent per slide. No gradients, no drop shadows, no dark deck.

**Space.** The stage is 1920x1080 and content is generously inset: `.content` sits at 80px left and
right, 166px from the top, 250px when the title carries a `.sub`. Centre a slide's content on both
axes and let it breathe; a slide that reaches the edges is too full. Vertical rhythm comes from
`gap` on a flex column, 30px between tight things, 100px between blocks. Cap prose at about 1300px
wide so lines stay readable. If a slide needs more than roughly forty words, split it.

**Motion.** Two mechanisms only.

- `.reveal` fades an element in when the slide opens. Stagger with `style="--d:.15s"`.
- `data-frag="k"` fades an element in on the k-th click. Elements sharing a `k` appear together.

Both are plain opacity. Nothing slides in, scales, bounces or spins. A figure that grows over several
beats is built across consecutive slides, not animated inside one. Group fragments by idea: verse and
its play button on click 1, the reading of it on click 2. `data-gold="k"` turns an element gold from
step k, which is how a construction marks its milestones.

## Components

All of these come from `deck.base.css`, so a deck only writes markup.

```html
<!-- title slide -->
<section class="slide cover active" data-label="Cover">
  <aside class="notes">What you will say.</aside>
  <div class="cover-inner">
    <p class="kicker reveal" style="--d:.05s" data-edit>Conference name, spelled out, 2026</p>
    <h1 class="reveal" style="--d:.15s;margin-top:26px" data-edit>The <em>Title</em><br>of the Talk</h1>
    <div class="rule drawline" style="--d:.4s"></div>
    <p class="authors reveal" style="--d:.55s" data-edit>A. One <span class="amp">·</span> B. Two</p>
  </div>
</section>

<!-- content slide -->
<section class="slide" data-label="Short label">
  <aside class="notes">Speaker notes, shown in presenter view only.</aside>
  <div class="stitle" data-edit>Slide Title <span class="sub">optional second line</span></div>
  <div class="content wsub" style="display:flex;flex-direction:column;justify-content:center;align-items:center;gap:40px">
    ...
  </div>
</section>
```

`data-label` names the slide in presenter view. `data-edit` makes a run of text editable with `E`.
Drop `wsub` when the title has no `.sub`.

| need | markup |
| --- | --- |
| big statement | `<p class="bigsay">…</p>`, or `.bigsay-sm` |
| paragraph | `<p class="body">`, secondary `<p class="marker">` |
| three statistics | `.factrow` with `.num` and `.lab` |
| tag strip | `.fields` of `<span>label <i>term</i></span>` |
| two or three cards | `.paths` of `.path-card` with `.who` and `.body` |
| Sanskrit term | `.term-card` with `.deva`, `.iast`, `.gloss` |
| numbered contributions | `.contrib` of `.card` with `.n`, `h4`, `p` |
| dated timeline | `.arc` of `li` with `.when`, text, `.what`; add `.hero` to the key line |
| numbered steps | `.algo-steps` of `li` with `.n`, `.term`, explanation |
| running commentary beside a figure | `.buildlog` |
| this equals that | `.bridge` of two `.panel` joined by `.link` |
| the one claim | `.claimbox` with `.lead` and `.note` |
| pseudocode | `.pseudo` with `.kw` and `.cm` spans |
| verse with a recording | `.shloka` with `.deva`, `.iast`, `.playbtn` |
| live page embed | `<iframe class="demo-frame">` |
| corner QR or credit | `.corner-br` / `.credit` |

Anything specific to one talk (a grid, a custom figure, a bespoke animation) belongs in that deck's
`deck.css` and a small IIFE at the bottom of its `index.html`, not in the shared files.

## Per slide animation

A slide can drive its own animation from the fragment step:

```js
(function(){
  const slide=document.querySelector('[data-mything]'); if(!slide)return;
  function upd(step){ /* set classes or positions from step */ }
  slide.addEventListener('deckstep',e=>upd(e.detail.step));
  addEventListener('beforeprint',()=>upd(4));          // print the finished state
  const d=window.deck; upd(d&&d.slides[d.i]===slide?d.step:0);
})();
```

Give the slide a `data-*` hook, keep the IIFE at the bottom of `index.html` under a one line comment,
and always handle `beforeprint` so the PDF shows the end state.

## Assets

**Audio.** Put recordings in `slides/<talk>/audio/` and point a button at one:
`<button class="playbtn" data-audio="audio/verse.wav">▶&nbsp; play the verse</button>`. The engine
handles play, pause and switching. Credit the reciter once with `.credit` on the first such slide.

**Figures from a LaTeX paper.** `pdflatex`, `xelatex`, `dvisvgm` and `pdftocairo` are available.
Wrap the figure in a `standalone` document with `varwidth`, set the Devanagari font through
`fontspec` with `Path=…/slides/shared/fonts/`, colour it `\color[HTML]{2A241B}`, run `xelatex`, then
`pdftocairo -svg`. Save into `slides/<talk>/figures/` and place with `<img class="fig">`.

**QR codes.** `segno` is installed:

```python
segno.make("https://bhumikamittal.in/pataka-algo/").save(
    "figures/qr.svg", scale=10, border=2, dark="#2A241B", light=None)
```

Site domain is `bhumikamittal.in`.

## Working method

Follow the slide plan literally. When Bhumika gives a running order, build that order, with those
slides, at that level of detail. Do not restructure it into a narrative arc, do not hold the payoff
back for a reveal, do not merge or drop slides because they look thin. Her decks show the object
first and then take it apart. A slide she marked "blank for now" is a title and nothing else.

Check every visual change with a screenshot before saying it is done:

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu `
  --hide-scrollbars --virtual-time-budget=4000 --window-size=1920,1080 `
  "--screenshot=<scratchpad>\s4.png" `
  "file:///C:/Users/Bhumika/OneDrive/Desktop/bhumikamittal7.github.io/slides/<talk>/index.html#4"
```

Then read the PNG. Use `#n.k` to check a slide mid build. Look for text colliding with the title,
content drifting off centre, a figure past the edge, a line of prose too wide.

She iterates on look and feel a lot, so expect several rounds on spacing and weight. Change what was
asked for and leave the rest alone.

## Do not

- Do not add a running header or repeated eyebrow on content slides. The `.stitle` is the header.
- Do not italicise slide titles or terms inside them.
- Do not introduce a second accent colour, a gradient, or a shadow.
- Do not animate with translate, scale or stagger inside a single slide beyond the opening `.reveal`.
- Do not copy `deck.js` or the base stylesheet into a deck folder, and do not reintroduce reveal.js.
- Do not pre-populate slides she has not asked for yet.
