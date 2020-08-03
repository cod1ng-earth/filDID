#!/usr/bin/env bash
git submodule update --init --recursive

npm install -g lerna
cd lib/js-ceramic && npm run bootstrap && npm run build
cd packages/ceramic-core && yarn link
cd ../ceramic-doctype-three-id && yarn link
cd ../ceramic-doctype-tile && yarn link
cd ../../../..
cd lib/identity-wallet-js && npm install && npx tsc -p . && yarn link
cd ../..

yarn link @ceramicnetwork/ceramic-core
yarn link @ceramicnetwork/ceramic-doctype-three-id
yarn link @ceramicnetwork/ceramic-doctype-tile
yarn link identity-wallet
