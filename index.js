
'use striiiict';

//core
const util = require('util');

//project
const events = require('suman/events');

////////////////////////////////////////////////////////////////////////

function noop () {}

function logDebug () {
  var debug;
  if (debug = process.env.SUMAN_DEBUG === 'yes') {
    const args = Array.prototype.slice.call(arguments).filter(i => i);
    args.forEach(function (a) {
      process.stderr.write(typeof a === 'string' ? a : util.inspect(a));
    });
  }
  return debug;
}

function onAnyEvent (data, value) {
  // if (!logDebug.apply(null, arguments)) {
  //   process.stdout.write(data);
  // }

  console.log('turtles!!');
}

function onVerboseEvent (data, value) {
  if (!logDebug.apply(null, arguments)) {
    if (global.sumanOpts.verbose) {
      process.stdout.write(data);
    }
  }
}

function onError (data, value) {
  if (!logDebug.apply(null, arguments)) {
    process.stderr.write(data);
  }
}

module.exports = s => {

  //on error
  s.on(events.RUNNER_EXIT_CODE_GREATER_THAN_ZERO, noop);

  //on any event
  s.on(events.FILE_IS_NOT_DOT_JS, onAnyEvent);
  s.on(events.RUNNER_INITIAL_SET, onAnyEvent);
  s.on(events.RUNNER_OVERALL_SET, onAnyEvent);
  s.on(events.RUNNER_ASCII_LOGO, onAnyEvent);
  s.on(events.FATAL_TEST_ERROR, onAnyEvent);
  s.on(events.TEST_CASE_FAIL, onAnyEvent);
  s.on(events.TEST_CASE_PASS, onAnyEvent);
  s.on(events.TEST_CASE_SKIPPED, onAnyEvent);
  s.on(events.TEST_CASE_STUBBED, onAnyEvent);
  s.on(events.RUNNER_EXIT_SIGNAL, onAnyEvent);
  s.on(events.RUNNER_EXIT_CODE, onAnyEvent);

  //on verbose
  s.on(events.FILENAME_DOES_NOT_MATCH_ANY, onVerboseEvent);
  s.on(events.FILENAME_DOES_NOT_MATCH_NONE, onVerboseEvent);
  s.on(events.FILENAME_DOES_NOT_MATCH_ALL, onVerboseEvent);
  s.on(events.RUNNER_HIT_DIRECTORY_BUT_NOT_RECURSIVE, onVerboseEvent);

  //ignore these
  s.on(events.RUNNER_STARTED, noop);
  s.on(events.RUNNER_ENDED, noop);
  s.on('suite-skipped', noop);
  s.on('suite-end', noop);
  s.on('test-end', noop);
  s.on(events.RUNNER_EXIT_CODE_IS_ZERO, noop);

  s.on(events.RUNNER_TEST_PATHS_CONFIRMATION, function () {
    if (!global.sumanOpts.sparse || utils.isSumanDebug()) {
      onAnyEvent.apply(null, arguments);
    }
  });

  s.on(events.RUNNER_RESULTS_TABLE, function () {
    if (!global.sumanOpts.no_tables || utils.isSumanDebug()) {
      onAnyEvent.apply(null, arguments);
    }
  });

  s.on(events.RUNNER_RESULTS_TABLE_SORTED_BY_MILLIS, function () {
    if (!global.sumanOpts.no_tables || utils.isSumanDebug()) {
      onAnyEvent.apply(null, arguments);
    }
  });

  s.on(events.RUNNER_OVERALL_RESULTS_TABLE, function () {
    if (!global.sumanOpts.no_tables || utils.isSumanDebug()) {
      onAnyEvent.apply(null, arguments);
    }
  });
};