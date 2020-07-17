#!/usr/bin/env bash

git submodule update --init --recursive
yarn
npm install -g lerna
cd lib/js-ceramic && npm run bootstrap && npm run build
cd packages/ceramic-core && yarn link
cd ../../../.. && yarn link @ceramicnetwork/ceramic-core
cd lib/did-jwt-vc && yarn && yarn link
cd ../.. && yarn link did-jwt-vc
