import moment from 'moment';
import shortId from 'shortid';

const initialState = {
  current: {
    title: 'SomeRoadmap',
    startDate: moment('2018-06-01'),
    endDate: moment('2018-08-31'),
    categories: [
      {
        id: '1',
        title: 'Mobile',
        color: 'red'
      },
      {
        id: '2',
        title: 'Web',
        color: 'orange'
      },
      {
        id: '3',
        title: 'Design',
        color: 'lime'
      }
    ],
    tasks: [
      { id: '4', title: 'Do mobile', category: '1', startDate: moment('2018-06-01'), endDate: moment().add(5, 'days') },
      { id: '5', title: 'Compile', category: '1', startDate: moment().add(5, 'days'), endDate: moment().add(15, 'days') },
      { id: '6', title: 'Deploy', category: '1', startDate: moment(), endDate: moment().add(5, 'days') },
      { id: '7', title: 'Do web', category: '2', startDate: moment(), endDate: moment().add(5, 'days') },
      { id: '8', title: 'Deploy', category: '2', startDate: moment(), endDate: moment().add(5, 'days') },
      { id: '9', title: 'How to design?', category: '3', startDate: moment(), endDate: moment().add(5, 'days') }
    ]
  },
  editTaskId: null,
  previewTaskId: null
};

const getters = {
  tasksByCategory: state => categoryId => state.current.tasks.filter(t => t.category === categoryId),
  roadmapMonths: (state) => {
    const months = [];
    const start = moment(state.current.startDate).startOf('month');
    const end = moment(state.current.endDate).endOf('month');

    while (start.isSameOrBefore(end)) {
      months.push(start.format('MMM YYYY'));
      start.add(1, 'month');
    }

    return months;
  },
  taskToEdit: (state) => {
    if (!state.editTaskId) {
      return null;
    }

    const task = state.current.tasks.find(t => t.id === state.editTaskId);
    return {
      ...task,
      startDate: task.startDate.toDate(),
      endDate: task.endDate.toDate()
    };
  },
  taskToPreview: (state) => {
    if (!state.previewTaskId) {
      return null;
    }

    const task = state.current.tasks.find(t => t.id === state.previewTaskId);
    return {
      ...task,
      category: state.current.categories.find(c => c.id === task.category)
    };
  },
  roadmapTimeFrame: state => ({
    startDate: state.current.startDate,
    endDate: state.current.endDate
  })
};

const actions = {
  saveTask({ state, commit }, task) {
    const item = state.current.tasks.find(t => t.id === task.id);

    if (!item) {
      commit('mAddTask', task);
    } else {
      commit('mUpdateTask', task);
    }
    // example to commit action to another module
    // commit('products/decrementProductInventory', { id: product.id }, { root: true })
  },
  editTask({ state, commit }, { taskId, modal }) {
    if (taskId) {
      modal.show('addTask');
      modal.hide('previewTask');
    } else if (state.previewTaskId) {
      modal.show('previewTask');
    }
    commit('mEditTask', taskId);
  },
  previewTask({ commit }, { taskId, modal }) {
    if (taskId) {
      modal.show('previewTask');
    }
    commit('mPreviewTask', taskId);
  }
};

const mutations = {
  mAddTask(state, task) {
    state.current.tasks.push({
      ...task,
      id: shortId.generate()
    });
  },
  mUpdateTask(state, task) {
    const i = state.current.tasks.findIndex(t => t.id === task.id);
    state.current.tasks = [
      ...state.current.tasks.slice(0, i),
      task,
      ...state.current.tasks.slice(i + 1)
    ];
  },
  mEditTask(state, taskId) {
    state.editTaskId = taskId;
  },
  mPreviewTask(state, taskId) {
    state.previewTaskId = taskId;
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};
