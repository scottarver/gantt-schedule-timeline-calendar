(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.DependencyLines = factory());
}(this, (function () { 'use strict';

  /**
   * DependencyLines plugin
   *
   * @copyright Rafal Pospiech <https://neuronet.io>
   * @author    Rafal Pospiech <neuronet.io@gmail.com>
   * @package   gantt-schedule-timeline-calendar
   * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
   * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
   */
  function DependencyLines(options = {}) {
      return function initialize(vido) {
          const state = vido.state;
          const api = vido.api;
          state.update('config.wrappers.ChartTimelineGrid', wrapper => {
              return function DependencyLinesWrapper(input, data) {
                  const lines = [];
                  const items = state.get('config.chart.items');
                  const output = data.vido.html `${input}<div class=${api.getClass('chart-timeline-dependency-lines')}>${lines}</div>`;
                  return wrapper(output, data);
              };
          });
      };
  }

  return DependencyLines;

})));
//# sourceMappingURL=DependencyLines.plugin.js.map
