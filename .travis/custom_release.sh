#!/bin/bash
set -e
set -x

if [[ "${TRAVIS_BRANCH}" = "master" || "${TRAVIS_BRANCH}" = "main" ]]
then
    for env in ci qa
    do
        echo "PUSHING ${env}-beta"
        rm -rf ./dist/.git
        .travis/release.sh "${env}-beta"
    done

elif [[ "${TRAVIS_BRANCH}" = "master-stable" || "${TRAVIS_BRANCH}" = "main-stable" ]]
then
    for env in ci qa
    do
        echo "PUSHING ${env}-stable"
        rm -rf ./dist/.git
        .travis/release.sh "${env}-stable"
    done

elif [[ "${TRAVIS_BRANCH}" = "prod-beta" || "${TRAVIS_BRANCH}" = "prod-stable" || "${TRAVIS_BRANCH}" = "qa-stable" || "${TRAVIS_BRANCH}" = "qa-beta" || "${TRAVIS_BRANCH}" = "ci-stable" || "${TRAVIS_BRANCH}" = "stage-stable" || "${TRAVIS_BRANCH}" = "stage-beta" ]]; then
    echo "PUSHING ${TRAVIS_BRANCH}"
    rm -rf ./build/.git
    .travis/release.sh "${TRAVIS_BRANCH}"
fi
