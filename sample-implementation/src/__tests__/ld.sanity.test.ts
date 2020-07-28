import * as fixtures from '../__fixtures__';

it('ld vc is parsed as json', () => {
  const parsed = JSON.parse(fixtures.vc_ld);
  expect(parsed.id).toEqual('http://example.gov/credentials/3732');
});

it('ld vp is parsed as json', () => {
  const parsed = JSON.parse(fixtures.vp_ld);
  expect(parsed.holder).toEqual('did:ex:12345');
});
