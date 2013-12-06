# Angular stepper directive

A simple numeric stepper.

Demo : http://jsfiddle.net/26ghx/embedded/result/

Making of : http://blog.revolunet.com/blog/2013/11/28/create-resusable-angularjs-input-component/

## Usage

add a dependency to your app :
```javascript
angular.module('MyApp', [
    'revolunet.stepper'
]);
```
use the directive :
```html
<div rn-stepper ng-model="product.quantity" min="config.min" max="config.max"></div>
```

## Licence
Licensed under the permissive MIT license

