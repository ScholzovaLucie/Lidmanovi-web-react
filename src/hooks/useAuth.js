import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, setTokens, clearAuth } from '../redux/slices/app/appSlice';
import { getStoredTokens, clearTokens, storeTokens } from '../utils/cookieUtils';
import { useRefreshTokenMutation } from '../redux/api/authApi';

export const useAuth = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [refreshTokenMutation] = useRefreshTokenMutation();

  // Initialize auth from cookies on mount (no redirect)
  useEffect(() => {
    const tokens = getStoredTokens();
    if (tokens.access && tokens.refresh && !isAuthenticated) {
      dispatch(setTokens(tokens));
    }
  }, [dispatch, isAuthenticated]);

  const logout = useCallback(() => {
    dispatch(clearAuth());
    clearTokens();
  }, [dispatch]);

  const tryRefreshToken = useCallback(async () => {
    try {
      const tokens = getStoredTokens();
      if (!tokens.refresh) return false;

      const result = await refreshTokenMutation({ refresh: tokens.refresh }).unwrap();
      const newTokens = { access: result.access, refresh: tokens.refresh };
      
      // Store in cookies and Redux
      storeTokens(newTokens.access, newTokens.refresh);
      dispatch(setTokens(newTokens));
      return true;
    } catch (error) {
      logout();
      return false;
    }
  }, [refreshTokenMutation, dispatch, logout]);

  return useMemo(() => ({ 
    isAuthenticated, 
    logout, 
    tryRefreshToken 
  }), [isAuthenticated, logout, tryRefreshToken]);
};