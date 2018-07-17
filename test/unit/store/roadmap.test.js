import { mutations, actions } from '@/store/modules/roadmap';

const getMockForAction = (state, commitName, param) => ({
  state,
  commit: (commitParam1, commitParam2) => {
    if (commitName) {
      expect(commitParam1).toBe(commitName);
      expect(commitParam2).toBe(param);
    }
  }
});
const getModalMock = (showName, hideName) => ({
  _showName: undefined,
  _hideName: undefined,
  show(name) { this._showName = name },
  hide(name) { this._hideName = name },
  checkIfMethodsCalled() {
    const expectedShowName = showName || undefined;
    const expectedHideName = hideName || undefined;
    
    expect(this._showName).toBe(expectedShowName);
    expect(this._hideName).toBe(expectedHideName);
  }
});

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
    ]}};
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
    ]}};
    const category = { id: 1, title: newTitle };

    mutations.mUpdateCategory(state, category);

    const updatedCategory = state.current.categories.find(x => x.id === 1);

    expect(updatedCategory.title).toBe(newTitle);
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
    const mock = getMockForAction({ previewTaskId: 1});
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
