---
layout: page
permalink: /research/
title: research
description: 
years: [2020, 2023, 2024]
type: [published, exposition]
nav: true
display_categories: [themes]
nav_order: 1
---

My current research interests are broadly within theoretical computer science, and span several topics including foundational cryptography (both classical and quantum), complexity theory, formal logic, and automata theory. In particular, I am currently working on ring pre-image samplable trapdoor functions.

In the past, I have worked on projects related to discrete mathematics and computer architecture and systems.

<!-- _pages/publications.md -->
<div class="publications">

{%- for y in page.type %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[metatype={{y}}]* %}
{% endfor %}

</div>

