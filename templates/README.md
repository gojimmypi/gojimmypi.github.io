# Templates

## archive-year-index.html.in

Used to generate archive template directories. See [/archive](../archive/README.md)

## _config_dev.yml.in

Use for `_config_dev.yml` in local config overrides. See `bundle exec` in [/scripts/_build-development.sh](../scripts/_build-development.sh). Excluded from GitHub in `.gitignore`.

```bash
bundle exec jekyll serve --config _config.yml,_config_dev.yml --profile --incremental --drafts
```