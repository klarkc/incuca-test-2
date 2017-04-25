function TodoService(http) {
  this.tasks = [];
  var service = this;

  var responseHandler = function(res) {
    // Remember to not overwrite tasks reference, aleays update contents instead
    service.tasks.length = 0;
    service.tasks.push.apply(service.tasks, res.data);
  };

  var errorHandler = function(errorCallback) {
    return function(res) {
      errorCallback(new Error(res.data || res.statusText));
    };
  };

  service.addTask = function (text, errorCallback) {
    http.post('/api', {text: text}).then(responseHandler, errorHandler(errorCallback));
  }

  service.archiveTask = function (task, errorCallback) {
    http.delete('/api/' + task._id).then(responseHandler, errorHandler(errorCallback));
  }

  service.refreshTasks = function(errorCallback) {
    http.get('/api').then(responseHandler, errorHandler);
  }

  return service;
}

angular.module('todo').factory('todoService', ['$http', TodoService]);
