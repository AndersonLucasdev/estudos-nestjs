import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsEmailCustomDecorator(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEmailFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          const trimmedValue = value.trim(); // Trim spaces before validation

          // Implemente a validação do formato de e-mail aqui
          // Por exemplo, usando uma expressão regular:
          const emailRegex = /^\S+@\S+\.\S+$/;
          return emailRegex.test(trimmedValue);
        },
        defaultMessage(args: ValidationArguments) {
          return `O formato de e-mail é inválido.`;
        },
      },
    });
  };
}
