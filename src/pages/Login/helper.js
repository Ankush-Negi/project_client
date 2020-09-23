import * as yup from 'yup';

const LoginValidationSchema = yup.object().shape({
  Email: yup
    .string()
    .email('Email address must be a valid email' )
    .required('Email Address is a required field'),
  Password: yup
    .string()
    .required('Password is required'),
});

export default LoginValidationSchema;
