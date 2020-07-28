import * as fs from 'fs';
import * as path from 'path';

const jwt = fs
  .readFileSync(path.resolve(__dirname, './test-vectors/jwt.txt'))
  .toString();

const jwt_decoded = fs
  .readFileSync(path.resolve(__dirname, './test-vectors/jwt-decoded.json'))
  .toString();

const vc_jwt = fs
  .readFileSync(path.resolve(__dirname, './test-vectors/vc-jwt.txt'))
  .toString();

const vc_jwt_decoded = fs
  .readFileSync(path.resolve(__dirname, './test-vectors/vc-jwt-decoded.json'))
  .toString();

const vp_jwt = fs
  .readFileSync(path.resolve(__dirname, './test-vectors/vp-jwt.txt'))
  .toString();

const vp_jwt_decoded = fs
  .readFileSync(path.resolve(__dirname, './test-vectors/vp-jwt-decoded.json'))
  .toString();

const vc_ld = fs
  .readFileSync(path.resolve(__dirname, './test-vectors/vc-ld.json'))
  .toString();

const vp_ld = fs
  .readFileSync(path.resolve(__dirname, './test-vectors/vp-ld.json'))
  .toString();

const presentation_definition = fs
  .readFileSync(
    path.resolve(__dirname, './test-vectors/presentation_definition.json')
  )
  .toString();

export {
  jwt,
  jwt_decoded,
  vc_jwt,
  vc_jwt_decoded,
  vp_jwt,
  vp_jwt_decoded,
  vc_ld,
  vp_ld,
  presentation_definition,
};
