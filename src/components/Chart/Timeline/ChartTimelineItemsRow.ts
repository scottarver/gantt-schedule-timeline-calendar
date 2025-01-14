/**
 * ChartTimelineItemsRow component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

/**
 * Bind element action
 * @param {Element} element
 * @param {any} data
 * @returns {object} with update and destroy
 */
const bindElementAction = (element, data) => {
  data.state.update(
    '_internal.elements.chart-timeline-items-rows',
    rows => {
      if (typeof rows === 'undefined') {
        rows = [];
      }
      rows.push(element);
      return rows;
    },
    { only: null }
  );
  return {
    update() {},
    destroy(element) {
      data.state.update('_internal.elements.chart-timeline-items-rows', rows => {
        return rows.filter(el => el !== element);
      });
    }
  };
};

const ChartTimelineItemsRow = (vido, props) => {
  const { api, state, onDestroy, Detach, Actions, update, html, onChange, reuseComponents, StyleMap } = vido;
  const actionProps = { ...props, api, state };
  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartTimelineItemsRow', value => (wrapper = value)));

  const ItemComponent = state.get('config.components.ChartTimelineItemsRowItem');

  let itemsPath = `_internal.flatTreeMapById.${props.row.id}._internal.items`;
  let rowSub, itemsSub;

  let element,
    scrollLeft,
    styleMap = new StyleMap({ width: '', height: '' }, true);
  let itemComponents = [];

  let shouldDetach = false;
  const detach = new Detach(() => shouldDetach);

  const updateDom = () => {
    const chart = state.get('_internal.chart');
    //const compensation = state.get('config.scroll.compensation');
    shouldDetach = false;
    const xCompensation = api.getCompensationX();
    styleMap.style.width = chart.dimensions.width + xCompensation + 'px';
    if (!props) {
      shouldDetach = true;
      return;
    }
    styleMap.style.height = props.row.height + 'px';
    //styleMap.style.top = props.row.top + compensation + 'px';
    styleMap.style['--row-height'] = props.row.height + 'px';
    if (element && scrollLeft !== chart.time.leftPx) {
      element.scrollLeft = chart.time.leftPx;
      scrollLeft = chart.time.leftPx;
    }
  };

  const updateRow = row => {
    itemsPath = `_internal.flatTreeMapById.${row.id}._internal.items`;
    if (typeof rowSub === 'function') {
      rowSub();
    }
    if (typeof itemsSub === 'function') {
      itemsSub();
    }
    rowSub = state.subscribe('_internal.chart', (bulk, eventInfo) => {
      updateDom();
      update();
    });
    itemsSub = state.subscribe(itemsPath, value => {
      itemComponents = reuseComponents(itemComponents, value, item => ({ row, item }), ItemComponent);
      updateDom();
      update();
    });
  };

  /**
   * On props change
   * @param {any} changedProps
   */
  const onPropsChange = (changedProps, options) => {
    if (options.leave) {
      updateDom();
      return update();
    }
    props = changedProps;
    for (const prop in props) {
      actionProps[prop] = props[prop];
    }
    updateRow(props.row);
  };
  onChange(onPropsChange);

  onDestroy(() => {
    itemsSub();
    rowSub();
    itemComponents.forEach(item => item.destroy());
  });

  const componentName = 'chart-timeline-items-row';
  const componentActions = api.getActions(componentName);
  let className;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName, props);
      update();
    })
  );

  if (!componentActions.includes(bindElementAction)) {
    componentActions.push(bindElementAction);
  }

  const actions = Actions.create(componentActions, actionProps);

  return templateProps => {
    return wrapper(
      html`
        <div detach=${detach} class=${className} data-actions=${actions} style=${styleMap}>
          ${itemComponents.map(i => i.html())}
        </div>
      `,
      { props, vido, templateProps }
    );
  };
};

export default ChartTimelineItemsRow;
