export default class MockStore {
  constructor(options) {
    this.getters = options.getters;
    this.actions = options.actions;
    this.mutations = options.mutations;
    this.state = options.state;
  }

  dispatch(actionName, param) {
    if (this.actions[actionName]) {
      return this.actions[actionName](param);
    }
    return null;
  }
}
