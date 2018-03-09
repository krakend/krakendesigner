// Drag and drop
function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var f = files[0];

    if (!f.type.match('application/json')) {
        return;
    }

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function (theFile) {
        return function (e) {

            injectInAngularScope( 'service_configuration_title', [
                theFile.name,
                ' (',
                theFile.size, ' bytes, last modified: ',
                theFile.lastModifiedDate ? theFile.lastModifiedDate.toLocaleDateString() : 'n/a',
                ')'
            ].join(''));

            injectInAngularScope( 'service_configuration', e.target.result);
        };
    })(f);

    reader.readAsText(f);
    $('#dropzone_modal').modal();
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

function injectInAngularScope(attribute, value){
    var appElement = document.querySelector('[ng-app=KrakenDesigner]');
    var $scope = angular.element(appElement).scope();
    $scope.$apply(function() {
        $scope[attribute] = value;
    });
}

// Setup the listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);