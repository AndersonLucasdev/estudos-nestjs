import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function MinLengthCustomDecorator(minLength: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'minLengthCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return true; // Skip validation if it's not a string
          }
          const trimmedValue = value.trim();

           return trimmedValue.length >= minLength;
        },
        defaultMessage(args: ValidationArguments) {
          return `O campo ${args.property} deve ter pelo menos ${minLength} caracteres.`;
        },
      },
    });
  };
}