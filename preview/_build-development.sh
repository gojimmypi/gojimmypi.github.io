#!/usr/bin/env bash
cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
python -mwebbrowser http://127.0.0.1:4000/gridster-jekyll-theme/
bundle exec jekyll serve --profile --incremental --drafts