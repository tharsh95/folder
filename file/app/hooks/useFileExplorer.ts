import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTreeData } from '../store/slices/fileExplorerSlice';

export const useFileExplorer = () => {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((state) => state.fileExplorer);

  useEffect(() => {
    if (status === 'idle' && !data) {
      dispatch(fetchTreeData());
    }
  }, [dispatch, status, data]);

  return {
    data,
    status,
    error,
    isLoading: status === 'loading',
    isError: status === 'failed'
  };
};
