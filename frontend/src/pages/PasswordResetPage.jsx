import React from 'react';
import { useParams } from 'react-router-dom';

const PasswordResetPage = () => {
  const { token } = useParams();

  return (
    <div>
      <h1>Password Reset Page</h1>
      <p>Please enter your new password.</p>
      {/* Form: New Password, Confirm Password, Actions */}
      <p>Reset Token: {token}</p>
    </div>
  );
};

export default PasswordResetPage;
