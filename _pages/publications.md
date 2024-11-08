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

I am currently interested in cryptography and computational complexity. In particular, I am working on the fine-grained complexity of lattice problems and pre-image samplable trapdoor functions. I am also interested in quantum cryptography and quantum computing. My goal is to understand and address fundamental challenges in cryptography using tools from theoretical computer science and mathematics.

In the past, I have worked on projects related to discrete mathematics and computer architecture and systems.

<!-- _pages/publications.md -->
<div class="publications">

{%- for y in page.type %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[metatype={{y}}]* %}
{% endfor %}

</div>

