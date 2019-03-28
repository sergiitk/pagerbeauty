// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;
chai.use(sinonChai);

// ------- Tests ---------------------------------------------------------------

test('Check Sinon', () => {
  const fake = sinon.fake();
  fake();
  expect(fake).to.be.calledOnce;
});

// ------- End -----------------------------------------------------------------
