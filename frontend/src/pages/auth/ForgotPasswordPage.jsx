import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  Link,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import useAuth from '../../hooks/useAuth';
import useScriptRef from '../../hooks/useScriptRef';

// ============================|| FORGOT PASSWORD ||============================ //

const ForgotPasswordPage = () => {
  const { resetPassword } = useAuth();
  const scriptedRef = useScriptRef();
  const [sent, setSent] = useState(false);

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            await resetPassword(values.email);
            setSent(true);
            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
            }
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-forgot">Email Address</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-forgot"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    inputProps={{}}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="helper-text-email-forgot">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12} sx={{ mb: -2 }}>
                <Typography variant="caption">
                  Don&apos;t have an account?{' '}
                  <Link variant="caption" component={RouterLink} to="/register">
                    Register
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {sent ? 'Check your email' : 'Send Reset Link'}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  fullWidth
                  size="large"
                >
                  Back to Login
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ForgotPasswordPage;
