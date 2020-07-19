import { validate_presentation_definition } from '..';
import { presentation_definition } from '../__fixtures__';

it('can validate_presentation_definition', () => {
  const valid = validate_presentation_definition(
    JSON.parse(presentation_definition)
  );
  expect(valid).toBe(true);
});
