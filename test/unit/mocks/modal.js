export default (showName, hideName) => ({
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
