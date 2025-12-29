#!/usr/bin/env bash


# Optional update:
#   bundle update github-pages
#   bundle install
#   bundle exec github-pages versions


reset

cd ../
echo "Starting from $(pwd)"

echo "$1"

echo "Version 1.01"

./scripts/gen_year_archives.sh

./scripts/find_missing_description.sh _posts

./scripts/check_no_underscores.sh _posts


echo "Confirming none of the post names conflicts with repo name"
if comm -12 \
    <(curl -fsSL "https://api.github.com/users/gojimmypi/repos?per_page=100" \
        | python3 -c 'import sys,json; print("\n".join(r["name"] for r in json.load(sys.stdin)))' \
        | sort -u) \
    <(find ./_site -mindepth 1 -maxdepth 1 -type d -printf "%f\n" | sort -u)
then
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    echo "Warning: Post slug collides with GitHub repo name"
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
fi


# for GH Pages / GitHub Pages and Jekyll install, see:
# https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll
if command -v bundle &> /dev/null ; then
    echo "Confirmed bundler is installed"
else
    echo "ERROR: It appears bundler is not installed." >&2
    echo "see https://jekyllrb.com/docs/installation/ubuntu/"
    exit 1
fi

bundle exec jekyll --help &> /dev/null
if [ $? -eq 0 ]; then
    echo "Confirmed jekyll bundle is installed"
else
    bundle exec jekyll --help
    echo 'Error: bundle exec jekyll is not installed or returned an error.' >&2
    echo "see https://jekyllrb.com/docs/installation/ubuntu/"
    exit 1
fi

if command -v sass &> /dev/null ; then
    echo "Confirmed sass is installed"
else
    echo ""
    echo "WARNING: It appears sass is not installed. See https://sass-lang.com/install"
    echo ""
fi

if command -v grunt &> /dev/null ; then
    echo "Confirmed appears is installed"
else
    echo ""
    echo "WARNING: It appears grunt is not installed. File transformations in gruntfile.js will NOT occur."
    echo ""
fi

bundle check

# cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# get the base url from the _config.yml file  (note we want the explicit line starting with baseurl: as there are now other settings that contian the same text! )
baseurl_line=$(grep -R "^baseurl:" "_config.yml" | tail -n1)

echo "Found baseurl configuration line in _config.yml file:"
echo $baseurl_line

# get only the second parameter, not the keyword, and not any comments
baseurl=$(echo "$baseurl_line" | awk '{ print $2 }' )

# remove all slashes; we'll add our own later.  note multiple subdirectory depth not supported
baseurl=$(echo "$baseurl" | tr -d / )

# remove all double quotes
baseurl=$(echo "$baseurl" | tr -d '"' )

echo "Using a value of baseurl=$baseurl"

SITE_DIR="$(pwd)/_site/"
TAG_DIR="$(pwd)/tag/"

if [ "$1" == "" ]; then
  echo ""
  echo "To skip prompt, add to commandline: --assume-yes"
  echo ""
fi

# Optional prompt to delete files in _site directory (yes, I've seen cached files get seemingly stuck there!')
if [ "$1" == "--assume-yes" ]; then
  # we have a chicken-and-egg problem with the tag directory: it needs to get copied FROM the _site directory, AFTER generation, but it gets copied before - so we need to wipe it out
  echo "Removing files in  $TAG_DIR ..."
  rm -Rf $TAG_DIR

  echo "Removing files in  $SITE_DIR ..."
  rm -Rf $SITE_DIR
else
  read -p "Delete files in $SITE_DIR? (Y/N): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] &&  if [ -d "$SITE_DIR" ]; then rm -Rf $SITE_DIR;  rm -Rf $TAG_DIR;  fi
fi

echo ""
mkdir -p $TAG_DIR
echo "---"                                         >  $TAG_DIR/README.md
echo "sitemap: false"                              >> $TAG_DIR/README.md
echo "last_modified_at: 2025-12-25T09:42:02-08:00" >> $TAG_DIR/README.md
echo "---"                                         >> $TAG_DIR/README.md
echo "WARNING: this is an auto-generated directory to create tag files. See _build-development.sh" >> $TAG_DIR/README.md

if [ "$1" == "--assume-yes" ]; then
    echo "Skipping browser launch for $1"
    echo ""
    echo "View web page at: http://127.0.0.1:4000/$baseurl/"
    echo ""
else
    echo "launching browser for baseurl=$baseurl found in_config.yml"
    if [ "$baseurl" == "" ]; then
        python3 -mwebbrowser http://127.0.0.1:4000/
    else
        python3 -mwebbrowser http://127.0.0.1:4000/$baseurl/
    fi
fi

echo "bundle exec jekyll clean"
bundle exec jekyll clean

# we'll gnerate a full website without serving it up to allow for a manual copy of site tag files
echo "[optional] bundle exec jekyll build --trace"
bundle exec jekyll build --trace

echo ""
echo "Fix for tag pages: manually copy from _site/tag/* to ./tag/  (using previously generated files!)"

echo "Copy in $(pwd) using command: cp --recursive ./_site/tag/* ./tag"
mkdir -p ./tag
cp --recursive ./_site/tag/* ./tag
echo "Copy complete."
echo ""

TAG_DIR="./tag"
README="./tag/README.md"

if [ ! -d "$TAG_DIR" ]; then
    echo "ERROR: directory '$TAG_DIR' not found" >&2
    exit 1
fi

if [ ! -f "$README" ]; then
    echo "ERROR: file '$README' not found" >&2
    exit 1
fi

echo "Here we go! TAG_DIR=$TAG_DIR, "
{
    echo
    echo "## Tags"
    echo

    for d in "$TAG_DIR"/*/; do
        [ -d "$d" ] || continue

        tag_name=$(basename "$d")

        # Jekyll-friendly relative link
        echo "- [${tag_name}](${TAG_DIR}/${tag_name}/)"
    done
} >> "$README"



echo "Ensure all tag files use LF line endings"
dos2unix tag/**/*.html > /dev/null 2>&1

echo "running: bundle exec jekyll serve --profile --incremental --drafts"
bundle exec jekyll serve --profile --incremental --drafts
