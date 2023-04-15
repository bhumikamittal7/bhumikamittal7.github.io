---
layout: page
permalink: /research/
title: research
description: List of published and ongoing studies (* indicates equal contributions)
years: [2023]
type: [published]
nav: true
display_categories: [themes]
nav_order: 1
---
<!-- _pages/publications.md -->
<div class="publications">

{%- for y in page.type %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[metatype={{y}}]* %}
{% endfor %}

</div>