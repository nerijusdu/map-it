import shortId from 'shortid';
import { mutations, actions, getters } from '@/store/modules/app';
import getMockForAction from '../mocks/store-action';


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

describe('App getters', () => {
  it('getToken', () => {
    const state = {
      user: { token: shortId.generate() }
    };

    const result = getters.getToken(state);

    expect(result).toBe(state.user.token);
  });
});
