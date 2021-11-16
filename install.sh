#!/usr/bin/env bash
# hack to install the latest webpack as requested by the dynamic-plugin-sdk package.json
# without this script, the wrong webpack version is installed

set -e

rm -rf node_modules/
npm install

pushd src/poc-code/console-dynamic-plugin-sdk
rm -rf node_modules/
npm install

# We don't need the lockfile
rm package-lock.json
popd
