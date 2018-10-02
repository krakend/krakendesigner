angular.module("KrakenDesigner").directive("dropBox", function() {
  return {
    restrict: "A",
    scope: {
      file: "=",
      data: "="
    },
    link: function(scope, element, attrs) {
      var checkSize, isTypeValid, processDragOverOrEnter, validMimeTypes;
      processDragOverOrEnter = function(event) {
        if (event != null) {
          event.preventDefault();
        }
        event.dataTransfer.effectAllowed = "copy";
        return false;
      };
      validMimeTypes = attrs.dropBox;
      checkSize = function(size) {
        return true;
      };
      isTypeValid = function(type) {
        if (
          validMimeTypes === void 0 ||
          validMimeTypes === "" ||
          validMimeTypes.indexOf(type) > -1
        ) {
          return true;
        } else {
          alert(
            "Invalid file type.  File must be one of following types " +
              validMimeTypes
          );
          return false;
        }
      };
      element.bind("dragover", processDragOverOrEnter);
      element.bind("dragenter", processDragOverOrEnter);
      return element.bind("drop", function(event) {
        var file, name, reader, size, type;
        if (event != null) {
          event.preventDefault();
        }
        reader = new FileReader();
        reader.onload = function(evt) {
          if (checkSize(size) && isTypeValid(type)) {
            return scope.$apply(function() {
              scope.file = evt.target.result;
              //if (angular.isString(scope.data)) {
              //  return (scope.data = name);
              //}

              scope.file = name;
              scope.data = evt.target.result;
              // Show modal with data
              $("#dropzone_modal").modal();
            });
          }
        };
        file = event.dataTransfer.files[0];
        name = file.name;
        type = file.type;
        size = file.size;
        reader.readAsText(file);

        return false;
      });
    }
  };
});
