function TodoService(http) {
  this.tasks = [];
  var service = this;

  var responseHandler = function(res) {
    if(res.data.error) throw res.data.error;

    // Remember to not overwrite tasks reference, aleays update contents instead
    service.tasks.length = 0;
    service.tasks.push.apply(service.tasks, res.data);
  };

  var errorHandler = function(errorCallback) {
    return function(res) {
      if(res.data.error) {
        errorCallback(error.data.error);
        return;
      }

      errorCallback(new Error(res.data || res.statusText));
    };
  };

  service.addTask = function (text, errorCallback) {
    http.post('/api', {text: text}).then(responseHandler).catch(errorCallback);
  }

  service.archiveTask = function (task, errorCallback) {
    http.delete('/api/' + task._id).then(responseHandler).catch(errorCallback);
  }

  service.refreshTasks = function(errorCallback) {
    http.get('/api').then(responseHandler).catch(errorCallback);
  }

  service.updateTask = function(task, errorCallback) {
    http.post('/api/' + task._id, task).then(responseHandler).catch(errorCallback);
  }

  return service;
}

angular.module('todo').factory('todoService', ['$http', TodoService]);
