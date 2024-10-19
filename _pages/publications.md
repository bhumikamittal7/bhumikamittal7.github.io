---
layout: page
permalink: /research/
title: research
description: 
years: [2020, 2023, 2024]
type: [published, in review, exposition]
nav: true
display_categories: [themes]
nav_order: 1
---

I am currently interested in cryptography and computational complexity. My goal is to understand and address fundamental issues in cryptography using tools from theoretical computer science and mathematics.

In the past, I have worked on projects related to discrete mathematics and computer architecture and systems.

<!-- _pages/publications.md -->
<div class="publications">

{%- for y in page.type %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[metatype={{y}}]* %}
{% endfor %}

</div>

