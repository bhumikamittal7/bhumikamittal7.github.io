# Bhumika Mittal's Academic Website

A minimalist academic website built with Jekyll, inspired by clean and modern design principles.

## Quick Start

1. Install Jekyll and Bundler:
```bash
gem install jekyll bundler
```

2. Clone and serve locally:
```bash
git clone https://github.com/bhumikamittal7/bhumikamittal7.github.io
cd bhumikamittal7.github.io
bundle install
bundle exec jekyll serve
```

3. View at `http://localhost:4000`

## Customization

### Basic Configuration
Edit `_config.yml` to update:
- Site title, name, and description
- Your social media handles (GitHub, Twitter, Google Scholar)
- Email address
- Other site-wide settings

### Content Structure
- `_pages/`: Main pages (about, publications, teaching, etc.)
- `_news/`: News items (format: announcement_X.md)
- `_bibliography/`: BibTeX bibliography file (`papers.bib`)
- `assets/`: Images, CSS, and JavaScript files
  - `assets/img/`: Profile picture and publication preview images
  - `assets/pdf/`: PDF files (CV, papers, etc.)
  - `assets/css/main.css`: Main stylesheet
  - `assets/js/`: JavaScript files
    - `dark-mode.js`: Dark mode functionality
    - `copy-bibtex.js`: Copy BibTeX to clipboard
    - `publications.js`: Publication abstract/bibtex toggle
    - `research.js`: Research page tab functionality

### Adding Publications
Add entries to `_bibliography/papers.bib` in BibTeX format. Mark publications as selected by adding `selected={true}` in the BibTeX entry.

Example:
```bibtex
@article{example2024,
  title={Example Paper},
  author={Mittal, Bhumika and Others},
  journal={Example Journal},
  year={2024},
  selected={true},
  pdf={example.pdf},
  preview={example.png}
}
```

### Adding News
Create new files in `_news/` directory with format `announcement_X.md`:

```markdown
---
layout: post
date: 2024-01-15
inline: true
related_posts: false
---

Your news content here.
```

## Deployment

This site is configured for GitHub Pages. Simply push changes to the `master` branch and GitHub Pages will automatically build and deploy the site.

For manual deployment:
```bash
bundle exec jekyll build
```

The built site will be in the `_site/` directory.

## Design Inspiration

This website design is inspired by:
- [Soham De](https://sohamde.in)

## License

This website is licensed under the MIT License. Feel free to use and modify as needed.

## Acknowledgments

Built with [Jekyll](https://jekyllrb.com/) and styled with a minimalist approach. Uses [jekyll-scholar](https://github.com/inukshuk/jekyll-scholar) for bibliography management.
