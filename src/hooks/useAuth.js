import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from "../store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user && !isLoading) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user, isLoading]);

  return { user, isLoading, error, isAuthenticated };
};