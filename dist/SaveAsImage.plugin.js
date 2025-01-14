(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.SaveAsImage = factory());
}(this, (function () { 'use strict';

  /**
   * SaveAsImage plugin
   *
   * @copyright Rafal Pospiech <https://neuronet.io>
   * @author    Rafal Pospiech <neuronet.io@gmail.com>
   * @package   gantt-schedule-timeline-calendar
   * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
   * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
   */
  // @ts-nocheck
  function SaveAsImage(options = {}) {
      const defaultOptions = {
          style: 'font-family: sans-serif;',
          filename: 'gantt-schedule-timeline-calendar.jpeg'
      };
      options = Object.assign(Object.assign({}, defaultOptions), { options });
      function downloadImage(data, filename) {
          const a = document.createElement('a');
          a.href = data;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
      }
      function saveAsImage(ev) {
          const element = ev.target;
          const width = element.clientWidth;
          const height = element.clientHeight;
          const html = unescape(encodeURIComponent(element.outerHTML));
          let style = '';
          for (const styleSheet of document.styleSheets) {
              if (styleSheet.title === 'gstc') {
                  for (const rule of styleSheet.rules) {
                      style += rule.cssText;
                  }
              }
          }
          style = `<style>* {${options.style}} ${style}</style>`;
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <foreignObject x="0" y="0" width="${width}" height="${height}">
        <div xmlns="http://www.w3.org/1999/xhtml">
          ${style}
          ${html}
        </div>
      </foreignObject>
    </svg>`;
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, width, height);
          const svg64 = 'data:image/svg+xml;base64,' + btoa(svg);
          const img = new Image();
          img.onload = function onLoad() {
              ctx.drawImage(img, 0, 0);
              const jpeg = canvas.toDataURL('image/jpeg', 1.0);
              downloadImage(jpeg, options.filename);
          };
          img.src = svg64;
      }
      return function initialize(vido) {
          vido.state.subscribe('_internal.elements.main', main => {
              if (main) {
                  main.addEventListener('save-as-image', saveAsImage);
              }
          });
      };
  }

  return SaveAsImage;

})));
//# sourceMappingURL=SaveAsImage.plugin.js.map
