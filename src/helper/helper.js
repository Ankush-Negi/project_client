import * as yup from 'yup';

const ValidationSchema = yup.object().shape({
  Name: yup
    .string()
    .required('Name is a required field')
    .min(3),
  Email: yup
    .string()
    .required('Email Address is a required field')
    .matches('^[a-z0-9](.?[a-z0-9]){5,}@g(oogle)?mail.com$', { message: 'Email address must be a valid email' }),
  Password: yup
    .string()
    .required('Password is required')
    .matches('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$', { message: 'Must contain 8 characters, atleast one uppercase letter, one lowercase letter and a number' }),
  ConfirmPassword: yup
    .string()
    .oneOf([yup.ref('Password')], 'Must match password')
    .required('Confirm Password is required'),
  Address: yup
    .string()
    .required('Address is a required field')
    .min(3),
  Dob: yup
    .string()
    .required('DOB is a required field(YYYY-MM-DD)')
    .min(8),
  Role: yup
    .string()
    .required('Role is a required field')
    .min(4), 
  MobileNumber: yup
    .number()
    .required('Number is a required field')
    .min(10),
  Hobby: yup
    .string()
    .required('Hobby is a required field')
    .min(4),
});

export default ValidationSchema;
