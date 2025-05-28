/**
 * This hook was created to solve the display problem of the error
 * when using`validateOnChange: false` on `useFormik` hook was initialized.
 */
import { FormikProps } from 'formik'

function useCustomEvents<T>(formikProps: FormikProps<T>) {
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const elementName = e.currentTarget.getAttribute('name') ?? ''
    formikProps.setFieldError(elementName, '')
    formikProps.handleChange(e)
  }

  const onSetValueById = (id: string, value: string | boolean | number) => {
    formikProps.setFieldError(id, '')
    formikProps.setFieldValue(id, value)
  }

   const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const elementName = e.currentTarget.getAttribute('name') ?? ''
    formikProps.setFieldError(elementName, '')
    formikProps.setFieldValue(elementName, e.target.value)
  }

  return { onInputChange, onSetValueById, onSelectChange }
}

export { useCustomEvents }

