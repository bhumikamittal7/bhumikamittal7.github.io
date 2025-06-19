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

My research interests lie broadly in theoretical computer science, with a primary focus on foundational cryptography—both classical and quantum. In particular, I am interested in the theory of cryptographic constructions and assumptions, with an emphasis on lattice-based cryptography. My current interests also include complexity theory, formal logic, and automata theory.

In the past, I have worked on projects related to discrete mathematics and computer architecture and systems.

<!-- _pages/publications.md -->
<div class="publications">

{%- for y in page.type %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[metatype={{y}}]* %}
{% endfor %}

</div>

