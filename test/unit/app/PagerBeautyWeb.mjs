// ------- Imports -------------------------------------------------------------

import test from 'ava';
import chai from 'chai';

// ------- Internal imports ----------------------------------------------------

import { PagerBeautyWeb } from '../../../src/app/PagerBeautyWeb';

// ------- Init ----------------------------------------------------------------

const { expect } = chai;

// ------- Tests ---------------------------------------------------------------

test('PagerBeautyWeb: default HTTP port is 8080', () => {
  const { parseHttpPortFromConfig } = PagerBeautyWeb;
  expect(parseHttpPortFromConfig()).to.equal(8080);
  expect(parseHttpPortFromConfig({})).to.equal(8080);
  expect(parseHttpPortFromConfig(false)).to.equal(8080);
  expect(parseHttpPortFromConfig({ web: {} })).to.equal(8080);
  expect(parseHttpPortFromConfig({ web: { httpPort: undefined } })).to.equal(8080);
  expect(parseHttpPortFromConfig({ web: { httpPort: null } })).to.equal(8080);
  expect(parseHttpPortFromConfig({ web: { httpPort: '' } })).to.equal(8080);
});

test('PagerBeautyWeb: custom HTTP port is parsed', () => {
  const { parseHttpPortFromConfig } = PagerBeautyWeb;
  expect(parseHttpPortFromConfig({ web: { httpPort: 80 } })).to.equal(80);
  expect(parseHttpPortFromConfig({ web: { httpPort: 0 } })).to.equal(0);
  expect(parseHttpPortFromConfig({ web: { httpPort: 65535 } })).to.equal(65535);
  expect(parseHttpPortFromConfig({ web: { httpPort: '80' } })).to.equal(80);
  expect(parseHttpPortFromConfig({ web: { httpPort: '0' } })).to.equal(0);
  expect(parseHttpPortFromConfig({ web: { httpPort: '65535' } })).to.equal(65535);
  expect(parseHttpPortFromConfig({ web: { httpPort: true } })).to.equal(1);
});

test('PagerBeautyWeb: error on incorrect input', () => {
  const { parseHttpPortFromConfig } = PagerBeautyWeb;
  expect(() => parseHttpPortFromConfig({ web: { httpPort: -1 } })).to.throw(RangeError);
  expect(() => parseHttpPortFromConfig({ web: { httpPort: '-1' } })).to.throw(RangeError);
  expect(() => parseHttpPortFromConfig({ web: { httpPort: 65536 } })).to.throw(RangeError);
  expect(() => parseHttpPortFromConfig({ web: { httpPort: '65536' } })).to.throw(RangeError);
  expect(() => parseHttpPortFromConfig({ web: { httpPort: 'foo' } })).to.throw(RangeError);
  expect(() => parseHttpPortFromConfig({ web: { httpPort: {} } })).to.throw(RangeError);
  expect(() => parseHttpPortFromConfig({ web: { httpPort: NaN } })).to.throw(RangeError);
});

// ------- End -----------------------------------------------------------------
