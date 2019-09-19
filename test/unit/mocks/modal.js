export default (showName, hideName) => ({
  showName: undefined,
  hideName: undefined,
  show(name) { this.showName = name; },
  hide(name) { this.hideName = name; },
  checkIfMethodsCalled() {
    const expectedShowName = showName || undefined;
    const expectedHideName = hideName || undefined;

    expect(this.showName).toBe(expectedShowName);
    expect(this.hideName).toBe(expectedHideName);
  }
});
