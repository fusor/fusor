module.exports = function(app) {
  var express = require('express');
  var foremanTasksRouter = express.Router();

  var foremanTasks = [
       {
          id: "db25a76f-e344-48ba-ac77-f29303586dbe",
          type: "ForemanTasks::Task::DynflowTask",
          label: "Actions::Fusor::Deploy",
          started_at: "2015-04-07 18:16:55",
          ended_at: null,
          state: "running",
          result: "success",
          progress: 1,
          external_id: "4f7ca3e7-8828-46df-a6f1-e6b07964efb1",
          parent_task_id: null
       },
       {
          id: "aaaaa76f-e344-48ba-ac77-f29303586dbe",
          type: "ForemanTasks::Task::DynflowTask",
          label: "Actions::Fusor::Deploy",
          started_at: "2015-04-14 12:31:46",
          ended_at: null,
          state: "paused",
          result: "error",
          external_id: "4f7ca3e7-8828-46df-a6f1-e6b07964efb1",
          parent_task_id: null
       },
       {
          id: "55fe84db-4a95-462c-83dd-704a08d3d8fe",
          type: "ForemanTasks::Task::DynflowTask",
          label: "Actions::Candlepin::ListenOnCandlepinEvents",
          started_at: "2015-04-07 18:16:55",
          ended_at: null,
          state: "paused",
          result: "pending",
          external_id: "9ed42d73-8621-4ebd-acdc-af84a52cbd9f",
          parent_task_id: null
       }
  ];


  foremanTasksRouter.get('/', function(req, res) {
    res.send({
      'foreman_tasks': foremanTasks
    });
  });

  foremanTasksRouter.get('/:id', function(req, res) {
    res.send({
      'foreman_task': {
          id: req.params.id,
          type: "ForemanTasks::Task::DynflowTask",
          label: "Actions::Fusor::Deploy",
          started_at: "2015-04-07 18:16:55",
          ended_at: null,
          state: "running",
          result: "success",
          progress: 1,
          external_id: "4f7ca3e7-8828-46df-a6f1-e6b07964efb1",
          parent_task_id: null
      }
    });
  });

  app.use('/api/v21/foreman_tasks', foremanTasksRouter);
};
