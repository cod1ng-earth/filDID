#!/usr/bin/env bash
git submodule update --init --recursive

#npm install -g lerna
cd lib/identity-wallet-js && npm install && npx tsc -p .
yarn link
cd ../..
yarn link identity-wallet
