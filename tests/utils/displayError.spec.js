import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import sinon, { stub, spy } from 'sinon';
import { generalErrorHandler } from 'utilities/errorHandler';
import ServerResponses from 'helpers/ServerResponses';
import logger from 'helpers/logger';

chai.use(chaiHttp);
describe('Test Display error utils ', () => {
  it('return server error if the error is not part of the identified error',
    () => {
      sinon.restore();
      sinon.stub(ServerResponses, 'appError').returns(null);
      sinon.stub(logger, 'error').returns(null);
      const status = stub();
      const res = {
        end: spy(),
        json: spy(),
        body: spy(),
        status
      };
      const req = {
        end: spy(),
        json: spy(),
        body: spy(),
        status
      };
      const error = {
        message: 'message',
        name: 'hanldeError',
        data: null,
        responseCode: '39',
        body: spy(),
      };
      generalErrorHandler(error, req, res, req);
      expect(ServerResponses.appError.called).to.be.true;
      sinon.restore();
    });
});
