import moment from 'moment';
import { mutations, actions, getters } from '@/store/modules/roadmap';
import { roadmapMonthFormat } from '@/constants';
import getMockForAction from '../mocks/store-action';
import getModalMock from '../mocks/modal';

describe('Roadmap mutations', () => {
  it('mAddTask', () => {
    const title = 'TestTaskTitle1';
    const state = { current: { tasks: [] } };
    const task = { title };

    mutations.mAddTask(state, task);

    const foundTask = state.current.tasks.find(x => x.title === title);

    expect(foundTask).toBeDefined();
  });

  it('mUpdateTask', () => {
    const newTitle = 'TestTaskTitle2';
    const state = { current: { tasks: [
      {
        id: 1,
        title: 'OldTitle'
      }
    ] } };
    const task = { id: 1, title: newTitle };

    mutations.mUpdateTask(state, task);

    const updatedTask = state.current.tasks.find(x => x.id === 1);

    expect(updatedTask.title).toBe(newTitle);
  });

  it('mAddCategory', () => {
    const title = 'TestTaskTitle1';
    const state = { current: { categories: [] } };
    const category = { title };

    mutations.mAddCategory(state, category);

    const foundCategory = state.current.categories.find(x => x.title === title);

    expect(foundCategory).toBeDefined();
  });

  it('mUpdateCategory', () => {
    const newTitle = 'TestTaskTitle2';
    const state = { current: { categories: [
      {
        id: 1,
        title: 'OldTitle'
      }
    ] } };
    const category = { id: 1, title: newTitle };

    mutations.mUpdateCategory(state, category);

    const updatedCategory = state.current.categories.find(x => x.id === 1);

    expect(updatedCategory.title).toBe(newTitle);
  });

  it('mEditTask', () => {
    const state = { editTaskId: 1 };

    mutations.mEditTask(state, 2);

    expect(state.editTaskId).toBe(2);
  });

  it('mPreviewTask', () => {
    const state = { previewTaskId: 1 };

    mutations.mPreviewTask(state, 2);

    expect(state.previewTaskId).toBe(2);
  });
});

describe('Roadmap actions', () => {
  it('saveTask > should add new task', () => {
    const task = {
      id: '',
      title: 'TestTitle'
    };
    const mock = getMockForAction({ current: { tasks: [] } }, 'mAddTask', task);

    actions.saveTask(mock, task);
  });

  it('saveTask > should update existing task', () => {
    const task = {
      id: 1,
      title: 'TestTitle'
    };
    const mock = getMockForAction({ current: { tasks: [
      {
        id: 1,
        title: 'OldTitle'
      }
    ] } }, 'mUpdateTask', task);

    actions.saveTask(mock, task);
  });

  it('editTask > should call mEditTask', () => {
    const taskId = 123;
    const mock = getMockForAction({}, 'mEditTask', taskId);
    const modal = getModalMock();

    actions.editTask(mock, { taskId, modal });
  });

  it('editTask > should show addTask modal and hide previewTask modal', () => {
    const taskId = 123;
    const mock = getMockForAction({});
    const modal = getModalMock('addTask', 'previewTask');

    actions.editTask(mock, { taskId, modal });

    modal.checkIfMethodsCalled();
  });

  it('editTask > should show previewTask modal', () => {
    const taskId = null;
    const mock = getMockForAction({ previewTaskId: 1 });
    const modal = getModalMock('previewTask');

    actions.editTask(mock, { taskId, modal });

    modal.checkIfMethodsCalled();
  });

  it('editTask > no modal calls should be made', () => {
    const taskId = null;
    const mock = getMockForAction({});
    const modal = getModalMock();

    actions.editTask(mock, { taskId, modal });

    modal.checkIfMethodsCalled();
  });

  it('previewTask > should call mPreviewTask', () => {
    const taskId = 123;
    const mock = getMockForAction({}, 'mPreviewTask', taskId);
    const modal = getModalMock();

    actions.previewTask(mock, { taskId, modal });
  });

  it('previewTask > should show previewTask modal', () => {
    const taskId = 123;
    const mock = getMockForAction({});
    const modal = getModalMock('previewTask');

    actions.previewTask(mock, { taskId, modal });

    modal.checkIfMethodsCalled();
  });

  it('previewTask > should not show previewTask modal', () => {
    const taskId = null;
    const mock = getMockForAction({});
    const modal = getModalMock();

    actions.previewTask(mock, { taskId, modal });

    modal.checkIfMethodsCalled();
  });

  it('saveCategory > should add new category', () => {
    const category = {
      id: '',
      title: 'TestTitle'
    };
    const mock = getMockForAction({ current: { categories: [] } }, 'mAddCategory', category);

    actions.saveCategory(mock, category);
  });

  it('saveCategory > should update existing category', () => {
    const category = {
      id: 1,
      title: 'TestTitle'
    };
    const mock = getMockForAction({ current: { categories: [
      {
        id: 1,
        title: 'OldTitle'
      }
    ] } }, 'mUpdateCategory', category);

    actions.saveCategory(mock, category);
  });
});

describe('Roadmap getters', () => {
  it('roadmapTimeFrame', () => {
    const state = {
      current: {
        startDate: moment('2018-07-20'),
        endDate: moment('2018-07-21')
      }
    };

    const result = getters.roadmapTimeFrame(state);

    expect(result).toBeDefined();
    expect(result.startDate).toBe(state.current.startDate);
    expect(result.endDate).toBe(state.current.endDate);
  });

  it('taskToPreview > when previewTaskId is null', () => {
    const state = {
      previewTaskId: null,
      current: {
        tasks: [{ id: 1 }]
      }
    };

    const task = getters.taskToPreview(state);

    expect(task).toBeNull();
  });

  it('taskToPreview > when previewTaskId is valid', () => {
    const state = {
      previewTaskId: 1,
      current: {
        tasks: [{ id: 1, category: 2 }],
        categories: [{ id: 2 }]
      }
    };

    const task = getters.taskToPreview(state);

    expect(task).toBeDefined();
    expect(task.id).toBe(state.previewTaskId);
    expect(task.category).toBeDefined();
    expect(task.category.id).toBe(2);
  });

  it('taskToPreview > when previewTaskId is invalid', () => {
    const state = {
      previewTaskId: 2,
      current: {
        tasks: [{ id: 1 }],
        categories: []
      }
    };

    const task = getters.taskToPreview(state);

    expect(task).toBeNull();
  });

  it('taskToEdit > when editTaskId is null', () => {
    const state = {
      editTaskId: null,
      current: {
        tasks: [{ id: 1 }]
      }
    };

    const task = getters.taskToEdit(state);

    expect(task).toBeNull();
  });

  it('taskToEdit > when editTaskId is valid', () => {
    const stateTask = {
      id: 1,
      startDate: moment('2017-07-07'),
      endDate: moment('2018-08-08')
    };
    const state = {
      editTaskId: 1,
      current: {
        tasks: [stateTask]
      }
    };

    const task = getters.taskToEdit(state);

    expect(task).toBeDefined();
    expect(task.id).toBe(state.editTaskId);
    expect(task.startDate.toDateString()).toBe(stateTask.startDate.toDate().toDateString());
    expect(task.endDate.toDateString()).toBe(stateTask.endDate.toDate().toDateString());
  });

  it('taskToEdit > when editTaskId is invalid', () => {
    const state = {
      editTaskId: 2,
      current: {
        tasks: [{ id: 1 }]
      }
    };

    const task = getters.taskToEdit(state);

    expect(task).toBeNull();
  });

  it('tasksByCategory', () => {
    const category = 1;
    const state = {
      current: {
        tasks: [
          { id: 1, category },
          { id: 2, category },
          { id: 3, category: 2 },
        ]
      }
    };

    const tasks = getters.tasksByCategory(state)(category);

    expect(tasks.length).toBe(2);
    expect(tasks.find(x => x.id === 1)).toBeDefined();
    expect(tasks.find(x => x.id === 2)).toBeDefined();
    expect(tasks.find(x => x.id === 3)).toBeUndefined();
  });

  it('roadmapMonths', () => {
    const state = {
      current: {
        startDate: moment('2000-01-01'),
        endDate: moment('2000-05-01')
      }
    };

    const months = getters.roadmapMonths(state);

    expect(months.length).toBe(5);
    expect(months[0]).toBe(state.current.startDate.format(roadmapMonthFormat));
    expect(months[4]).toBe(state.current.endDate.format(roadmapMonthFormat));
  });

  it('roadmapMonths > when months are not full', () => {
    const state = {
      current: {
        startDate: moment('2000-01-10'),
        endDate: moment('2000-05-05')
      }
    };

    const months = getters.roadmapMonths(state);

    expect(months.length).toBe(5);
    expect(months[0]).toBe(state.current.startDate.format(roadmapMonthFormat));
    expect(months[4]).toBe(state.current.endDate.format(roadmapMonthFormat));
  });

  it('roadmapMonths > when dates are the same', () => {
    const state = {
      current: {
        startDate: moment('2000-01-01'),
        endDate: moment('2000-01-01')
      }
    };

    const months = getters.roadmapMonths(state);

    expect(months.length).toBe(1);
    expect(months[0]).toBe(state.current.startDate.format(roadmapMonthFormat));
  });
});
