import { useSelector, useDispatch } from 'react-redux';
import { setMode } from '../store/reducers/customization';

export const useConfig = () => {
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);

  const toggleMode = () => {
    dispatch(setMode(!customization.isDarkMode));
  };

  return {
    ...customization,
    toggleMode
  };
};
