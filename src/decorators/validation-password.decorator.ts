import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function PasswordComplexityDecorator(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'passwordComplexity',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          const trimmedValue = value.trim(); // Trim spaces before validation

          // Implemente a validação da complexidade da senha aqui
          // Por exemplo, usando uma expressão regular:
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
          return passwordRegex.test(trimmedValue);
        },
        defaultMessage(args: ValidationArguments) {
          return `A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial, e ter no mínimo 6 caracteres.`;
        },
      },
    });
  };
}
