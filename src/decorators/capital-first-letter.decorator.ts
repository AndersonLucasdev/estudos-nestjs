import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
  } from 'class-validator';
  export function CapitalFirstLetterDecorator(
    validationOptions?: ValidationOptions,
  ) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'capitalFirstLetter',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            if (typeof value !== 'string') {
              return true;
            }
  
            const formattedValue = value
              .trim()
              .replace(/\s+/g, ' ')
              .toLowerCase()
              .replace(/(^|\s)\S/g, (match) => match.toUpperCase());
  
            return formattedValue === value;
          },
        },
      });
    };
  }
  