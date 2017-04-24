function TodoService(http) {
  var service = this;

  var tasks = service.tasks = [];

  var responseHandler = function(res) {
    tasks.splice(0, tasks.length);
    res.data.forEach(function(task) {
      tasks[task.uid] = task;
    });
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
    http.delete('/api/' + task.uid).then(responseHandler, errorHandler(errorCallback));
  }

  service.refreshTasks = function(errorCallback) {
    http.get('/api').then(responseHandler, errorHandler);
  }

  return service;
}

angular.module('todo').factory('todoService', ['$http', TodoService]);
