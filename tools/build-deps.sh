#!/usr/bin/env bash

git submodule update --init --recursive
yarn
npm install -g lerna
cd lib/js-ceramic && npm run bootstrap && npm run build
cd packages/ceramic-core && yarn link
cd ../ceramic-doctype-verifiable-credential && yarn link
cd ../ceramic-doctype-three-id && yarn link
cd ../../../..
cd lib/did-jwt-vc && yarn && yarn link
cd ../..
yarn link did-jwt-vc
yarn link @ceramicnetwork/ceramic-core
yarn link @ceramicnetwork/ceramic-doctype-verifiable-credential
yarn link @ceramicnetwork/ceramic-doctype-three-id
