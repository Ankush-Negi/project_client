import * as yup from 'yup';

const ValidationSchema = yup.object().shape({
  Name: yup
    .string()
    .required('Name is a required field')
    .min(3),
  Price: yup
    .number()
    .required('Price is a required field')
    .min(2),
  Desc: yup
    .string()
    .required('Description is required')
    .min(4),
});

export default ValidationSchema;
