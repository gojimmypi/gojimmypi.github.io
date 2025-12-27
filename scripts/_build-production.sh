#!/usr/bin/env bash
cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

./gen_year_archives.sh

python3 -mwebbrowser http://127.0.0.1:4000/
JEKYLL_ENV=production bundle exec jekyll serve --profile --drafts --incremental
