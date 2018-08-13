export default (state, commitName, param) => ({
  state,
  commit: (commitParam1, commitParam2) => {
    if (commitName) {
      expect(commitParam1).toBe(commitName);
      expect(commitParam2).toBe(param);
    }
  }
});
