import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { TrimSpaces } from 'src/utils/helpers';

export function TrimSpacesDecorator(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'trimSpaces',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return true; // Skip validation if it's not a string
          }

          const trimmedValue = TrimSpaces(value);
          return trimmedValue === value;
        },
      },
    });
  };
}