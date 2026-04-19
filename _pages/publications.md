---
layout: page
permalink: /research/
title: Research
description: 
years: [2025, 2024, 2023, 2020]
nav: true
nav_order: 1
---

My research interests lie in cryptography, programming languages, and formal verification. In particular, my current work focuses on program analysis for finite field computations. 

Recently, I have also been exploring questions in the history of mathematics. In the past, I have worked on problems in discrete mathematics and computer architecture and systems.

### Publications

Most recent publications on [Google Scholar](https://scholar.google.com/citations?user={{ site.scholar_userid }}).

<div class="tab-container">
    <button class="tab-button active" data-tab="all">All</button>
    <button class="tab-button" data-tab="published">Published</button>
    <button class="tab-button" data-tab="thesis">Thesis</button>
    <button class="tab-button" data-tab="exposition">Exposition</button>
</div>

<div class="publications">
{%- comment -%} All publications {%- endcomment -%}
<div id="all" class="tab-content active">
    {% bibliography -f papers -q @* %}
</div>

{%- comment -%} Published papers {%- endcomment -%}
<div id="published" class="tab-content">
    {% bibliography -f papers -q @*[metatype=published]* %}
</div>

{%- comment -%} Thesis {%- endcomment -%}
<div id="thesis" class="tab-content">
    {% bibliography -f papers -q @*[metatype=thesis]* %}
</div>

{%- comment -%} Exposition {%- endcomment -%}
<div id="exposition" class="tab-content">
    {% bibliography -f papers -q @*[metatype=exposition]* %}
</div>
</div>
