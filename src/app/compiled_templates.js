angular.module('KrakenDesigner').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/src/app/html/components/dashboard.html',
    "<div class=\"col-lg-6\">\n" +
    "    <div class=\"box box-primary\">\n" +
    "        <div class=\"box-header with-border\">\n" +
    "            <h3 class=\"box-title\">Creating your first service?</h3>\n" +
    "        </div>\n" +
    "        <div class=\"box-body\">\n" +
    "            <p>Hi, thanks for using the <strong>KrakenDesigner</strong>. This application creates the configuration\n" +
    "                that the KrakenD service loads. In order to configure properly the service take at least the following\n" +
    "                <strong>steps:</strong></p>\n" +
    "\n" +
    "            <ul class=\"nav nav-pills nav-justified setup-panel\">\n" +
    "                <li ng-class=\"service.sd_providers.length === 0 || !service.sd_providers ? '' : 'bg-success'\">\n" +
    "                    <a href=\"/#/service\">\n" +
    "                        <h4 class=\"list-group-item-heading\">Step 1</h4>\n" +
    "                        <p class=\"list-group-item-text text-bold\">Set the configuration</p>\n" +
    "                    </a></li>\n" +
    "                <li ng-class=\"service.endpoints.length === 0 || !service.endpoints? '' : 'bg-success'\">\n" +
    "                    <a href=\"/#/endpoints\">\n" +
    "                    <h4 class=\"list-group-item-heading\">Step 2</h4>\n" +
    "                    <p class=\"list-group-item-text text-bold\">Add an endpoint</p>\n" +
    "                </a>\n" +
    "                </li>\n" +
    "                <li ng-class=\"saved_once ? 'bg-success' : '' \">\n" +
    "                    <a href=\"/#/\" ng-click=\"save()\">\n" +
    "                    <h4 class=\"list-group-item-heading\">Step 3</h4>\n" +
    "                    <p class=\"list-group-item-text text-bold\">Download config</p>\n" +
    "                </a></li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"box box-info\">\n" +
    "        <div class=\"box-header with-border\">\n" +
    "            <h3 class=\"box-title\">Finished editing?</h3>\n" +
    "        </div>\n" +
    "        <div class=\"box-body\">\n" +
    "            <p>Play with the forms as much as you want, nothing is saved until you press save. Every time you have\n" +
    "                finished configuring the service (or if you want to continue later) download the\n" +
    "                configuration file to your computer.</p>\n" +
    "            <p>The configuration file is needed to start the KrakenD service and contains the application\n" +
    "                definition.</p>\n" +
    "            <button id=\"download\" name=\"download\" class=\"btn btn-primaryli btn-lg\" ng-click=\"save()\">\n" +
    "                <i class=\"fa fa-save\"></i> Download this configuration\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"col-lg-6\">\n" +
    "\n" +
    "\n" +
    "    <div class=\"box box-info\">\n" +
    "        <div class=\"box-header with-border\">\n" +
    "            <h3 class=\"box-title\">Load a previous configuration file</h3>\n" +
    "        </div>\n" +
    "        <div class=\"box-body\">\n" +
    "            <p>Drag and drop a previous configuration file below to resume a configuration. After reviewing the values\n" +
    "                press the button to load it in the application. Only <code>application/json</code> file type is accepted\n" +
    "                by the KrakenDesigner.\n" +
    "            </p>\n" +
    "\n" +
    "            <div id=\"drop_zone\">\n" +
    "                <h2>Drop configuration file to load it.</h2>\n" +
    "                <small>(No content is uploaded to server, everything stays in your browser)</small>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div id=\"dropzone_modal\" class=\"modal\">\n" +
    "    <div class=\"modal-dialog\">\n" +
    "        <div class=\"modal-content\">\n" +
    "            <div class=\"modal-header\">\n" +
    "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
    "                    <span aria-hidden=\"true\">×</span></button>\n" +
    "                <h4 class=\"modal-title\">Load this configuration?</h4>\n" +
    "            </div>\n" +
    "            <div class=\"modal-body\">\n" +
    "\n" +
    "                <div ng-if=\"dropzone_loaded\" class=\"alert alert-success alert-dismissible\">\n" +
    "                    <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\"\n" +
    "                            ng-click=\"dropzone_loaded=!dropzone_loaded\">×\n" +
    "                    </button>\n" +
    "                    <h4><i class=\"fa fa-check\"></i> Configuration loaded</h4>\n" +
    "                    The configuration file has been successfully loaded in KrakenDesigner.\n" +
    "                </div>\n" +
    "\n" +
    "\n" +
    "                <p>Current session data will be replaced with the configuration below. Proceed? </p>\n" +
    "                <pre>{{ service_configuration }}</pre>\n" +
    "            </div>\n" +
    "            <div class=\"modal-footer\">\n" +
    "                <button type=\"button\" class=\"btn btn-default pull-left\" data-dismiss=\"modal\">Cancel</button>\n" +
    "                <button type=\"button\" ng-click=\"loadFile()\" class=\"btn btn-primary\">Yes, load this configuration\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!-- /.modal-content -->\n" +
    "    </div>\n" +
    "    <!-- /.modal-dialog -->\n" +
    "</div>\n" +
    "\n" +
    "<script src=\"http://www.krakend.io/js/dragndrop.js\"></script>\n"
  );


  $templateCache.put('/src/app/html/components/form_backends.html',
    "<div class=\"box box-success\">\n" +
    "    <div class=\"box-header with-border\">\n" +
    "        <h3 class=\"box-title\">Available hosts</h3>\n" +
    "        <div class=\"pull-right\">\n" +
    "            <span ng-if=\"service.sd_providers.hosts.length === 0 || !service.sd_providers.hosts\" class=\"pull-right-container\" data-toggle=\"tooltip\"\n" +
    "            data-original-title=\"The service needs at least 1 host to work\">\n" +
    "            <i class=\"fa fa-warning pull-right icon-warning\"></i>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!-- /.box-header -->\n" +
    "<div class=\"box-body\">\n" +
    "    <p>The hosts are the servers you will use to feed the content. You need to declare here any host you want the KrakenD to feed from.</p>\n" +
    "    <ul class=\"list-unstyled\">\n" +
    "        <li ng-repeat=\"(index,host) in service.sd_providers.hosts\">\n" +
    "            <a class=\"badge badge-remove\" ng-click=\"deleteIndexFromArray(index, '$scope.service.sd_providers.hosts')\"\n" +
    "            title=\"Click to delete host\"><i class=\"fa fa-times\"></i> {{ host.sd }} - {{ host.host }}</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "<!-- /.box-body -->\n" +
    "<div class=\"box-header with-border\">\n" +
    "    <h3 class=\"box-title\">Add new host ({{ service_discovery_type }} resolution)</h3>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"box-body\">\n" +
    "    <p>Add here all the API hostnames where KrakenD will retrieve the data from. If you don't use a service discovery to resolve host names choose <em>None</em> from the following <strong>discovery providers</strong> list:</p>\n" +
    "    <form name=\"addBackend\">\n" +
    "        <div class=\"col-sm-6 form-group\">\n" +
    "            <div class=\"radio\">\n" +
    "                <label>\n" +
    "                    <input type=\"radio\" ng-model=\"service_discovery_type\" value=\"static\" ng-init=\"service_discovery_type='static'\">\n" +
    "                    None (static resolution)\n" +
    "                </label>\n" +
    "            </div>\n" +
    "            <div class=\"radio\">\n" +
    "                <label>\n" +
    "                  <input type=\"radio\" ng-model=\"service_discovery_type\" value=\"dns\" ng-disabled=\"!service.sd_providers.providers.dns\">\n" +
    "                  DNS SRV\n" +
    "              </label>\n" +
    "              <a ng-click=\"service.sd_providers.providers.dns=true\" ng-if=\"!service.sd_providers.providers.dns\">(enable)</a>\n" +
    "          </div>\n" +
    "      </div>\n" +
    "      <div class=\"col-sm-6 form-group\">\n" +
    "        <div class=\"radio\">\n" +
    "            <label>\n" +
    "              <input type=\"radio\" ng-model=\"service_discovery_type\" value=\"etcd\" ng-disabled=\"!service.sd_providers.providers.etcd\">\n" +
    "              Etcd\n" +
    "          </label>\n" +
    "          <a href=\"/#/service-discovery\" ng-click=\"service.sd_providers.providers.etcd=true\" ng-if=\"!service.sd_providers.providers.etcd\">(enable &amp; configure)</a>\n" +
    "      </div>\n" +
    "      <div class=\"radio\">\n" +
    "        <label>\n" +
    "          <input type=\"radio\" ng-model=\"service_discovery_type\" value=\"custom\" ng-disabled=\"!service.sd_providers.providers.custom\">\n" +
    "          Custom\n" +
    "      </label>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"col-sm-12\">\n" +
    "    <div class=\"input-group\">\n" +
    "        <input class=\"form-control\"\n" +
    "        placeholder=\"http://api.your.server:8080\"\n" +
    "        ng-model=\"hostname\">\n" +
    "        <div class=\"input-group-btn\">\n" +
    "            <button type=\"button\" class=\"btn btn-success\" ng-click=\"addHost(hostname, service_discovery_type)\"><i\n" +
    "                class=\"fa fa-plus\"></i> Add host\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "</form>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('/src/app/html/components/form_endpoints.html',
    "<div class=\"box box-primary collapsed-box\" ng-repeat=\"(endpoint_index,endpoint) in service.endpoints\"\n" +
    "     ng-class=\"isValidEndpoint(endpoint.endpoint) ? '' : 'box-danger'\">\n" +
    "    <div class=\"box-header with-border\">\n" +
    "        <h3 class=\"box-title\">\n" +
    "            <a data-widget=\"collapse\">\n" +
    "                <i class=\"fa fa-plus\"></i>\n" +
    "\n" +
    "                {{ endpoint.endpoint }}\n" +
    "                <code class=\"small\" ng-if=\"endpoint.querystring_params.length > 0\">\n" +
    "                    ?<span ng-repeat=\"qs in endpoint.querystring_params\">{{ qs }}=X{{ $last ? '' : '&' }}</span>\n" +
    "                </code>\n" +
    "            </a>\n" +
    "        </h3>\n" +
    "\n" +
    "        <div class=\"box-tools pull-right\">\n" +
    "            <span ng-hide=\"isValidEndpoint(endpoint.endpoint)\" class=\"badge label-danger\"><i class=\"fa fa-warning\"></i> Error(s)</span>\n" +
    "            <span class=\"badge method_{{ endpoint.method }}\">{{ endpoint.method }}</span>\n" +
    "            <button type=\"button\" class=\"btn btn-box-tool\"\n" +
    "                    ng-click=\"deleteEndpoint(endpoint_index, 'This endpoint and all the information will be deleted. Do you want to proceed?')\">\n" +
    "                <i class=\"fa fa-trash\"></i></button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- /.box-header -->\n" +
    "    <div class=\"box-body\">\n" +
    "        <!-- Search Endpoints\n" +
    "        <form action=\"#\" method=\"get\" class=\"sidebar-form\">\n" +
    "            <input type=\"search\" id=\"q\" ng-model=\"q\" name=\"q\" class=\"form-control\" placeholder=\"Filter Endpoints...\">\n" +
    "        </form>\n" +
    "        <ul class=\"treeview-menu menu-open\">\n" +
    "            <li class=\"animate-repeat\" ng-repeat=\"endpoint in service.endpoints| filter:q as results\">\n" +
    "                <a>{{ endpoint.endpoint }}\n" +
    "                        <span class=\"pull-right-container\">\n" +
    "                            <i class=\"fa fa-angle-left pull-right\"></i>\n" +
    "                        </span>\n" +
    "                </a>\n" +
    "                <ul class=\"treeview-menu menu-open\">\n" +
    "                    <li ng-repeat=\"backend in endpoint.backend\">\n" +
    "                        <a>{{ backend.url_pattern }}</a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </li>\n" +
    "            <li class=\"animate-repeat\" ng-if=\"results.length === 0\">\n" +
    "                <a><strong>No results found...</strong></a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        -->\n" +
    "        <form class=\"form-horizontal\" novalidate>\n" +
    "            <fieldset>\n" +
    "                <div ng-class=\"isValidEndpoint(endpoint.endpoint) ? '' : 'has-error'\" class=\"form-group form-group-lg\">\n" +
    "                    <div class=\"col-md-10 col-sm-8\">\n" +
    "                        <label>KrakenD Endpoint</label>\n" +
    "                        <input type=\"text\"\n" +
    "                               placeholder=\"/users/{username}\"\n" +
    "                               class=\"form-control input-md\"\n" +
    "                               required=\"\" ng-model=\"endpoint.endpoint\">\n" +
    "                        <span class=\"help-block\">This is the URI your clients will connect to. Must start with slash.\n" +
    "                                  Use curly braces to insert <code>{placeholders}</code> that can be passed to the\n" +
    "                            backends.</span>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-2 col-sm-4\">\n" +
    "                        <label>Method</label>\n" +
    "                        <select id=\"endpoint.method\"\n" +
    "                                ng-model=\"endpoint.method\"\n" +
    "                                name=\"endpoint.method\"\n" +
    "                                class=\"form-control\"\n" +
    "                                ng-change=\"updateNonGETBackends(endpoint_index, '{{ endpoint.method }}', 'Non-GET methods forward the request to a single backend query (the first one). The rest will be deleted from this form. Proceed?')\">\n" +
    "                            <option value=\"GET\">GET</option>\n" +
    "                            <option value=\"POST\">POST</option>\n" +
    "                            <option value=\"PUT\">PUT</option>\n" +
    "                            <option value=\"DELETE\">DELETE</option>\n" +
    "                        </select>\n" +
    "                        <span class=\"help-block\">HTTP verb</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <label>Recognized query string parameters (?param=value)</label>\n" +
    "                        <div class=\"input-group\">\n" +
    "                            <input class=\"form-control\"\n" +
    "                                   placeholder=\"parameter_name\"\n" +
    "                                   type=\"url\"\n" +
    "                                   id=\"addQuerystring_{{ endpoint_index }}\">\n" +
    "                            <div class=\"input-group-btn\">\n" +
    "                                <button type=\"button\" class=\"btn btn-success\" ng-click=\"addQuerystring(endpoint_index)\">\n" +
    "                                    <i class=\"fa fa-plus\"></i> Enable query string\n" +
    "                                </button>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <span class=\"help-block\">Enter here any additional parameters that don't fit in the endpoint URI\n" +
    "                            that will be sent to the backends as query string when present. Write only the name of the\n" +
    "                            parameter, no question mark or equal symbols.</span>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <label>Active:</label>\n" +
    "                        <ul class=\"list-unstyled\">\n" +
    "                            <li ng-repeat=\"(qs_index,qs) in endpoint.querystring_params\">\n" +
    "                                <a class=\"badge badge-remove\"\n" +
    "                                   ng-click=\"deleteQuerystring(qs_index,endpoint_index)\"\n" +
    "                                   title=\"Click to delete parameter\"><i class=\"fa fa-times\"></i> {{ qs }} </a>\n" +
    "                            </li>\n" +
    "                            <li ng-if=\"!endpoint.querystring_params.length\">No query parameters are active yet. Typical\n" +
    "                                parameters are <code>page</code>, <code>limit</code>, <code>search</code>...\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-md-3\" ng-class=\"isInteger(endpoint.concurrent_calls) ? '' : 'has-error'\">\n" +
    "                        <label>Concurrent Calls</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" ng-model=\"endpoint.concurrent_calls\" ng-init=\"endpoint.concurrent_calls=1\">\n" +
    "                        <span class=\"help-block\">\n" +
    "                            <p ng-hide=\"isInteger(endpoint.concurrent_calls)\" class=\"badge label-danger\">\n" +
    "                                <i class=\"fa fa-warning\"></i> Use an integer</p>\n" +
    "                          <p>Parallel requests you want to send to the backend <strong>for the same request</strong>. Fastest request is taken and the rest are discarded. This value should be between 1 and 3 (or higher if your backend can support very high load)</p>\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-3\">\n" +
    "                        <label>Headers passing to backend</label>\n" +
    "                        <div class=\"input-group\">\n" +
    "                            <input class=\"form-control\" placeholder=\"header_name\" type=\"text\" required=\"\" ng-model=\"input_header\">\n" +
    "                            <div class=\"input-group-btn\">\n" +
    "                                <button type=\"button\" class=\"btn btn-success\" ng-click=\"addHeaderPassing(endpoint_index,input_header)\">\n" +
    "                                    <i class=\"fa fa-plus\"></i> Add header\n" +
    "                                </button>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <span class=\"help-block\">Allowed headers to pass from client to each of the backends. These headers are not an addition, but a replacement when they are set. Use only if you need custom headers to pass back but ensure to declare all needed headers (including <code>Content-Type</code>).</span>\n" +
    "                        <div class=\"input-group\">\n" +
    "                            <ul class=\"list-unstyled\">\n" +
    "                                <li ng-repeat=\"(index,header) in endpoint.headers_to_pass\">\n" +
    "                                    <a class=\"badge badge-remove\"\n" +
    "                                       ng-click=\"deleteHeaderPassing(endpoint_index,index)\"><i class=\"fa fa-times\"></i>\n" +
    "                                        {{ header }}</a>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-3\">\n" +
    "                        <label>Timeout, Cache TTL and Throttling</label>\n" +
    "                        <br/>\n" +
    "                        <button class=\"btn btn-default btn-flat\"\n" +
    "                                data-toggle=\"modal\"\n" +
    "                                data-target=\"#endpoint-modal-{{ endpoint_index }}\">\n" +
    "                            <i class=\"fa fa-wrench\"></i> Override defaults\n" +
    "                        </button>\n" +
    "                        <span class=\"help-block\">\n" +
    "                          Override default settings for this endpoint.\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-3\">\n" +
    "                        <label>Security headers</label>\n" +
    "                        <br/>\n" +
    "                        <button class=\"btn btn-default btn-flat\"\n" +
    "                                data-toggle=\"modal\"\n" +
    "                                data-target=\"#security-modal-{{ endpoint_index }}\">\n" +
    "                            <i class=\"fa fa-wrench\"></i> Override defaults\n" +
    "                        </button>\n" +
    "                        <span class=\"help-block\">\n" +
    "                          Override default settings for this endpoint.\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <h4>Backend queries (where the data comes from)</h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12\"\n" +
    "                         ng-repeat=\"(backend_index,backend) in endpoint.backend\">\n" +
    "                        <div class=\"box box-primary box-solid\">\n" +
    "                            <div class=\"box-header with-border\">\n" +
    "                                <h3 class=\"box-title\">{{ backend.url_pattern }}</h3>\n" +
    "\n" +
    "                                <div class=\"box-tools pull-right\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"collapse\">\n" +
    "                                        <i class=\"fa fa-minus\"></i>\n" +
    "                                    </button>\n" +
    "                                    <button type=\"button\"\n" +
    "                                            class=\"btn btn-box-tool\"\n" +
    "                                            ng-click=\"deleteBackendQuery(endpoint_index,backend_index,'This endpoint and all the information will be deleted. Do you want to proceed?')\">\n" +
    "                                        <i class=\"fa fa-trash\"></i></button>\n" +
    "\n" +
    "                                </div>\n" +
    "                                <!-- /.box-tools -->\n" +
    "                            </div>\n" +
    "                            <!-- /.box-header -->\n" +
    "                            <div class=\"box-body\">\n" +
    "                                <h4>Request</h4>\n" +
    "                                <p>All the data needed to send the request to the servers.</p>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <div class=\"col-md-12\">\n" +
    "                                        <label>Service Discovery</label>\n" +
    "                                        <span class=\"help-block\">Service Discovery options you enabled. <a href=\"/#/service-discovery\">(add more)</a></span>\n" +
    "                                         <div class=\"radio\" ng-repeat=\"(sd,enabled) in service.sd_providers.providers\" ng-init=\"backend.sd='static'\">\n" +
    "                                            <label>\n" +
    "                                              <input type=\"radio\" ng-model=\"backend.sd\" value=\"{{ sd }}\"  ng-disabled=\"!enabled\">\n" +
    "                                              {{ sd }}\n" +
    "                                          </label>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <div class=\"col-md-8\">\n" +
    "                                        <label>Hosts</label>\n" +
    "                                        <select id=\"host\" name=\"host\"\n" +
    "                                                class=\"form-control\"\n" +
    "                                                ng-model=\"backend.host\"\n" +
    "                                                ng-change=\"backend.disable_host_sanitize=(backend.sd!='static')\"\n" +
    "                                                multiple=\"multiple\">\n" +
    "                                            <option ng-repeat=\"host in service.sd_providers.hosts | filter: backend.sd\" value=\"{{ host.host }}\">\n" +
    "                                                {{ host.host }}\n" +
    "                                            </option>\n" +
    "                                        </select>\n" +
    "\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-4\">\n" +
    "                                        <span class=\"help-block\">Please select one or several backends that will receive\n" +
    "                                            this request. Use multiple backends to send the same query to all and take\n" +
    "                                            the fastest response (GET), the rest of methods (PUT,POST,DELETE) will pick\n" +
    "                                            randomly one backend. between the selected ones.</span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <div class=\"col-md-8\">\n" +
    "                                        <label>Backend endpoint</label>\n" +
    "                                        <div class=\"input-group\">\n" +
    "                                            <input type=\"text\"\n" +
    "                                                   placeholder=\"/users/{username}\"\n" +
    "                                                   class=\"form-control\"\n" +
    "                                                   required=\"\"\n" +
    "                                                   ng-model=\"backend.url_pattern\">\n" +
    "                                            <div class=\"input-group-btn\">\n" +
    "                                                <button type=\"button\" class=\"btn method_{{ endpoint.method }}\">\n" +
    "                                                    {{ endpoint.method }}\n" +
    "                                                </button>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                        <span class=\"help-block\">The endpoint of the backend server to query. Reuse here\n" +
    "                                            any <code>{placeholders}</code> defined in the parent endpoint.</span>\n" +
    "                                    </div>\n" +
    "\n" +
    "                                    <div class=\"col-md-4\">\n" +
    "                                       <label>Rate Limit</label>\n" +
    "                                       <br/>\n" +
    "                                       <button class=\"btn btn-default btn-flat\"\n" +
    "                                            data-toggle=\"modal\"\n" +
    "                                            data-target=\"#backend-modal-{{ endpoint_index}}{{ backend_index }}\">\n" +
    "                                            <i class=\"fa fa-wrench\"></i> Rate limit this backend\n" +
    "                                        </button>\n" +
    "                                        <span class=\"help-block\">Limit the number of requests this backend will receive regardless of its endpoint configuration</span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <hr/>\n" +
    "                                <h4>Caching</h4>\n" +
    "                                <div class=\"form-group\">\n" +
    "\n" +
    "                                    <div class=\"col-md-12\">\n" +
    "                                        <label> Backend caching</label>\n" +
    "                                        <div class=\"input-group\">\n" +
    "                                             <input type=\"checkbox\"\n" +
    "                                                ng-click=\"toggleCaching($event, endpoint_index, backend_index)\"> Store backend response in-memory for the time specified in its <code>Cache-Control</code> header\n" +
    "\n" +
    "                                            <span class=\"help-block\">This option increases the load and the memory consumption as KrakenD will keep in memory all the returned data. Use wisely.</span>\n" +
    "\n" +
    "                                            <span class=\"help-block badge label-warning\"\n" +
    "                                                ng-show=\"backend.extra_config['github.com/devopsfaith/krakend-httpcache']\" >\n" +
    "                                                <i class=\"fa fa-warning\"></i> Warning! Load will be increased\n" +
    "                                            </span>\n" +
    "\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <hr/>\n" +
    "                                <h4>Authorization</h4>\n" +
    "                                <oauth data=\"backend\" inherit=\"service.extra_config['github_com/devopsfaith/krakend-oauth2-clientcredentials']\"></oauth>\n" +
    "                                <hr/>\n" +
    "                                <h4>Response Parsing</h4>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <div class=\"col-md-4\">\n" +
    "                                        <label>Decode as:</label>\n" +
    "                                        <select class=\"form-control\" ng-model=\"backend.encoding\"\n" +
    "                                                ng-init=\"backend.encoding ='json'\">\n" +
    "                                            <option selected value=\"json\">JSON</option>\n" +
    "                                            <option value=\"xml\">XML</option>\n" +
    "                                            <option value=\"rss\">RSS</option>\n" +
    "                                            <option value=\"string\">String</option>\n" +
    "                                        </select>\n" +
    "                                        <span class=\"help-block\">How to decode the response of the backend.</span>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-8\">\n" +
    "                                        <label>Root object:</label>\n" +
    "                                        <input type=\"text\" class=\"form-control\" ng-model=\"backend.target\"\n" +
    "                                               ng-disabled=\"backend.is_collection == true\"\n" +
    "                                               placeholder=\"Leave blank to use all the reponse\">\n" +
    "                                        <span class=\"help-block\">Some APIs return all the content encapsulated inside\n" +
    "                                            a root object (usually named like <code>data</code>, <code>response</code>,\n" +
    "                                            <code>items</code>). Specifying here a root object will put all its children\n" +
    "                                            in the first level. When manipulating the data only its children are visible.</span>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-12\">\n" +
    "                                        <label>Non-object response</label>\n" +
    "                                        <div class=\"input-group\">\n" +
    "                                            <input type=\"checkbox\"\n" +
    "                                                   ng-model=\"backend.is_collection\"\n" +
    "                                                   ng-change=\"backend.target = ''\"> Treat the response as a\n" +
    "                                            collection, not an object.\n" +
    "                                            <span class=\"help-block\">KrakenD expects the returned content encapsulated in\n" +
    "                                            an object (in json inside brackets, e.g: <code>{ \"status\":\"OK\" }</code> but if\n" +
    "                                            the backend returns a collection instead (e.g: <code>[ \"a\", \"b\" ]</code>) check\n" +
    "                                            this option. The collection will be returned inside the <code>collection</code>\n" +
    "                                            attribute. Use the renaming below to rename it to anything else.</span>\n" +
    "\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <hr/>\n" +
    "\n" +
    "                                <h4>Response manipulation</h4>\n" +
    "                                <p>Transform here the response with a lighter version, include only the attributes that\n" +
    "                                    your\n" +
    "                                    application needs.</p>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"col-md-2 control-label\">Filtering mode</label>\n" +
    "                                    <div class=\"col-md-10\">\n" +
    "                                        <div class=\"nav-tabs-custom\">\n" +
    "                                            <ul class=\"nav nav-tabs\">\n" +
    "                                                <li class=\"active\">\n" +
    "                                                    <a data-target=\"#tab_black-{{ endpoint_index }}-{{ backend_index }}\"\n" +
    "                                                       data-toggle=\"tab\"\n" +
    "                                                       aria-expanded=\"false\">Blacklist (fastest)</a>\n" +
    "                                                </li>\n" +
    "                                                <li>\n" +
    "                                                    <a data-target=\"#tab_white-{{ endpoint_index }}-{{ backend_index }}\"\n" +
    "                                                       data-toggle=\"tab\"\n" +
    "                                                       aria-expanded=\"true\">Whitelist</a></li>\n" +
    "                                            </ul>\n" +
    "                                            <div class=\"tab-content\">\n" +
    "\n" +
    "\n" +
    "                                                <div class=\"tab-pane active\"\n" +
    "                                                     id=\"tab_black-{{ endpoint_index }}-{{ backend_index }}\">\n" +
    "                                                    <p>Attributes that you will NOT pick from the response:</p>\n" +
    "                                                    <ul class=\"list-inline\">\n" +
    "                                                        <li ng-repeat=\"white in backend.blacklist\">\n" +
    "                                                            <a class=\"badge badge-remove\"\n" +
    "                                                               ng-click=\"deleteBlacklist(black,backend_index,endpoint_index)\"><i\n" +
    "                                                                    class=\"fa fa-times\"></i>\n" +
    "                                                                {{ white }}</a>\n" +
    "                                                        </li>\n" +
    "                                                    </ul>\n" +
    "\n" +
    "                                                    <div class=\"input-group\">\n" +
    "                                                        <input class=\"form-control\"\n" +
    "                                                               placeholder=\"attribute_name\"\n" +
    "                                                               type=\"url\"\n" +
    "                                                               id=\"bl{{ endpoint_index }}{{ backend_index }}\">\n" +
    "                                                        <div class=\"input-group-btn\">\n" +
    "                                                            <button type=\"button\"\n" +
    "                                                                    class=\"btn btn-success\"\n" +
    "                                                                    ng-click=\"addBlacklist(endpoint_index,backend_index)\">\n" +
    "                                                                <i class=\"fa fa-plus\"></i> Add\n" +
    "                                                                attribute\n" +
    "                                                            </button>\n" +
    "                                                        </div>\n" +
    "                                                    </div>\n" +
    "                                                </div>\n" +
    "\n" +
    "                                                <div class=\"tab-pane\"\n" +
    "                                                     id=\"tab_white-{{ endpoint_index }}-{{ backend_index }}\">\n" +
    "                                                    <p>Attributes that you will pick from the response</p>\n" +
    "                                                    <ul class=\"list-inline\">\n" +
    "                                                        <li ng-repeat=\"white in backend.whitelist\">\n" +
    "                                                            <a class=\"badge badge-remove\"\n" +
    "                                                               ng-click=\"deleteWhitelist(white,backend_index,endpoint_index)\"><i\n" +
    "                                                                    class=\"fa fa-times\"></i>\n" +
    "                                                                {{ white }}</a>\n" +
    "                                                        </li>\n" +
    "                                                    </ul>\n" +
    "\n" +
    "                                                    <div class=\"input-group\">\n" +
    "                                                        <input class=\"form-control\"\n" +
    "                                                               placeholder=\"attribute_name\"\n" +
    "                                                               type=\"url\"\n" +
    "                                                               id=\"wl{{ endpoint_index }}{{ backend_index }}\">\n" +
    "                                                        <div class=\"input-group-btn\">\n" +
    "                                                            <button type=\"button\"\n" +
    "                                                                    class=\"btn btn-success\"\n" +
    "                                                                    ng-click=\"addWhitelist(endpoint_index,backend_index)\">\n" +
    "                                                                <i class=\"fa fa-plus\"></i> Add\n" +
    "                                                                attribute\n" +
    "                                                            </button>\n" +
    "                                                        </div>\n" +
    "                                                    </div>\n" +
    "\n" +
    "\n" +
    "                                                </div>\n" +
    "\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                        <span class=\"help-block\">If you want to filter the response, choose between whitelisting or blacklisting attributes. If both are set, whitelisting will be used. If it's the same for you, blacklisting performs much better.</span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"col-md-2 control-label\">Capturing group</label>\n" +
    "                                    <div class=\"col-md-10\">\n" +
    "                                        <input ng-model=\"backend.group\"\n" +
    "                                               type=\"text\"\n" +
    "                                               class=\"form-control\"\n" +
    "                                               placeholder=\"my-group\">\n" +
    "                                        <span class=\"help-block\">\n" +
    "                                            Fill only if you want to capture all the response and encapsulate inside an attribute name.</span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"col-md-2 control-label\">Renaming</label>\n" +
    "                                    <div class=\"col-md-10\">\n" +
    "\n" +
    "                                        <div class=\"form-group\">\n" +
    "                                            <div class=\"col-xs-3\">\n" +
    "                                                <input type=\"text\" class=\"form-control\"\n" +
    "                                                       placeholder=\"id_imported_user\"\n" +
    "                                                       id=\"tr_origin{{ endpoint_index }}{{ backend_index }}\">\n" +
    "                                                <label>Original object</label>\n" +
    "                                            </div>\n" +
    "                                            <div class=\"col-xs-3\">\n" +
    "                                                <input type=\"text\" class=\"form-control\" placeholder=\"id\"\n" +
    "                                                       id=\"tr_target{{ endpoint_index }}{{ backend_index }}\">\n" +
    "                                                <label>Renamed object</label>\n" +
    "\n" +
    "                                            </div>\n" +
    "                                            <div class=\"col-xs-2\">\n" +
    "                                                <button type=\"button\"\n" +
    "                                                        class=\"btn btn-success\"\n" +
    "                                                        ng-click=\"addTransformation(endpoint_index,backend_index)\">\n" +
    "                                                    Apply\n" +
    "                                                </button>\n" +
    "                                            </div>\n" +
    "                                            <div class=\"col-xs-4\">\n" +
    "                                                <ul class=\"list-unstyled\">\n" +
    "                                                    <li ng-repeat=\"(origin,target) in backend.mapping\">\n" +
    "                                                        <a class=\"badge badge-remove\"\n" +
    "                                                           ng-click=\"deleteTransformation(origin,endpoint_index, backend_index)\"><i\n" +
    "                                                                class=\"fa fa-times\"></i>\n" +
    "                                                            {{ origin }} <i class=\"fa fa-arrow-right\"></i> {{ target }}</a>\n" +
    "                                                    </li>\n" +
    "                                                </ul>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                        <span class=\"help-block\">You can rename any attributes returned by the backend and use a name more convenient for you.</span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <hr/>\n" +
    "                                <h4>Advanced - Martian DSL</h4>\n" +
    "                                <p>Paste here any additional configuration you want to add to <a href=\"https://github.com/google/martian#modifiers-all-the-way-down\">Martian</a>. The input must be a JSON object (ensure to start and end with curly braces <code>{}</code>)</p>\n" +
    "                                 <div class=\"form-group\">\n" +
    "                                    <label class=\"col-md-2 control-label\">Martian DSL</label>\n" +
    "                                    <div class=\"col-md-10\">\n" +
    "                                        <div class=\"form-group\">\n" +
    "                                            <div class=\"col-xs-12\">\n" +
    "                                               <textarea json-formatter class=\"form-control\" ng-model=\"backend.extra_config['github.com/devopsfaith/krakend-martian']\"></textarea>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                        <p ng-show=\"backend.martian_syntax_validation.length\" class=\"badge label-danger\">\n" +
    "                                            <i class=\"fa fa-warning\"></i> Syntax error - {{backend.martian_syntax_validation}}</p>\n" +
    "                                        <span class=\"help-block\">Paste here your JSON configuration to be used in the martian modifier. See <a href=\"https://github.com/devopsfaith/krakend-martian/blob/master/example/krakend.json#L26\">an example</a></span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <!-- /.box-body -->\n" +
    "                        </div>\n" +
    "\n" +
    "                        <!-- Modal window backend -->\n" +
    "                        <div id=\"backend-modal-{{ endpoint_index}}{{ backend_index }}\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\">\n" +
    "                            <div class=\"modal-dialog\" role=\"document\">\n" +
    "                                <div class=\"modal-content\">\n" +
    "                                    <div class=\"modal-header\">\n" +
    "                                        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
    "                                            <span aria-hidden=\"true\">&times;</span></button>\n" +
    "                                        <h4 class=\"modal-title\">Rate limit requests to <code>{{backend.url_pattern}}</code></h4>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"modal-body\">\n" +
    "                                        <p>All the settings below are defined in the <strong>Service configuration</strong>,\n" +
    "                                            setting one or several values here means overriding the settings for this specific backend\n" +
    "                                            only.</p>\n" +
    "                                            <div class=\"form-group\">\n" +
    "                                                <div class=\"col-md-12\" ng-class=\"isInteger(backend.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/proxy'].maxRate) ? '' : 'has-error'\">\n" +
    "                                                    <label>Max rate limit</label>\n" +
    "                                                    <div class=\"input-group\">\n" +
    "                                                        <input class=\"form-control\"\n" +
    "                                                               type=\"text\"\n" +
    "                                                               ng-model=\"backend.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/proxy'].maxRate\"\n" +
    "                                                               ng-change=\"backend.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/proxy'].capacity=backend.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/proxy'].maxRate\">\n" +
    "                                                        <div class=\"input-group-addon\">reqs/sec</div>\n" +
    "                                                    </div>\n" +
    "                                                    <div class=\"help-block\">\n" +
    "                                                        <p ng-hide=\"isInteger(backend.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/proxy'].maxRate)\" class=\"badge label-danger\"><i\n" +
    "                                                                class=\"fa fa-warning\"></i> Invalid format</p>\n" +
    "                                                        <p>Maximum requests per second you want to accept in this backend.</p>\n" +
    "                                                    </div>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "\n" +
    "                                            <div class=\"form-group\" ng-class=\"isInteger(backend.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/proxy'].capacity) ? '' : 'has-error'\">\n" +
    "                                                <div class=\"col-md-12\">\n" +
    "                                                    <label class=\"control-label\">Capacity (Burst size)</label>\n" +
    "                                                    <div class=\"input-group\">\n" +
    "                                                        <input class=\"form-control\"\n" +
    "                                                               ng-model=\"backend.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/proxy'].capacity\"\n" +
    "                                                               id=\"backend.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/proxy'].capacity\"\n" +
    "                                                               name=\"backend.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/proxy'].capacity\"\n" +
    "                                                               type=\"text\">\n" +
    "                                                        <div class=\"input-group-addon\">reqs/sec</div>\n" +
    "                                                    </div>\n" +
    "                                                    <div class=\"help-block\">\n" +
    "                                                        <p ng-hide=\"isInteger(backend.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/proxy'].capacity)\" class=\"badge label-danger\"><i\n" +
    "                                                                class=\"fa fa-warning\"></i> Invalid format</p>\n" +
    "                                                        <p>Recommended value <code>capacity=maxRate</code>. A <a href=\"https://en.wikipedia.org/wiki/Token_bucket\">token bucket</a> algorithm is used with a bucket capacity == tokens added per second. KrakenD is able to allow bursting on the request rates.</p>\n" +
    "                                                    </div>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <!-- /Modal backend -->\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "                </div>\n" +
    "                <button class=\"btn btn-primary\"\n" +
    "                        ng-click=\"addBackendQuery(endpoint_index)\"\n" +
    "                        ng-if=\"! endpoint.backend || endpoint.backend.length < 1 || endpoint.method =='GET'\">\n" +
    "                    <span class=\"glyphicon glyphicon glyphicon-plus\" aria-hidden=\"true\"></span>\n" +
    "                    Add backend query\n" +
    "                </button>\n" +
    "            </fieldset>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "    <!-- /.box-body -->\n" +
    "\n" +
    "    <!-- Modal Window for security in this endpoint-->\n" +
    "    <div id=\"security-modal-{{ endpoint_index }}\" class=\"modal fade\"\n" +
    "         tabindex=\"-1\"\n" +
    "         role=\"dialog\">\n" +
    "        <div class=\"modal-dialog\" role=\"document\">\n" +
    "            <div class=\"modal-content\">\n" +
    "                <div class=\"modal-header\">\n" +
    "                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
    "                        <span aria-hidden=\"true\">&times;</span></button>\n" +
    "                    <h4 class=\"modal-title\">Override security headers for <code>{{ endpoint.endpoint }}</code></h4>\n" +
    "                </div>\n" +
    "                <div class=\"modal-body\">\n" +
    "\n" +
    "                        <security-headers data=\"endpoint\" inherit=\"service.extra_config['github_com/devopsfaith/krakend-httpsecure']\"></security-headers>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- Modal Window for endpoint-->\n" +
    "    <div id=\"endpoint-modal-{{ endpoint_index }}\" class=\"modal fade\"\n" +
    "         tabindex=\"-1\"\n" +
    "         role=\"dialog\">\n" +
    "        <div class=\"modal-dialog\" role=\"document\">\n" +
    "            <div class=\"modal-content\">\n" +
    "                <div class=\"modal-header\">\n" +
    "                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
    "                        <span aria-hidden=\"true\">&times;</span></button>\n" +
    "                    <h4 class=\"modal-title\">Override global configuration for <code>{{ endpoint.endpoint }}</code></h4>\n" +
    "                </div>\n" +
    "                <div class=\"modal-body\">\n" +
    "                    <p>All the settings below are defined in the <strong>Service configuration</strong>,\n" +
    "                        setting one or several values here means overriding the settings for this specific endpoint\n" +
    "                        only.</p>\n" +
    "\n" +
    "                    <p ng-include src=\"/src/app/html/components/time_units.html\"></p>\n" +
    "\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"form-group\">\n" +
    "\n" +
    "                            <div class=\"col-md-4\" ng-class=\"isValidTimeUnit(endpoint.timeout) ? '' : 'has-error'\">\n" +
    "                                <label>Timeout</label>\n" +
    "                                <input class=\"form-control\"\n" +
    "                                       type=\"text\"\n" +
    "                                       ng-model=\"endpoint.timeout\">\n" +
    "                                <div class=\"help-block\">\n" +
    "                                    <p ng-hide=\"isValidTimeUnit(endpoint.timeout)\" class=\"badge label-danger\"><i\n" +
    "                                            class=\"fa fa-warning\"></i> Invalid format</p>\n" +
    "                                    <p>Maximum time you'll wait for the slowest response. Usually in milliseconds\n" +
    "                                        (ms)</p>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"col-md-4\" ng-class=\"isValidTimeUnit(endpoint.cache_ttl) ? '' : 'has-error'\">\n" +
    "                                <label>Cache TTL</label>\n" +
    "                                <input class=\"form-control\"\n" +
    "                                       type=\"text\"\n" +
    "                                       ng-model=\"endpoint.cache_ttl\">\n" +
    "                                <div class=\"help-block\">\n" +
    "                                    <p ng-hide=\"isValidTimeUnit(endpoint.cache_ttl)\" class=\"badge label-danger\"><i\n" +
    "                                            class=\"fa fa-warning\"></i> Invalid format</p>\n" +
    "                                    <p>For how long a proxy can cache a request to this endpoint.</p>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"col-md-4\" ng-class=\"isInteger(endpoint.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/router'].maxRate) ? '' : 'has-error'\">\n" +
    "                                <label>Rate Limit</label>\n" +
    "                                <div class=\"input-group\">\n" +
    "                                    <input class=\"form-control\"\n" +
    "                                           type=\"text\"\n" +
    "                                           ng-model=\"endpoint.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/router'].maxRate\">\n" +
    "                                    <div class=\"input-group-addon\">reqs/sec</div>\n" +
    "                                </div>\n" +
    "                                <div class=\"help-block\">\n" +
    "                                    <p ng-hide=\"isInteger(endpoint.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/router'].maxRate)\" class=\"badge label-danger\"><i\n" +
    "                                            class=\"fa fa-warning\"></i> Invalid format</p>\n" +
    "                                    <p>Maximum requests you want to accept in this endpoint.</p>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"form-group\" ng-class=\"isInteger(endpoint.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/router'].clientMaxRate) ? '' : 'has-error'\">\n" +
    "                            <div class=\"col-md-12\">\n" +
    "                                <label class=\"control-label\">User quota limit</label>\n" +
    "                                <div class=\"input-group\">\n" +
    "                                    <input class=\"form-control\"\n" +
    "                                           ng-model=\"endpoint.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/router'].clientMaxRate\"\n" +
    "                                           id=\"endpoint.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/router'].clientMaxRate\"\n" +
    "                                           name=\"endpoint.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/router'].clientMaxRate\"\n" +
    "                                           type=\"text\">\n" +
    "                                    <div class=\"input-group-addon\">reqs/sec</div>\n" +
    "                                </div>\n" +
    "                                <div class=\"help-block\">\n" +
    "                                    <p ng-hide=\"isInteger(endpoint.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/router'].clientMaxRate)\" class=\"badge label-danger\"><i\n" +
    "                                            class=\"fa fa-warning\"></i> Invalid format</p>\n" +
    "                                    <p>Maximum requests per second you want to allow to each different API user for this\n" +
    "                                        endpoint. Use <code>0</code> for no limitation.</p>\n" +
    "                                </div>\n" +
    "                                <div ng-show=\"0 != endpoint.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/router'].clientMaxRate\">\n" +
    "                                    <p><strong>A unique user is identified by...</strong></p>\n" +
    "                                    <div class=\"input-group\" class=\"form-control\">\n" +
    "                                        <input type=\"radio\" name=\"throttling_decorator\" value=\"ip\"\n" +
    "                                        ng-checked=\"endpoint.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/router'].key==''\"\n" +
    "                                        ng-click=\"endpoint.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/router'].key=''\"\n" +
    "                                        ng-model=\"endpoint.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/router'].strategy\">\n" +
    "                                        Its originating IP\n" +
    "                                      </div>\n" +
    "                                      <div class=\"input-group\" class=\"form-control\">\n" +
    "                                        <input type=\"radio\" name=\"throttling_decorator\" value=\"header\"\n" +
    "                                        ng-checked=\"endpoint.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/router'].key!=''\"\n" +
    "                                        ng-model=\"endpoint.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/router'].strategy\">\n" +
    "                                        A custom header:\n" +
    "                                        <input type=\"text\" ng-model=\"endpoint.extra_config['github.com/devopsfaith/krakend-ratelimit/juju/router'].key\"\n" +
    "                                        placeholder=\"X-TOKEN\">\n" +
    "                                      </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<button class=\"btn btn-lg btn-success\" ng-click=\"addEndpoint()\">Add endpoint</button>\n"
  );


  $templateCache.put('/src/app/html/components/form_logging.html',
    "<div class=\"col-md-6\">\n" +
    "  <div class=\"box box-primary\">\n" +
    "    <div class=\"box-header with-border\">\n" +
    "      <h3 class=\"box-title\">Logging</h3>\n" +
    "    </div>\n" +
    "    <!-- /.box-header -->\n" +
    "    <div class=\"box-body\">\n" +
    "      <p>Choose what is the logging level you would like to see</p>\n" +
    "      <div class=\"form-group\">\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input\n" +
    "            type=\"checkbox\"\n" +
    "            value=\"dns\"\n" +
    "            ng-model=\"service.extra_config['github_com/devopsfaith/krakend-gologging'].syslog\"\n" +
    "            ng-init=\"service.extra_config['github_com/devopsfaith/krakend-gologging'].syslog=false\">\n" +
    "            <strong>Syslog</strong> - Send logs to syslog\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input\n" +
    "            type=\"checkbox\"\n" +
    "            value=\"etcd\"\n" +
    "            ng-model=\"service.extra_config['github_com/devopsfaith/krakend-gologging'].stdout\"\n" +
    "            ng-init=\"service.extra_config['github_com/devopsfaith/krakend-gologging'].stdout=true\">\n" +
    "            <strong>Stdout</strong> - Send logs to standard out\n" +
    "          </label>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">Level</label>\n" +
    "        <div class=\"input-group\">\n" +
    "          <select class=\"form-control\"\n" +
    "          ng-model=\"service.extra_config['github_com/devopsfaith/krakend-gologging'].level\"\n" +
    "          id=\"service.extra_config['github_com/devopsfaith/krakend-gologging'].level\"\n" +
    "          name=\"service.extra_config['github_com/devopsfaith/krakend-gologging'].level\"\n" +
    "          ng-init=\"service.extra_config['github_com/devopsfaith/krakend-gologging'].level='WARNING'\">\n" +
    "\n" +
    "          <option value=\"DEBUG\">DEBUG</option>\n" +
    "          <option value=\"INFO\">INFO</option>\n" +
    "          <option value=\"WARNING\">WARNING</option>\n" +
    "          <option value=\"ERROR\">ERROR</option>\n" +
    "          <option value=\"CRITICAL\">CRITICAL</option>\n" +
    "        </select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"control-label\">Logging prefix</label>\n" +
    "      <div class=\"input-group\">\n" +
    "        <input class=\"form-control\"\n" +
    "        ng-model=\"service.extra_config['github_com/devopsfaith/krakend-gologging'].prefix\"\n" +
    "        id=\"service.extra_config['github_com/devopsfaith/krakend-gologging'].prefix\"\n" +
    "        name=\"service.extra_config['github_com/devopsfaith/krakend-gologging'].prefix\"\n" +
    "        type=\"text\"\n" +
    "        ng-init=\"service.extra_config['github_com/devopsfaith/krakend-gologging'].prefix='[KRAKEND]'\">\n" +
    "      </div>\n" +
    "      <span class=\"help-block\">In case you want to prefix anything before.</span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"col-md-6\">\n" +
    "  <div class=\"box-header with-border\">\n" +
    "      <h3 class=\"box-title\">Metrics</h3>\n" +
    "    </div>\n" +
    "    <!-- /.box-header -->\n" +
    "    <div class=\"box-body\">\n" +
    "      <p>...</p>\n" +
    "      <div class=\"form-group\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('/src/app/html/components/form_oauth.html',
    "<div class=\"box box-primary\">\n" +
    "    <div class=\"box-header with-border\">\n" +
    "        <h3 class=\"box-title\">OAuth settings</h3>\n" +
    "        <div class=\"box-tools pull-right\">\n" +
    "            <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"collapse\"><i class=\"fa fa-minus\"></i></button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- /.box-header -->\n" +
    "    <div class=\"box-body\">\n" +
    "        <p>The OAuth settings are used per backend as every query will require different scopes/settings. Neverthless you\n" +
    "        might want to set some initial settings that will be copied to the specific backend when you check OAuth is required.</p>\n" +
    "\n" +
    "        <oauth data=\"service\"></oauth>\n" +
    "    </div><!-- ./box-body -->\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('/src/app/html/components/form_security.html',
    "\n" +
    "\n" +
    "<div class=\"box box-primary\">\n" +
    "    <div class=\"box-header with-border\">\n" +
    "        <h3 class=\"box-title\">Security headers</h3>\n" +
    "\n" +
    "        <div class=\"box-tools pull-right\">\n" +
    "            <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"collapse\"><i class=\"fa fa-minus\"></i></button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- /.box-header -->\n" +
    "    <div class=\"box-body\">\n" +
    "       <p>The following options enhance the security in your API and are optional. All values set here will be copied\n" +
    "       to new created endpoints. These can override specific configurations later.</p>\n" +
    "\n" +
    "       <security-headers data=\"service\"></security-headers>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/src/app/html/components/form_service_configuration.html',
    "<div class=\"col-md-12\">\n" +
    "  <div class=\"box\">\n" +
    "    <div class=\"box-header with-border\">\n" +
    "      <h3 class=\"box-title\">Service Name</h3>\n" +
    "      <div class=\"box-tools pull-right\">\n" +
    "        <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"collapse\"><i class=\"fa fa-minus\"></i>\n" +
    "        </button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"box-body\">\n" +
    "      <div class=\"form-group form-group-lg\">\n" +
    "        <input class=\"form-control\" id=\"service.name\" name=\"service.name\"\n" +
    "        placeholder=\"My Service\" ng-model=\"service.name\" type=\"text\">\n" +
    "        <span class=\"help-block\">\n" +
    "          A friendly name, title or shot description that will help you identify this service configuration.\n" +
    "        </span>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"col-md-6\">\n" +
    "  <div ng-include src=\"'/src/app/html/components/form_backends.html'\"></div>\n" +
    "<div class=\"box box-primary\">\n" +
    "  <div class=\"box-header with-border\">\n" +
    "    <h3 class=\"box-title\">Throttling and limits</h3>\n" +
    "  </div>\n" +
    "  <!-- /.box-header -->\n" +
    "  <div class=\"box-body\">\n" +
    "    <p>Write here the default limits that will be used across all your endpoints. You can override rate limit and user quota\n" +
    "      per endpoint if needed. <strong>Read more on <a href=\"/docs/throttling/rate-limit\">rate limiting</a></strong></p>\n" +
    "\n" +
    "    <div class=\"form-group\" ng-class=\"isInteger(service.max_idle_connections) ? '' : 'has-error'\">\n" +
    "        <label class=\"control-label\">Maximum IDLE connections per host</label>\n" +
    "\n" +
    "        <input class=\"form-control\"\n" +
    "        ng-model=\"service.max_idle_connections\"\n" +
    "        type=\"text\"\n" +
    "        ng-init=\"service.max_idle_connections=250\">\n" +
    "\n" +
    "        <span class=\"help-block\">Maximum number of IDLE connections that you allow to the same host.\n" +
    "        Defaults to <code>250</code>.\n" +
    "        </span>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\" ng-class=\"isInteger(service.extra_config['krakendesigner']['endpoint_defaults']['github.com/devopsfaith/krakend-ratelimit/juju/router'].maxRate) ? '' : 'has-error'\">\n" +
    "        <label class=\"control-label\">Default endpoint rate limit</label>\n" +
    "        <div class=\"input-group\">\n" +
    "          <input class=\"form-control\"\n" +
    "          ng-model=\"service.extra_config['krakendesigner']['endpoint_defaults']['github.com/devopsfaith/krakend-ratelimit/juju/router'].maxRate\"\n" +
    "          id=\"service.extra_config['krakendesigner']['endpoint_defaults']['github.com/devopsfaith/krakend-ratelimit/juju/router'].maxRate\"\n" +
    "          name=\"service.extra_config['krakendesigner']['endpoint_defaults']['github.com/devopsfaith/krakend-ratelimit/juju/router'].maxRate\"\n" +
    "          type=\"text\"\n" +
    "          ng-init=\"service.extra_config['krakendesigner']['endpoint_defaults']['github.com/devopsfaith/krakend-ratelimit/juju/router'].maxRate=0\">\n" +
    "          <div class=\"input-group-addon\">reqs/sec</div>\n" +
    "        </div>\n" +
    "        <span class=\"help-block\">Maximum requests per second you want to let every endpoint handle. This value will\n" +
    "          be used as a default for all the endpoints you create unless overridden in its specific configuration. Leave <code>0</code> for no default limit.\n" +
    "        </span>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\" ng-class=\"isInteger(service.extra_config['krakendesigner']['endpoint_defaults']['github.com/devopsfaith/krakend-ratelimit/juju/router'].clientMaxRate) ? '' : 'has-error'\">\n" +
    "        <label class=\"control-label\">Default user quota</label>\n" +
    "        <div class=\"input-group\">\n" +
    "          <input class=\"form-control\"\n" +
    "          ng-model=\"service.extra_config['krakendesigner']['endpoint_defaults']['github.com/devopsfaith/krakend-ratelimit/juju/router'].clientMaxRate\"\n" +
    "          id=\"service.extra_config['krakendesigner']['endpoint_defaults']['github.com/devopsfaith/krakend-ratelimit/juju/router'].clientMaxRate\"\n" +
    "          name=\"service.extra_config['krakendesigner']['endpoint_defaults']['github.com/devopsfaith/krakend-ratelimit/juju/router'].clientMaxRate\"\n" +
    "          type=\"text\"\n" +
    "          ng-init=\"service.extra_config['krakendesigner']['endpoint_defaults']['github.com/devopsfaith/krakend-ratelimit/juju/router'].clientMaxRate=0\">\n" +
    "          <div class=\"input-group-addon\">reqs/sec</div>\n" +
    "        </div>\n" +
    "        <span class=\"help-block\">Maximum requests per second you want to allow to each different API user. This\n" +
    "          value will be used as default for all the endpoints unless overridden in each of them. Use <code>0</code>\n" +
    "          for no limitation.\n" +
    "        </span>\n" +
    "        <div ng-show=\"0 != service.extra_config['krakendesigner']['endpoint_defaults']['github.com/devopsfaith/krakend-ratelimit/juju/router'].clientMaxRate\">\n" +
    "          <p><strong>A unique user is identified by...</strong></p>\n" +
    "          <div class=\"input-group\" class=\"form-control\">\n" +
    "            <input type=\"radio\" name=\"throttling_decorator\" value=\"ip\"\n" +
    "            ng-checked=\"service.extra_config['krakendesigner']['endpoint_defaults']['github.com/devopsfaith/krakend-ratelimit/juju/router'].key==''\"\n" +
    "            ng-click=\"service.extra_config['krakendesigner']['endpoint_defaults']['github.com/devopsfaith/krakend-ratelimit/juju/router'].key=''\"\n" +
    "            ng-model=\"service.extra_config['krakendesigner']['endpoint_defaults']['github.com/devopsfaith/krakend-ratelimit/juju/router'].strategy\">\n" +
    "            Its originating IP\n" +
    "          </div>\n" +
    "          <div class=\"input-group\" class=\"form-control\">\n" +
    "            <input type=\"radio\" name=\"throttling_decorator\" value=\"header\"\n" +
    "            ng-checked=\"service.extra_config['krakendesigner']['endpoint_defaults']['github.com/devopsfaith/krakend-ratelimit/juju/router'].key!=''\"\n" +
    "            ng-model=\"service.extra_config['krakendesigner']['endpoint_defaults']['github.com/devopsfaith/krakend-ratelimit/juju/router'].strategy\">\n" +
    "            A custom header:\n" +
    "            <input type=\"text\" ng-model=\"service.extra_config['krakendesigner']['endpoint_defaults']['github.com/devopsfaith/krakend-ratelimit/juju/router'].key\"\n" +
    "            placeholder=\"X-TOKEN\">\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"col-md-6\">\n" +
    "  <div class=\"box box-primary\">\n" +
    "    <div class=\"box-header with-border\">\n" +
    "      <h3 class=\"box-title\">Timeouts and TTL</h3>\n" +
    "    </div>\n" +
    "    <!-- /.box-header -->\n" +
    "    <div class=\"box-body\">\n" +
    "      <p>All settings below are used across all backends unless specifically overridden in each endpoint</p>\n" +
    "\n" +
    "      <p ng-include src=\"'/src/app/html/components/time_units.html'\"></p>\n" +
    "\n" +
    "      <div class=\"form-group\" ng-class=\"isValidTimeUnit(service.timeout) ? '' : 'has-error'\">\n" +
    "        <label class=\"control-label\" for=\"service.timeout\">Backend Timeout</label>\n" +
    "        <input class=\"form-control\"\n" +
    "        id=\"service.timeout\"\n" +
    "        name=\"service.timeout\"\n" +
    "        ng-model=\"service.timeout\"\n" +
    "        placeholder=\"3000ms\"\n" +
    "        ng-init=\"service.timeout='3000ms'\"\n" +
    "        type=\"text\">\n" +
    "        <div class=\"help-block\">\n" +
    "          <p ng-hide=\"isValidTimeUnit(service.timeout)\" ng-include src=\"'/src/app/html/components/time_units.html'\"></p>\n" +
    "          <p>This is the <strong>default timeout</strong> for all the outgoing connections against your\n" +
    "            backends and takes into account the duration of all the pipe. This value can be overridden later on specific endpoints.</p>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\" ng-class=\"isValidTimeUnit(service.read_timeout) ? '' : 'has-error'\">\n" +
    "        <label class=\"control-label\" for=\"service.read_timeout\">HTTP Read Timeout</label>\n" +
    "        <input class=\"form-control\"\n" +
    "        id=\"service.read_timeout\"\n" +
    "        name=\"service.read_timeout\"\n" +
    "        ng-model=\"service.read_timeout\"\n" +
    "        placeholder=\"0s\"\n" +
    "        ng-init=\"service.read_timeout='0s'\"\n" +
    "        type=\"text\">\n" +
    "        <div class=\"help-block\">\n" +
    "          <p ng-hide=\"isValidTimeUnit(service.read_timeout)\" ng-include src=\"'/src/app/html/components/time_units.html'\"></p>\n" +
    "          <p>Maximum duration for reading the entire http request, including the body.</p>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\" ng-class=\"isValidTimeUnit(service.write_timeout) ? '' : 'has-error'\">\n" +
    "        <label class=\"control-label\" for=\"service.write_timeout\">HTTP Write Timeout</label>\n" +
    "        <input class=\"form-control\"\n" +
    "        id=\"service.write_timeout\"\n" +
    "        name=\"service.write_timeout\"\n" +
    "        ng-model=\"service.write_timeout\"\n" +
    "        placeholder=\"0s\"\n" +
    "        ng-init=\"service.write_timeout='0s'\"\n" +
    "        type=\"text\">\n" +
    "        <div class=\"help-block\">\n" +
    "          <p ng-hide=\"isValidTimeUnit(service.write_timeout)\" ng-include src=\"'/src/app/html/components/time_units.html'\"></p>\n" +
    "          <p>Maximum duration before timing out writes of the response</p>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\" ng-class=\"isValidTimeUnit(service.idle_timeout) ? '' : 'has-error'\">\n" +
    "        <label class=\"control-label\" for=\"service.idle_timeout\">HTTP Idle Timeout</label>\n" +
    "        <input class=\"form-control\"\n" +
    "        id=\"service.idle_timeout\"\n" +
    "        name=\"service.idle_timeout\"\n" +
    "        ng-model=\"service.idle_timeout\"\n" +
    "        placeholder=\"0s\"\n" +
    "        ng-init=\"service.idle_timeout='0s'\"\n" +
    "        type=\"text\">\n" +
    "        <div class=\"help-block\">\n" +
    "          <p ng-hide=\"isValidTimeUnit(service.idle_timeout)\" ng-include src=\"'/src/app/html/components/time_units.html'\"></p>\n" +
    "          <p>Maximum amount of time to wait for the next request when keep-alives are enabled\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\" ng-class=\"isValidTimeUnit(service.read_header_timeout) ? '' : 'has-error'\">\n" +
    "        <label class=\"control-label\" for=\"service.read_header_timeout\">HTTP Read Header Timeout</label>\n" +
    "        <input class=\"form-control\"\n" +
    "        id=\"service.read_header_timeout\"\n" +
    "        name=\"service.read_header_timeout\"\n" +
    "        ng-model=\"service.read_header_timeout\"\n" +
    "        placeholder=\"0s\"\n" +
    "        ng-init=\"service.read_header_timeout='0s'\"\n" +
    "        type=\"text\">\n" +
    "        <div class=\"help-block\">\n" +
    "          <p ng-hide=\"isValidTimeUnit(service.read_header_timeout)\" ng-include src=\"'/src/app/html/components/time_units.html'\"></p>\n" +
    "          <p>Amount of time allowed to read request headers</p>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\" ng-class=\"isValidTimeUnit(service.cache_ttl) ? '' : 'has-error'\">\n" +
    "        <label class=\"control-label\" for=\"service.cache_ttl\">Default Cache TTL</label>\n" +
    "          <input\n" +
    "            class=\"form-control\"\n" +
    "            ng-model=\"service.cache_ttl\" type=\"text\"\n" +
    "            placeholder=\"300\"\n" +
    "            ng-init=\"service.cache_ttl='300s'\">\n" +
    "\n" +
    "\n" +
    "        <div class=\"help-block\">\n" +
    "          <p ng-hide=\"isValidTimeUnit(service.cache_ttl)\" ng-include src=\"'/src/app/html/components/time_units.html'\"></p>\n" +
    "          <p ng-hide=\"isInteger(service.cache_ttl)\">Value must be an integer expressing the number of seconds</p>\n" +
    "        </p>\n" +
    "        <p>Time the service considers the origin is still valid. Applies\n" +
    "          to GET requests only. The service does not cache anything but facilitates\n" +
    "        the headers for proxies to do the caching (e.g: Varnish server).</p>\n" +
    "      </div>\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('/src/app/html/components/form_service_discovery.html',
    "<div class=\"col-md-6\">\n" +
    "  <div class=\"box box-primary\">\n" +
    "    <div class=\"box-header with-border\">\n" +
    "      <h3 class=\"box-title\">Enable Service Discovery</h3>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"box-body\">\n" +
    "      <p>Select <strong>all</strong> the service discovery providers you want to enable across all endpoints. You can enable one or multiple service discovery providers and choose which of them are used in each backend query, be an external provider or an API of your own.</p>\n" +
    "      <div class=\"form-group\">\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" disabled=\"disabled\" value=\"static\" ng-model=\"service.sd_providers.providers.static\" ng-init=\"service.sd_providers.providers.static=true\" >\n" +
    "            <strong>Static</strong>/None - No service discovery strategy set. KrakenD will try to resolve directly any DNS entries using the machine resolver.\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"dns\" ng-model=\"service.sd_providers.providers.dns\" >\n" +
    "            <strong>DNS SRV</strong> - Given host names will use a <a href=\"https://en.wikipedia.org/wiki/SRV_record\">SRV record</a> for resolution.\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"etcd\" ng-model=\"service.sd_providers.providers.etcd\" ng-model=\"service.sd_providers.providers.etcd\">\n" +
    "            <strong>Etcd</strong> - Configuration retrieved dynamically from an <code>etcd</code> daemon.\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"custom\" ng-model=\"service.sd_providers.providers.custom\" >\n" +
    "            <strong>Custom</strong> - You can specify your own service discovery namespace (manual addition in the .json file)\n" +
    "          </label>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"box box-primary\" ng-hide=\"!service.sd_providers.providers.etcd\">\n" +
    "    <div class=\"box-header with-border\">\n" +
    "      <h3 class=\"box-title\">Etcd settings</h3>\n" +
    "      <div class=\"box-tools pull-right\">\n" +
    "        <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"collapse\"><i class=\"fa fa-minus\"></i></button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"box-body\">\n" +
    "     <!-- etcd -->\n" +
    "\n" +
    "     <p>List of all the etcd servers you want KrakenD to make use of for host resolution</p>\n" +
    "     <p><code>http(s)://hostname[:port]</code></p>\n" +
    "     <ul class=\"list-unstyled\">\n" +
    "      <li ng-repeat=\"(index,host) in service.extra_config['github_com/devopsfaith/krakend-etcd'].machines\">\n" +
    "        <a class=\"badge badge-remove\" ng-click=\"deleteEtcdMachine(index)\"\n" +
    "        title=\"Click to delete server\"><i class=\"fa fa-times\"></i> {{ host }}</a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <form name=\"addBackend\">\n" +
    "      <div class=\"input-group\">\n" +
    "        <input class=\"form-control\"\n" +
    "        placeholder=\"http://x.x.x.x:4001\"\n" +
    "        type=\"url\"\n" +
    "        id=\"addEtcdMachine\"\n" +
    "        required=\"\">\n" +
    "        <div class=\"input-group-btn\">\n" +
    "          <button type=\"button\" class=\"btn btn-success\" ng-click=\"addEtcdMachine()\"><i\n" +
    "            class=\"fa fa-plus\"></i> Add Etcd machine\n" +
    "          </button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </form>\n" +
    "\n" +
    "\n" +
    "    <div class=\"form-group\" ng-class=\"isValidTimeUnit(service.extra_config['github_com/devopsfaith/krakend-etcd'].dial_timeout) ? '' : 'has-error'\">\n" +
    "      <label class=\"control-label\" for=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].dial_timeout\">Dial Timeout</label>\n" +
    "      <input class=\"form-control\"\n" +
    "      id=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].dial_timeout\"\n" +
    "      ng-model=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].dial_timeout\"\n" +
    "      name=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].dial_timeout\"\n" +
    "      placeholder=\"5s\"\n" +
    "      ng-init=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].dial_timeout='5s'\"\n" +
    "      type=\"text\" />\n" +
    "      <div class=\"help-block\">\n" +
    "        <p ng-hide=\"isValidTimeUnit(service.extra_config['github_com/devopsfaith/krakend-etcd'].dial_timeout)\" ng-include src=\"/src/app/html/components/time_units.html\"></p>\n" +
    "        <p>Dial timeout includes name resolution.</p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\" ng-class=\"isValidTimeUnit(service.extra_config['github_com/devopsfaith/krakend-etcd'].dial_keepalive) ? '' : 'has-error'\">\n" +
    "      <label class=\"control-label\" for=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].dial_keepalive\">Dial Keep Alive</label>\n" +
    "      <input class=\"form-control\"\n" +
    "      id=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].dial_keepalive\"\n" +
    "      ng-model=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].dial_keepalive\"\n" +
    "      name=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].dial_keepalive\"\n" +
    "      placeholder=\"30s\"\n" +
    "      ng-init=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].dial_keepalive='30s'\"\n" +
    "      type=\"text\" />\n" +
    "      <div class=\"help-block\">\n" +
    "        <p ng-hide=\"isValidTimeUnit(service.extra_config['github_com/devopsfaith/krakend-etcd'].dial_keepalive)\" ng-include src=\"/src/app/html/components/time_units.html\"></p>\n" +
    "\n" +
    "        <p>KeepAlive specifies the keep-alive period for an active network connection. If zero, keep-alives are not enabled.</p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\" ng-class=\"isValidTimeUnit(service.extra_config['github_com/devopsfaith/krakend-etcd'].header_timeout) ? '' : 'has-error'\">\n" +
    "      <label class=\"control-label\" for=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].header_timeout\">Timeout per request</label>\n" +
    "      <input class=\"form-control\"\n" +
    "      id=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].header_timeout\"\n" +
    "      ng-model=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].header_timeout\"\n" +
    "      name=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].header_timeout\"\n" +
    "      placeholder=\"1s\"\n" +
    "      ng-init=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].header_timeout='1s'\"\n" +
    "      type=\"text\" />\n" +
    "      <div class=\"help-block\">\n" +
    "        <p ng-hide=\"isValidTimeUnit(service.extra_config['github_com/devopsfaith/krakend-etcd'].header_timeout)\" ng-include src=\"/src/app/html/components/time_units.html\"></p>\n" +
    "        <p>Header sent to determine the maximum timeout per request</p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"control-label\" for=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].cert\">Certificate</label>\n" +
    "      <input class=\"form-control\"\n" +
    "      id=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].cert\"\n" +
    "      ng-model=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].cert\"\n" +
    "      name=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].cert\"\n" +
    "      placeholder=\"/path/to/file\"\n" +
    "      type=\"text\" />\n" +
    "      <div class=\"help-block\">\n" +
    "        <p>Absolute path to the certificate</p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"control-label\" for=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].key\">Private key</label>\n" +
    "      <input class=\"form-control\"\n" +
    "      id=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].key\"\n" +
    "      ng-model=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].key\"\n" +
    "      name=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].key\"\n" +
    "      placeholder=\"/path/to/file\"\n" +
    "      type=\"text\" />\n" +
    "      <div class=\"help-block\">\n" +
    "        <p>Absolute path to the private key</p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"control-label\" for=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].cacert\">CA Cert</label>\n" +
    "      <input class=\"form-control\"\n" +
    "      id=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].cacert\"\n" +
    "      ng-model=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].cacert\"\n" +
    "      name=\"service.extra_config['github_com/devopsfaith/krakend-etcd'].cacert\"\n" +
    "      placeholder=\"/path/to/file\"\n" +
    "      type=\"text\" />\n" +
    "      <div class=\"help-block\">\n" +
    "        <p>Absolute path to the CA Cert</p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  <!-- /etcd -->\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"col-md-6\">\n" +
    "  <div ng-include src=\"/src/app/html/components/form_backends.html\"></div>\n" +
    "</div>\n"
  );


  $templateCache.put('/src/app/html/components/sidebar.html',
    "<!-- Sidebar Menu -->\n" +
    "<ul class=\"sidebar-menu\">\n" +
    "    <li class=\"header\">Navigation</li>\n" +
    "    <li class=\"active\">\n" +
    "        <a href=\"/#/\"><i class=\"fa fa-dashboard\"></i> <span>Dashboard</span></a>\n" +
    "    </li>\n" +
    "    <li>\n" +
    "        <a href=\"/#/service\"><i class=\"fa fa-wrench\"></i> <span>Service configuration</span>\n" +
    "            <span ng-if=\"service.sd_providers.hosts.length === 0 || !service.sd_providers.hosts\" class=\"pull-right-container\" data-toggle=\"tooltip\"\n" +
    "                  data-original-title=\"No backends configured yet!\">\n" +
    "                    <i class=\"fa fa-warning pull-right icon-warning\"></i>\n" +
    "            </span>\n" +
    "        </a>\n" +
    "    </li>\n" +
    "    <li>\n" +
    "        <a href=\"/#/service-discovery\"><i class=\"fa fa-connectdevelop\"></i> <span>Service Discovery and hosts</span></a>\n" +
    "    </li>\n" +
    "    <li class=\"treeview\"><a href=\"/#/endpoints\"><i class=\"fa fa-gear\"></i> <span>Endpoints</span>\n" +
    "        <span class=\"pull-right-container\">\n" +
    "                    <i class=\"fa fa-angle-left pull-right\"></i>\n" +
    "                </span>\n" +
    "    </a>\n" +
    "        <ul class=\"treeview-menu menu-open\">\n" +
    "            <li ng-repeat=\"endpoint in service.endpoints\">\n" +
    "                <a href=\"/#/endpoints\"><i class=\"fa fa-circle-o }}\"></i> {{ endpoint.endpoint }}\n" +
    "                    <span class=\"pull-right-container\">\n" +
    "                            <i class=\"fa fa-angle-left pull-right\"></i>\n" +
    "                        </span>\n" +
    "                </a>\n" +
    "                <ul class=\"treeview-menu menu-open\">\n" +
    "                    <li ng-repeat=\"backend in endpoint.backend\">\n" +
    "                        <a><i class=\"fa fa-arrow-right\"></i> {{ backend.url_pattern }}</a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "\n" +
    "            </li>\n" +
    "\n" +
    "        </ul>\n" +
    "\n" +
    "\n" +
    "    </li>\n" +
    "    <li class=\"treeview\">\n" +
    "        <a><i class=\"fa fa-shield\"></i> <span>Security options</span>\n" +
    "            <span class=\"pull-right-container\">\n" +
    "              <i class=\"fa fa-angle-left pull-right\"></i>\n" +
    "            </span>\n" +
    "        </a>\n" +
    "        <ul class=\"treeview-menu\">\n" +
    "            <li><a href=\"/#/oauth\"><i class=\"fa fa-user-secret\"></i>OAuth</a></li>\n" +
    "            <li><a href=\"/#/security\"><i class=\"fa fa-key\"></i>Security headers</a></li>\n" +
    "        </ul>\n" +
    "    </li>\n" +
    "    <li>\n" +
    "        <a href=\"/#/logging\"><i class=\"fa fa-area-chart\"></i> <span>Logging and metrics</span></a>\n" +
    "    </li>\n" +
    "    <li><a href=\"/docs/overview/introduction\"><i class=\"fa fa-book\"></i> <span>Documentation</span></a>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "\n" +
    "<hr/>\n" +
    "\n" +
    "<ul class=\"sidebar-menu\">\n" +
    "    <li>\n" +
    "        <a  ng-click=\"save()\"\n" +
    "            data-toggle=\"tooltip\"\n" +
    "            data-original-title=\"Save configuration!\"><i class=\"fa fa-save\"></i> <span>Save</span>\n" +
    "        </a>\n" +
    "    </li>\n" +
    "</ul>\n"
  );


  $templateCache.put('/src/app/html/components/time_units.html',
    "<strong>Valid time units are:</strong>\n" +
    "<code><abbr title=\"Nanoseconds\">ns</abbr></code>,\n" +
    "<code><abbr title=\"Microseconds\">us</abbr></code>, (or <code>µs</code>),\n" +
    "<code><abbr title=\"Milliseconds\">ms</abbr></code>,\n" +
    "<code><abbr title=\"Seconds\">s</abbr></code>,\n" +
    "<code><abbr title=\"Minutes\">m</abbr></code>,\n" +
    "<code><abbr title=\"Hours\">h</abbr></code>\n"
  );

}]);
