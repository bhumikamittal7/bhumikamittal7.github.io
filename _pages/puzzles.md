---
layout: page
permalink: /puzzles-and-more/
title: Puzzles & More
description:
nav: true
nav_order: 3
---

<p>
A few games, puzzles, and side projects I have built for fun. Most run in the browser,
so click any of them to play.
</p>

<h2 class="puzzles-heading">Puzzles</h2>
<div class="puzzles-grid">

  <a class="puzzle-card" href="https://gaple.vercel.app" target="_blank" rel="noopener">
    <span class="puzzle-icon">🟩</span>
    <span class="puzzle-name">Gaple</span>
    <span class="puzzle-desc">A daily word game. Guess the five-letter word in ten tries.</span>
    <span class="puzzle-host">gaple.vercel.app ↗</span>
  </a>

  <a class="puzzle-card" href="https://hues-and-clues.vercel.app" target="_blank" rel="noopener">
    <span class="puzzle-icon">🎨</span>
    <span class="puzzle-name">Hues &amp; Cues</span>
    <span class="puzzle-desc">A daily colour guessing game, played from a one-word cue.</span>
    <span class="puzzle-host">hues-and-clues.vercel.app ↗</span>
  </a>

  <a class="puzzle-card" href="https://cracksat.vercel.app/" target="_blank" rel="noopener">
    <span class="puzzle-icon">🔡</span>
    <span class="puzzle-name">CrackSAT</span>
    <span class="puzzle-desc">A word puzzle where you crack the answer from four clue words.</span>
    <span class="puzzle-host">cracksat.vercel.app ↗</span>
  </a>

  <a class="puzzle-card" href="https://placemate-game.vercel.app/" target="_blank" rel="noopener">
    <span class="puzzle-icon">🗓️</span>
    <span class="puzzle-name">Placemate</span>
    <span class="puzzle-desc">Drag the cards onto a timeline and sort them into the right order.</span>
    <span class="puzzle-host">placemate-game.vercel.app ↗</span>
  </a>

</div>

<h2 class="puzzles-heading">&amp; More</h2>
<div class="puzzles-grid">

  <a class="puzzle-card" href="/pataka-algo/" target="_blank" rel="noopener">
    <span class="puzzle-icon">🚩</span>
    <span class="puzzle-name">Patākā Construction</span>
    <span class="puzzle-desc">An interactive construction of the patākā from Nārāyaṇa Paṇḍita's Gaṇitakaumudī.</span>
    <span class="puzzle-host">bhumikamittal.in/pataka-algo ↗</span>
  </a>

  <a class="puzzle-card" href="https://projectbrahmagupta.github.io/" target="_blank" rel="noopener">
    <span class="puzzle-icon">➗</span>
    <span class="puzzle-name">Project Brahmagupta</span>
    <span class="puzzle-desc">An archive of problems in mathematics and computation, inspired by Indian mathematicians. Made with Aalok Thakkar.</span>
    <span class="puzzle-host">projectbrahmagupta.github.io ↗</span>
  </a>

  <a class="puzzle-card" href="https://univeda.netlify.app/" target="_blank" rel="noopener">
    <span class="puzzle-icon">🪙</span>
    <span class="puzzle-name">UniVeda</span>
    <span class="puzzle-desc">A blockchain gaming platform where you play and win ASH tokens.</span>
    <span class="puzzle-host">univeda.netlify.app ↗</span>
  </a>

</div>

<style>
.puzzles-heading {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: var(--text-tertiary);
    margin: 32px 0 4px;
}

.puzzles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 14px;
    margin-top: 14px;
}

.puzzle-card {
    display: flex;
    flex-direction: column;
    padding: 18px 18px 16px;
    border: 1px solid var(--border-color) !important;
    border-radius: 10px;
    background-color: var(--bg-light);
    text-decoration: none !important;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}

.puzzle-card:hover {
    transform: translateY(-2px);
    border-color: var(--accent-gold) !important;
    box-shadow: 0 6px 16px var(--shadow-hover);
}

.puzzle-icon {
    font-size: 22px;
    line-height: 1;
    margin-bottom: 10px;
}

.puzzle-name {
    display: block;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color);
}

.puzzle-desc {
    display: block;
    margin-top: 5px;
    font-size: 14px;
    line-height: 1.5;
    color: var(--text-secondary);
    flex-grow: 1;
}

.puzzle-host {
    margin-top: 14px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.01em;
    color: var(--accent-gold);
}

@media (max-width: 600px) {
    .puzzles-grid {
        grid-template-columns: 1fr;
    }
}
</style>
