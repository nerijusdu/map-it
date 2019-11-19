import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../../app';

const healthCheckUrl: string = '/api/health';

let server: supertest.SuperTest<supertest.Test>;
before(async () => {
  server = supertest.agent(app);
});

describe('Healthcheck tests', () => {
  it('should return true', async () => {
    const result = await server.get(healthCheckUrl);
    expect(result.status).to.equal(200);
    expect(result.body).to.be.true;
  });
});

describe('Static content tests', () => {
  ['html', 'css', 'js', 'png', 'ico'].forEach((fileType) => {
    it(`should return ${fileType} files`, async () => {
      const result = await server.get(`/testData/test.${fileType}`);
      expect(result.status).to.equal(200);
    });
  });
});
