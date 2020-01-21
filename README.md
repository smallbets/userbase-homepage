# Userbase Homepage

This is what generates the [userbase.com](https://userbase.com) homepage. If you're looking for the open source version of Userbase, you can find that at [encrypted-dev/userbase](https://github.com/encrypted-dev/userbase).

If you want to create a product website like it was 1997, feel free to fork this repo and reuse anything you want for your site (except the name and the logo).

### Structure

* [/src/template.html](src/template.html) contains the common HTML wrapper around every page.
* [/src/pages](src/pages) contains the HTML body for each page of the site.
* [/src/partials](src/partials) contains common HTML fragments shared by multiple pages.
* [/src/style.css](src/style.css) holds all the CSS for the site, using [Tailwind CSS](https://tailwindcss.com).
* [/src/index.js](src/index.js) holds all the JS for the site, which can be written in ES6.

### Development

```
# clone this repo
git clone https://github.com/encrypted-dev/userbase-homepage.git

# go to the repo directory
cd userbase-homepage

# install all dependencies
npm install

# start the website on http://localhost:3000 with hot module reloading
npm start
```

### Production

```
# install all dependencies using the versions in package-lock.json
npm ci

# generate the build artifacts in the dist directory
npm run build
```

### Deployment

You can 1-click deploy this to the internet using [Netlify](https://www.netlify.com):

<!-- Markdown snippet -->
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/encrypted-dev/homepage)

## License

This project is released under the [MIT License](LICENSE).
