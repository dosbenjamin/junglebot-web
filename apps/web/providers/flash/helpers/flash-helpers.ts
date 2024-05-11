import { ArrayFormatter } from '@effect/schema';
import type { ParseError } from '@effect/schema/ParseResult';
import { flash } from '#providers/flash/services/flash-service';

export const flashDecodeErrors = (error: ParseError): Record<string, string> => {
  return Object.fromEntries(
    ArrayFormatter.formatErrorSync(error).map((error) => {
      const [path] = error.path.toString();
      const key = `errors.${path}`;

      flash.set(key, error.message);

      return [key, error.message];
    }),
  );
};
