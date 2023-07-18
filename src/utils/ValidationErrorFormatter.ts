export class ValidationErrorFormatter {
    public static format(errors: any[]): string {
      const formattedErrors = errors.map((error) => {
        const constraints = Object.values(error.constraints);
        return constraints.join(', ');
      });
      return formattedErrors.join(', ');
    }
  }