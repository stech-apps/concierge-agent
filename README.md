# Concierge

This is an Angular 7 application. Read more about Angular here: `https://angular.io/docs`

This project uses ngrx/store to keep the application state. Read more here:
`https://github.com/ngrx/platform`

Or view this helpful tutorial to get some insight to working with ngrx and also understanding this application:
`https://www.youtube.com/watch?v=N_UQx8dPPkc&list=PLW2eQOsUPlWJRfWGOi9gZdc3rE4Fke0Wv&index=1`

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.3.


## Getting Started

These instructions will help you get started running this project on your local machine for,
1. Development
    1. Orchestra Installed on your local machine
    2. Orchestra Installed on a remote machine
2. Creating the Development Build
3. Creating the Production Build

## Prerequisites

Make sure you have installed 
1. Node 10 or above. `https://nodejs.org/`

## Development

1. Clone the project
2. Make sure to switch to "v4.0.0" branch which is the current release branch and the most stable.
3. Run the following command to install all dependencies

```
npm install
```

## Development server

If you have orchestra installed locally running on port 8080 run ```npm start``` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. 
If you are working towards a remote orchestra you have to reconfigure the proxy config. You can use your own proxy.config.json like in the case of the script "startlocal" (package.json -> scripts). Create your own proxy.config.json using the proxy.config.json as a template and replace the targets.
You can find available npm commands in package.json under "scripts".
Use them by running ```npm run <your-command>```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Development Build

Run `npm run build-war-dev` to build the project. The build artifacts will be stored in the `dist/` directory.

* Copy the war package from **dist\webapp** to **orchestra\system\custdeploy** in your system
* Then copy the translation entries file from **dist\webapp** to **orchestra\system\conf\lang** in your system

## Production Build (Create war file)

Run `npm run build-artifactory` to build the project. The build artifacts will be stored in the `dist/` directory.

The build number is taken from `src/app.json`

## Concierge
Components are located in **src/app/components**
The store is located in **src/store**
All the UI labels and language translation entries can be found in  **src/assets/i18n/** folder

The application routes can be found in: **src/routes/app-routes.ts**

Release notes are located in **/release-notes**
## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Dependencies 
* [Angular 7](https://angular.io/) - As a single page application (SPA) framework.
* [Angular Moment](https://www.npmjs.com/package/angular2-moment) - For date, time formatting and calculations etc.
* [Ngrx](https://github.com/ngrx) - Reactive Extensions for Angular which used to communicate between components etc. reactively.
* [Ngrx Effects](https://github.com/ngrx/effects) - When using redux store this library is used for redux side effects management.
* [Angular Translate](https://github.com/ngx-translate/core) - Used as the internationalization (i18n) library for Concierge.
* [Angular Translate Loader](https://www.npmjs.com/package/@ngx-translate/http-loader) - Used as the http loader for Angular translate files.
* [Angular Bootstrap](https://ng-bootstrap.github.io/#/getting-started) - Used for several UI components such as modals, tooltips etc.
* [Bootstrap](https://getbootstrap.com/) - Angular bootstrap and servera UI elements depends on bootstrap 
* [CometD](https://cometd.org/) - Used for react upon on Orchestra events
* [Angular Moment](https://www.npmjs.com/package/angular2-moment) - For date, time formatting and calculations etc.
* [Angular Moment Timezone](https://www.npmjs.com/package/angular-moment-timezone) - Used in Concierge for time zone related date/time adjustments.
* [Ng Select](https://www.npmjs.com/package/@ng-select/ng-select) - Used for select lists in the application such as UI Select, Multiselect and Autocomplete 
* [Animate CSS](https://daneden.github.io/animate.css/) - Concierge animations are primarily done using AnimateCSS
* [Compressible](https://www.npmjs.com/package/compressible) - Internally used by Angular
* [CoreJS](https://www.npmjs.com/package/core-js) - Used for Polyfill support
* [Hammerjs](https://hammerjs.github.io/) - Touch functionality in the application
* [Css-vars-ponyfill](https://www.npmjs.com/package/css-vars-ponyfill) - CSS variable support for older browsers,
* [Jquery](https://www.npmjs.com/package/css-vars-ponyfill) - Occationaly required for some of the essential DOM manipulation tasks
* [Ngx Toastr](https://www.npmjs.com/package/ngx-toastr)- Toasts functionality in the application 
* [UnderscoreJS](http://underscorejs.org/) - Used in Concierge for object collection manipulations such as filtering, advanced sorting etc.
* [Zone.js](https://github.com/angular/zone.js/) - Internally used by Angular
* [WebAnimationsJs](https://www.npmjs.com/package/web-animations-js) - Used by Angular as a polyfill 
* [RxJs](https://angular.io/guide/rx-library) - Reactive extentions library used in Angular and Concierge. 
* [On-headers](https://www.npmjs.com/package/on-headers) - Used by Angular

## License

### Apache Font License
Copyright 2019 Qmatic

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
