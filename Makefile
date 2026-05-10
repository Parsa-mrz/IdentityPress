dev:
	cd identity-press && npm run watch 
build:
	cd identity-press && npm run build 
pot:
	cd identity-press && php -d memory_limit=512M /usr/local/bin/wp i18n make-pot . languages/identity-press.pot --slug=identity-press --include=app/Frontend/build,app/Backend
mo:
	cd identity-press && php -d memory_limit=512M /usr/local/bin/wp i18n make-mo languages/identity-press-fa_IR.po languages
wp:
	docker-compose up -d
	make build
zip:
	cd identity-press && ./bin/plugin-zip.sh