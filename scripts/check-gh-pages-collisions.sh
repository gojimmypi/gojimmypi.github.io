if comm -12 \
    <(curl -fsSL "https://api.github.com/users/gojimmypi/repos?per_page=100" \
        | python3 -c 'import sys,json; print("\n".join(r["name"] for r in json.load(sys.stdin)))' \
        | sort -u) \
    <(ls _posts \
        | sed -E 's/^[0-9]{4}-[0-9]{2}-[0-9]{2}-//' \
        | sed -E 's/\.(md|markdown|html)$//' \
        | sort -u) \
    | grep -q .
then
    echo "ERROR: Post slug collides with GitHub repo name"
    exit 1
fi

# No collision, script continues here
echo "OK: no collisions found"
