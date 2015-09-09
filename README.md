ngPercent is a directive based on ngCurrency that allows for seamless input of percentage values.

Main features:

* Similar API to [ng-currency](https://github.com/aguirrel/ng-currency)
* The model is consistent as it values is a float (even if there are alpha characters in the middle) or NaN in the empty case.
* Input value is always filtered with percent on load and on blur.
* Min and Max validators like input[number].
* Enable/disable formatter using ng-percent={{var}}

## Example

You can see this directive in action on [Plunker](http://plnkr.co/edit/zTEmRX5PtFhwyA93y8bY?p=preview)


## Bower

You may install it via bower using

`bower install ng-percent`

The plugin requires the [ng-percentage-filter](https://github.com/timhettler/ng-percentage-filter) directive, which is automatically added.

## Quick start

+ Include the required libraries:

>
``` html
<script src="https://code.angularjs.org/1.3.4/angular.js"></script> <!-- angular.js -->
<script src="https://rawgit.com/vpegado/angular-percentage-filter/master/percentage.js"></script> <!-- angular-percentage-filter -->
<script src="https://rawgit.com/crabl/ng-percent/master/src/ng-percent.js"></script> <!-- ngPercent -->
```

+ Inject the `ngPercent` module into your app:

>
``` JavaScript
angular.module('myApp', ['ng-percent']);
```

+ In your input tag

>
``` html
<input type="text" ng-model="yourModel" ng-percent />
```

+ It is also possible to add 'min' and 'max' validations

>
``` html
<input type="text" ng-model="yourModel" ng-percent min="1" max="1337" />
```

+ If you want to be able to dynamically enable/disable validations from a controller you can use the following

>
``` html
<input type="text" ng-model="yourModel" ng-percent min="1" max="1337" ng-required="true" />
```

+ Disable percent in field

>
``` html
<input type="text" ng-model="yourModel" ng-percent={{isPercent}} />
```

## Differences from ngCurrency

+ Currently, due to limitations in angular-percentage-filter, the `fraction` and `percent-symbol` attributes don't actually do anything. Don't use them.
+ This library does not support locales with different comma separators, etc. so don't expect it to format 1500.00% as 1 500,00% if you're in Quebec. Or anywhere else.



## Contributing

Please submit all pull requests against the master branch. If your pull request contains code patches or features, you MUST include relevant unit tests. Thank you!

To run the unit tests: `npm test`

To build the minified distribution: `npm run dist`

## Authors

**Luis Aguirre**

+ http://alaguirre.com
+ http://github.com/aguirrel

**Chris Rabl**

+ http://crabl.net
+ http://github.com/crabl

## Copyright and license

	The MIT License

	Copyright (c) 2012 - 2014 Luis Aguirre & Chris Rabl

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
