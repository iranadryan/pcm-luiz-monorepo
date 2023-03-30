import { useCallback, useState } from 'react';

interface Error {
  field: string;
  message: string;
}

export default function useErrors() {
  const [errors, setErrors] = useState<Error[]>([]);

  const addError = useCallback(({ field, message }: Error) => {
    const errorAlreadyExists = errors.find((error) => error.field === field);

    if (errorAlreadyExists) {
      return;
    }

    setErrors((prevState) => [
      ...prevState,
      { field, message },
    ]);
  }, [errors]);

  const setAllErrors = useCallback((errors: Error[]) => {
    setErrors(errors);
  }, []);

  const removeError = useCallback((field: string) => {
    setErrors((prevState) => prevState.filter(
      (error) => error.field !== field,
    ));
  }, []);

  const getErrorMessageByFieldName = useCallback((field: string) => (
    errors.find((error) => error.field === field)?.message
  ), [errors]);

  return {
    errors,
    addError,
    setAllErrors,
    removeError,
    getErrorMessageByFieldName,
  };
}
