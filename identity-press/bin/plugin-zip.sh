#!/usr/bin/env sh

PLUGIN_NAME='identitypress'
PROJECT_PATH=$(pwd)
BUILD_PATH="${PROJECT_PATH}/assets"
DEST_PATH="$BUILD_PATH/$PLUGIN_NAME"


# +---------------------------+
# |                           |
# |    Generating ZIP file    |
# |                           |
# +---------------------------+

echo "Generating build directory..."
rm -rf "$BUILD_PATH"
mkdir -p "$DEST_PATH"


if [ -f "$PROJECT_PATH/package.json" ]; then
    echo "Installing Node.js dependencies and running 'npm run build'..."
    npm install --prefix "$PROJECT_PATH" || exit "$?"
    npm run build --prefix "$PROJECT_PATH" || exit "$?"
fi

if [ -f "$PROJECT_PATH/composer.json" ]; then
	echo "Installing PHP dependencies..."
	composer install -d "$PROJECT_PATH" --no-dev --optimize-autoloader || exit "$?"
fi

echo "Syncing files..."
if [ -f "$PROJECT_PATH/.distignore" ]; then
    rsync --recursive --checksum --include="$PROJECT_PATH/.env" --exclude-from="$PROJECT_PATH/.distignore" "$PROJECT_PATH/" "$DEST_PATH/" --delete --delete-excluded
else
    rsync --recursive --checksum --include="$PROJECT_PATH/.env" "$PROJECT_PATH/" "$DEST_PATH/" --delete
fi

echo "Generating zip file..."

cd "$BUILD_PATH" || exit
zip --quiet --recurse-paths "${PLUGIN_NAME}.zip" "$PLUGIN_NAME/"

cd "$PROJECT_PATH" || exit
echo "Moving zip to $(dirname "$PROJECT_PATH")"
mv "$BUILD_PATH/${PLUGIN_NAME}.zip" "$(dirname "$PROJECT_PATH")"
echo "${PLUGIN_NAME}.zip file generated!"

echo "Cleaning up..."
rm -r "${BUILD_PATH}"

printf "Build done!\n"
