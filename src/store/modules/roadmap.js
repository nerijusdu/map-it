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
      { id: '4', title: 'Do mobile', category: '1' },
      { id: '5', title: 'Compile', category: '1' },
      { id: '6', title: 'Deploy', category: '1' },
      { id: '7', title: 'Do web', category: '2' },
      { id: '8', title: 'Deploy', category: '2' },
      { id: '9', title: 'How to design?', category: '3' }
    ]
  }
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
  }
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
    state.current.tasks.$set(i, task);
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};
