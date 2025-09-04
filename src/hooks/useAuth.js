import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from "../store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user && !isLoading && isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user, isLoading, isAuthenticated]);

  return { user, isLoading, error, isAuthenticated };
};