---
layout: default
---

# SYDE 671 Projects

Write-ups of my assignments for SYDE 671.

<ul class="cards">
{% assign items = site.assignments | sort: "order" %}
{% for a in items %}
  <li>
    <a href="{{ a.url | relative_url }}">
      <span class="title">{{ a.title }}</span>
      {% if a.subtitle %}<span class="desc">{{ a.subtitle }}</span>{% endif %}
    </a>
  </li>
{% endfor %}
</ul>
