.DEFAULT_GOAL := verify

.PHONY: install start ios android web typecheck test verify expo-check quality

install:
	npm ci

start:
	npm start

ios:
	npm run ios

android:
	npm run android

web:
	npm run web

typecheck:
	npm run typecheck

test:
	npm test

verify:
	npm run verify

expo-check:
	npx expo install --check

quality: verify expo-check
