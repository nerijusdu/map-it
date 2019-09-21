const expectFunc = (commitParam1, commitParam2, funcName, param) => {
  if (funcName) {
    expect(commitParam1).toBe(funcName);
    if (param && typeof param === 'object') {
      expect(commitParam2).toMatchObject(param);
    } else {
      expect(commitParam2).toBe(param);
    }
  }
};

export const mockSeparateForAction = (state, commitParams, dispatchParams) => ({
  state,
  commit: (commitParam1, commitParam2) => expectFunc(commitParam1, commitParam2, commitParam1, commitParams[commitParam1]),
  dispatch: (dispatchParam1, dispatchParam2) => expectFunc(dispatchParam1, dispatchParam2, dispatchParam1, dispatchParams[dispatchParam1])
});

export default (state, funcName, param) => ({
  state,
  commit: (commitParam1, commitParam2) => expectFunc(commitParam1, commitParam2, funcName, param),
  dispatch: (actionParam1, actionParam2) => expectFunc(actionParam1, actionParam2, funcName, param)
});
