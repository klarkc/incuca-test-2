function TodoController(dialog, todoService, scope) {
  var controller = this;

  this.tasks = todoService.tasks;

  controller.addTaskHandler = function(evt) {
    var addDialog = dialog.prompt()
      .title('Adicionar tarefa')
      .placeholder('Digite a tarefa')
      .ariaLabel('Tarefa')
      .targetEvent(evt)
      .ok('Salvar')
      .cancel('Cancelar');

    dialog.show(addDialog).then(function(text) {
      todoService.addTask(text, controller.getErrorCallback('salvar tarefa', evt));
    }, function(){});
  }

  controller.archiveTaskHandler = function(task, evt) {
    var cnfDialog = dialog.confirm()
      .title('Deseja arquivar a tarefa?')
      .textContent('Tem certeza que deseja arquivar a tarefa: ' + task.text + '?')
      .ariaLabel('Arquivamento da Tarefa')
      .targetEvent(evt)
      .ok('Sim')
      .cancel('Não');

    dialog.show(cnfDialog).then(function(){
      todoService.archiveTask(task, controller.getErrorCallback('arquivar tarefa', evt));
    }, function() {});
  }

  controller.getErrorCallback = function(action, evt) {
    var errorDialog = dialog.alert()
      .clickOutsideToClose(true)
      .title('Erro ao ' + action)
      .ok('Ok')
      .targetEvent(evt)
      .ariaLabel('Erro ao' + action);

    return function(error) {
      errorDialog.textContent(error.message);
      dialog.show(errorDialog);
    }
  }

  // Setup Watchers
  var watchTasks = function(tasks, _, scope) {
    tasks.forEach(function(task){
      // For Each new task of the collection, setup the update listener
      scope.$watch(function(){return task;}, function(changedTask, originalTask) {
        if(changedTask === originalTask) return;
        todoService.updateTask(
          changedTask,
          controller.getErrorCallback('atualizar tarefa')
        );
      }, true);
    });
  };
  // Setup a listener to controller.tasks array
  scope.$watchCollection(function(){return controller.tasks;}, watchTasks);

  // Initial Tasks Load
  todoService.refreshTasks(controller.getErrorCallback('carregar tarefas'));

  // Setup refresh every 15s
  window.setInterval(todoService.refreshTasks.bind(todoService), 15000);
}

angular.module('todo').controller('TodoController', ['$mdDialog', 'todoService', '$scope', TodoController]);
