import fetch, { RequestInit } from 'node-fetch';
import { googleAuth, webUrl } from '../config';
import logger from '../utils/logger';
import accountService from './accountService';

const handleFetch = (url: string, opts: RequestInit) => 
  fetch(url, opts)
  .catch(err => {
    logger.error(err);
    return null;
  });

class GoogleAuthService {
  private async getAccessToken(code: string) {
    const params = {
      code,
      client_id: googleAuth.client_id,
      client_secret: googleAuth.client_secret,
      redirect_uri: googleAuth.redirect_uris[0],
      grant_type: 'authorization_code'
    };
    const result = await handleFetch(googleAuth.token_uri, {
      method: 'POST',
      body: JSON.stringify(params)
    });

    if (!result) {
      return { error: 'Failed to fetch token' };
    }

    const data = await result.json();

    return {
      error: data.error,
      token: data.access_token
    };
  }

  private async getUserInfo(token: string) {
    const result = await handleFetch(
      'https://www.googleapis.com/oauth2/v2/userinfo?alt=json',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    
    if (!result) {
      return { error: 'Failed to fetch token' };
    }

    const data = await result.json();

    return {
      error: data.error,
      id: data.id,
      name: data.name,
      email: data.email
    };
  }

  public async handleCallBack(query: any): Promise<string> {
    const code = query.code;
    const userId = parseInt(query.state || '0', 10);

    const redirectUrl = userId !== 0
      ? (success: any) => `${webUrl}/#/settings?googleAuthSuccess=${success}`
      : (authCode: any) => `${webUrl}/#/login?code=${authCode}`;
    
    
    const tokenData = await this.getAccessToken(code);
    if (tokenData.error) {
      logger.warn(`Failed handling google callback. Failed fetching access token. Code: ${code}; User Id: ${userId}; Error: ${tokenData.error}`);
      return redirectUrl(false);
    }

    const userData = await this.getUserInfo(tokenData.token);
    if (userData.error) {
      logger.warn(`Failed handling google callback. Failed fetching user info. Token: ${tokenData.token}; User Id: ${userId}; Error: ${userData.error}`);
      return redirectUrl(false);
    }

    if (userId === 0) {
      const user = await accountService().getOrCreate(userData.id, {
        email: userData.email,
        name: userData.name
      });

      const authCode = await accountService().generateAuthCode(user.id);
      return redirectUrl(authCode);
    }

    await accountService().setUniqueIdentifier(userId, userData.id);
    return redirectUrl(true);
  }
}

export default () => new GoogleAuthService();
