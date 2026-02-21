import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  IconButton,
  Typography,
  Stack,
  TextField,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useLoginMutation } from '../redux/api/authApi';
import { setTokens } from '../redux/slices/app/appSlice';
import { storeTokens } from '../utils/cookieUtils';
import AppModal from './Modal';

export const LoginModal = React.memo(({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  
  const [loginMutation, { isLoading: loginLoading, error: loginError }] = useLoginMutation();

  const handleUsernameChange = useCallback((e) => {
    setCredentials(prev => ({ ...prev, username: e.target.value }));
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setCredentials(prev => ({ ...prev, password: e.target.value }));
  }, []);

  const handleLogin = useCallback(async () => {
    try {
      const result = await loginMutation(credentials).unwrap();
      
      // Store tokens in cookies and Redux
      storeTokens(result.access, result.refresh);
      dispatch(setTokens({ access: result.access, refresh: result.refresh }));
      
      // Clear form and close modal
      setCredentials({ username: '', password: '' });
      onClose();
      
      // Navigate to admin
      navigate('/admin');
    } catch (error) {
      console.error('Login failed:', error);
    }
  }, [credentials, loginMutation, dispatch, navigate, onClose]);

  const handleClose = useCallback(() => {
    setCredentials({ username: '', password: '' });
    onClose();
  }, [onClose]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }, [handleLogin]);

  return (
    <AppModal open={isOpen} setOpen={handleClose}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" component="h2">
            Přihlášení
          </Typography>
          <IconButton
            onClick={handleClose}
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        
        <TextField 
          label="Uživatelské jméno" 
          value={credentials.username}
          onChange={handleUsernameChange}
          autoComplete="username"
        />
        
        <TextField 
          label="Heslo" 
          type="password"
          value={credentials.password}
          onChange={handlePasswordChange}
          autoComplete="current-password"
          onKeyPress={handleKeyPress}
        />

        {loginError && (
          <Typography color="error" variant="body2">
            Chyba při přihlašování
          </Typography>
        )}

        <Button
          onClick={handleLogin}
          variant="contained"
          disabled={loginLoading}
          fullWidth
        >
          {loginLoading ? 'Přihlašování...' : 'Přihlásit'}
        </Button>
      </Stack>
    </AppModal>
  );
});