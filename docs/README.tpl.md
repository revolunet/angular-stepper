{% extend "../node_modules/ng-factory/templates/readme/README.tpl.md" %}

{% block description -%}
A simple numeric stepper for your AngularJS applications

```html
<div rn-stepper ng-model="product.quantity" min="config.min" max="config.max"></div>
```

Demo : http://jsfiddle.net/26ghx/embedded/result/

Making of : http://blog.revolunet.com/blog/2013/11/28/create-resusable-angularjs-input-component/

{%- endblock %}
