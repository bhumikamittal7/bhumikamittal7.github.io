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

My current research focuses on lattice-based post-quantum cryptographic schemes, exploring improvements in bandwidth and optimizations for practical deployment. I am also interested in theoretical aspects, particularly the provable security of these schemes and the hardness of lattice problems, to ensure robust protection against future quantum threats.

In the past, I have been involved in research projects on topics such as discrete mathematics and computer architecture and systems.

<!-- _pages/publications.md -->
<div class="publications">

{%- for y in page.type %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[metatype={{y}}]* %}
{% endfor %}

</div>

