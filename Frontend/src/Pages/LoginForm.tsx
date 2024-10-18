// src/components/Login.tsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

const LoginForm: React.FC = () => {
  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      password: Yup.string()
        .required('Required')
        .min(6, 'Password must be at least 6 characters'),
    }),
    onSubmit: (values) => {
      // Add your login logic here
      console.log('Logging in:', values);
    },
  });

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-2 text-lg">Email</label>
            <input
              id="email"
              type="email"
              {...formik.getFieldProps('email')}
              className={`border p-3 rounded w-full ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
              placeholder="Email"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-lg">Password</label>
            <input
              id="password"
              type="password"
              {...formik.getFieldProps('password')}
              className={`border p-3 rounded w-full ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
              placeholder="Password"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm">{formik.errors.password}</div>
            ) : null}
          </div>
          <div className="flex justify-between">
            <Link to="/forgot-password" className="text-blue-500 hover:underline">Forgot your password?</Link>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition duration-200"
          >
            Log In
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm">Don't have an account? 
            <Link to="/signup" className="text-blue-500 hover:underline"> Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
