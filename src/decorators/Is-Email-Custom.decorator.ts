import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isEmail,
} from 'class-validator';

export function IsEmailCustomDecorator(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEmailCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return true; // Skip validation if it's not a string
          }

          const trimmedValue = value.replace(/\s+/g, ''); // Remove all spaces
          return isEmail(trimmedValue); // Validate using class-validator's isEmail
        },
        defaultMessage(args: ValidationArguments) {
          return `E-mail inválido.`;
        },
      },
    });
  };
}