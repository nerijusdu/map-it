import shortId from 'shortid';
import moment from 'moment';
import store from '@/store';
import getMockForAction, { mockSeparateForAction } from '../mocks/store-action';

const globalToken = 'some_random_token';
jest.mock('@/services/api', () => ({
  refreshToken: () => ({
    ok: true,
    data: {
      token: 'some_random_token'
    }
  })
}));
// eslint-disable-next-line no-underscore-dangle
const { mutations, actions } = store._modulesNamespaceMap['app/']._rawModule;

describe('App actions', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

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

  it('getToken > should get token from localStorage', () => {
    const token = shortId.generate();
    const refreshToken = shortId.generate();
    const email = shortId.generate();
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('refreshToken', refreshToken);
    window.localStorage.setItem('email', email);

    const state = {
      user: {}
    };

    const mock = getMockForAction(state, 'mSaveUser', { token, refreshToken, email });
    const result = actions.getToken(mock);

    expect(result).toBe(token);
  });

  it('refreshToken > when there is no email or refresh token, should fail', async () => {
    const state = {
      user: {}
    };

    const mock = getMockForAction(state, 'saveUser', { token: globalToken });
    const result = await actions.refreshToken(mock);

    expect(result).toBeFalsy();
  });

  it('refreshToken > when user is in state, should refres token', async () => {
    const state = {
      user: {
        email: shortId.generate(),
        refreshToken: shortId.generate()
      }
    };

    const mock = getMockForAction(state, 'saveUser', { token: globalToken });
    const result = await actions.refreshToken(mock);

    expect(result).toBe(globalToken);
  });

  it('refreshToken > when user is in localStorage, should refres token', async () => {
    const refreshToken = shortId.generate();
    const email = shortId.generate();
    window.localStorage.setItem('refreshToken', refreshToken);
    window.localStorage.setItem('email', email);
    const state = {
      user: {}
    };

    const mock = getMockForAction(state, 'saveUser', { token: globalToken });
    const result = await actions.refreshToken(mock);

    expect(result).toBe(globalToken);
  });

  it('showError > should show error', () => {
    const text = shortId.generate();
    const mock = getMockForAction({}, 'mShowMessage', { text, isError: true });
    actions.showError(mock, text);
  });

  it('showMessage > should show message', () => {
    const text = shortId.generate();
    const mock = getMockForAction({}, 'mShowMessage', { text, isError: false });
    actions.showMessage(mock, text);
  });

  it('logout > should delete all user data', () => {
    window.localStorage.setItem('token', shortId.generate());
    window.localStorage.setItem('refreshToken', shortId.generate());
    window.localStorage.setItem('email', shortId.generate());

    const router = {
      push: jest.fn()
    };
    const mock = mockSeparateForAction(
      {},
      {
        mSaveUser: {
          token: null,
          refreshToken: null,
          email: null
        },
        mLogout: undefined
      },
      {
        'roadmap/reset': null
      }
    );

    actions.logout(mock, router);

    expect(window.localStorage.getItem('token')).toBeNull();
    expect(window.localStorage.getItem('refreshToken')).toBeNull();
    expect(window.localStorage.getItem('email')).toBeNull();
    expect(router.push).toBeCalledWith('Login');
  });

  it('init > should not call when already initialized', () => {
    const mock = {
      state: {
        isInitialized: true,
        user: {
          token: shortId.generate()
        }
      },
      dispatch: jest.fn(),
      commit: jest.fn()
    };
    actions.init(mock);

    expect(mock.dispatch).not.toBeCalled();
    expect(mock.commit).not.toBeCalled();
  });

  it('init > should not call when user has no token', () => {
    const mock = {
      state: {
        isInitialized: false,
        user: {}
      },
      dispatch: jest.fn(),
      commit: jest.fn()
    };
    actions.init(mock);

    expect(mock.dispatch).not.toBeCalled();
    expect(mock.commit).not.toBeCalled();
  });

  it('init > should call needed actions', () => {
    const mock = {
      state: {
        isInitialized: false,
        user: {
          token: shortId.generate()
        }
      },
      dispatch: jest.fn(),
      commit: jest.fn()
    };
    actions.init(mock);

    expect(mock.dispatch).toBeCalledWith('roadmap/init', null, { root: true });
    expect(mock.commit).toBeCalledWith('mInit');
  });
});

describe('App mutations', () => {
  it('mSaveUser', () => {
    const data = {
      token: shortId.generate(),
      refreshToken: shortId.generate(),
      expiresAt: new Date(),
      email: shortId.generate()
    };
    const state = { user: {} };

    mutations.mSaveUser(state, data);

    expect(state.user.token).toBe(data.token);
    expect(state.user.email).toBe(data.email);
    expect(state.user.refreshToken).toBe(data.refreshToken);
    expect(state.user.expiresAt.toString()).toBe(moment(data.expiresAt).toString());
  });

  it('mToggleLoading', () => {
    const state = { };

    mutations.mToggleLoading(state, true);

    expect(state.isLoading).toBe(true);
  });

  it('mShowMessage', () => {
    const state = { };
    const message = shortId.generate();

    mutations.mShowMessage(state, message);

    expect(state.message).toBe(message);
  });

  it('mInit', () => {
    const state = { isInitialized: false };

    mutations.mInit(state);

    expect(state.isInitialized).toBe(true);
  });

  it('mLogout', () => {
    const state = { isInitialized: true };

    mutations.mLogout(state);

    expect(state.isInitialized).toBe(false);
  });
});
