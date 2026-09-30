# SYDE 671 project site

A Jekyll site for GitHub Pages. Each assignment is one Markdown file.

## Add a new assignment

1. Copy `_assignments/a1.md` to `_assignments/a2.md` and set `title`, `subtitle` and `order`.
2. Put its images in `assets/a2/`.
3. Commit and push. It appears on the home page automatically.

## Writing helpers

```liquid
{% include figure.html src="/assets/a1/result.jpg" caption="Caption text" %}
```

Several images in one figure, with an optional label under each and one shared caption:

```liquid
{% include figure-row.html srcs="/assets/a1/b.jpg, /assets/a1/g.jpg, /assets/a1/r.jpg" labels="Blue, Green, Red" caption="The three channels after cropping." %}
```

```html
<div class="grid">
  {% include figure.html src="/assets/a1/before.jpg" caption="Before" %}
  {% include figure.html src="/assets/a1/after.jpg" caption="After" %}
</div>

<div class="callout" markdown="1">
**The trick:** explanation in Markdown.
</div>
```

Math uses `$...$` and `$$...$$` when the post has `math: true` in its front matter.

## Publish

1. Push this repo to GitHub.
2. In the repo, go to Settings, then Pages, and set the source to the `main` branch, root folder.
3. The site appears at `https://<username>.github.io/<repo-name>/`.

If the repo name isn't `syde-671-f26`, change `baseurl` in `_config.yml` to match.

## Preview locally (optional)

Needs Homebrew Ruby (`brew install ruby`), not the macOS system Ruby. The Gemfile uses Jekyll 4 for previews because GitHub's Jekyll 3.9 doesn't run on modern Ruby.

```sh
bundle install
bundle exec jekyll serve --livereload
```

Then open http://localhost:4000/syde-671-f26/
