import * as fixtures from '../__fixtures__';
import jose from 'jose';

// console.log(JSON.stringify(decoded, null, 2));

it('can decode jwt so its readable', () => {
  const decoded = jose.JWT.decode(fixtures.jwt, { complete: true });
  expect(decoded).toEqual(JSON.parse(fixtures.jwt_decoded));
});

it('can decode vc-jwt so its readable', () => {
  const decoded = jose.JWT.decode(fixtures.vc_jwt, { complete: true });
  expect(decoded).toEqual(JSON.parse(fixtures.vc_jwt_decoded));
});

it('can decode vp-jwt so its readable', () => {
  const decoded = jose.JWT.decode(fixtures.vp_jwt, { complete: true });
  expect(decoded).toEqual(JSON.parse(fixtures.vp_jwt_decoded));
});
