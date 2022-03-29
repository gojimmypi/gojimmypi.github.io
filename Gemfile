# frozen_string_literal: true

source "https://rubygems.org"

# git_source(:github) {|repo_name| "https://github.com/#{repo_name}" }

# gem "rails"

gem 'github-pages'

# CVE-2021-28834 see https://github.com/advisories/GHSA-52p9-v744-mwjj
gem "kramdown", "~> 2.3", ">= 2.3.1"

# CVE-2021-28965 see https://github.com/advisories/GHSA-8cr8-4vfw-mr7h

gem "rexml", ">= 3.2.5"

# https://github.com/github/cmark-gfm/security/advisories/GHSA-mc3g-88wq-6f4x
# gem "commonmarker", ">= 0.23.4"
#
# but disabled as otherwise seeing this error locally:
# Bundler could not find compatible versions for gem "commonmarker":
#  In Gemfile:
#    commonmarker (>= 0.23.4)
#
#    github-pages was resolved to 214, which depends on
#      jekyll-commonmark-ghpages (= 0.1.6) was resolved to 0.1.6, which depends on
#        commonmarker (~> 0.17.6)

group :jekyll_plugins do
  gem 'jekyll-archives'
#  gem 'jekyll-paginate'
end
# gem "jekyll", "~> 3.9"
