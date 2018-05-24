import './app/designer.module.js';
import './app/designer.controller.js';
import './app/security/headers.directive.js';
import './app/security/oauth.directive.js';
import './app/metrics/metrics.directive.js';
import './app/endpoint/json-formatter.directive.js';
import './app/cached_templates.js';


function component() {
	var element = document.createElement('div');
	return element;
}

document.body.appendChild(component());
