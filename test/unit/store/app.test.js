import shortId from 'shortid';
import store from '@/store';
import getMockForAction from '../mocks/store-action';

// eslint-disable-next-line no-underscore-dangle
const { mutations, actions } = store._modulesNamespaceMap['app/']._rawModule;

describe('App actions', () => {
  it('saveUser > should save token to local storage', () => {
    global.localStorage.clear();

    const mock = getMockForAction({});
    const data = {
      token: shortId.generate(),
      email: shortId.generate()
    };

    actions.saveUser(mock, data);

    const savedToken = global.localStorage.getItem('token');

    expect(savedToken).toBe(data.token);
  });

  it('saveUser > when data is incorrect', () => {
    global.localStorage.clear();

    const mock = getMockForAction({});
    const data1 = { token: shortId.generate() };
    const data2 = { email: shortId.generate() };
    const data3 = null;

    actions.saveUser(mock, data1);
    actions.saveUser(mock, data2);
    actions.saveUser(mock, data3);

    const savedToken = global.localStorage.getItem('token');

    expect(savedToken).toBeNull();
  });

  it('saveUser > should commit mutation', () => {
    const data = {
      token: shortId.generate(),
      email: shortId.generate()
    };
    const mock = getMockForAction({}, 'mSaveUser', data);

    actions.saveUser(mock, data);
  });

  it('getToken > should return token', () => {
    const state = {
      user: { token: shortId.generate() }
    };

    const mock = getMockForAction(state, 'mSaveUser');
    const result = actions.getToken(mock);

    expect(result).toBe(state.user.token);
  });
});

describe('App mutations', () => {
  it('mSaveUser', () => {
    const data = {
      token: shortId.generate(),
      email: shortId.generate()
    };
    const state = { user: {} };

    mutations.mSaveUser(state, data);

    expect(state.user.token).toBe(data.token);
    expect(state.user.email).toBe(data.email);
  });
});
