// ------- Imports -------------------------------------------------------------

import auth from 'basic-auth';
import timingSafeCompare from 'tsscmp';

// ------- Helpers -------------------------------------------------------------

function checkCredentials(credentials, name, pass) {
  let valid = true;

  // Simple method to prevent short-circut and use timing-safe compare
  valid = timingSafeCompare(credentials.name, name) && valid;
  valid = timingSafeCompare(credentials.pass, pass) && valid;

  return valid;
}

function checkAuthToken(tokenCandidate, tokenExpected) {
  return timingSafeCompare(tokenCandidate, tokenExpected);
}

// ------- Authentication middleware -------------------------------------------

export function authentication(name, pass, token, opts = {}) {
  const realm = opts.realm || 'Secure Area';

  if (!name) {
    throw new Error('Basic auth `name` is required');
  }

  return async (ctx, next) => {
    const credentials = auth(ctx);
    const tokenCandidate = ctx.request.query.access_token;

    let tokenAuthPass = false;
    if (token && token !== '') {
      tokenAuthPass = checkAuthToken(tokenCandidate, token);
    }

    let credentialsPass = false;
    if (credentials) {
      credentialsPass = checkCredentials(credentials, name, pass);
    }

    if (tokenAuthPass || credentialsPass) {
      await next();
    } else {
      ctx.throw(
        401,
        null,
        {
          headers: {
            'WWW-Authenticate': `Basic realm="${realm.replace(/"/g, '\\"')}"`,
          },
        },
      );
    }
  };
}

// ------- End -----------------------------------------------------------------
