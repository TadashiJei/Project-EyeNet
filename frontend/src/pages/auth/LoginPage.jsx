const handleSubmit = async (e) => {
  e.preventDefault();
  try {
      const response = await api.post('/auth/login', {
          email,
          password
      });
      
      // Store the token
      localStorage.setItem('token', response.data.token);
      
      // Update auth context
      login(response.data.user);
      
      // Navigate to dashboard
      navigate('/dashboard');
  } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
  }
};