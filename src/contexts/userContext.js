import { createContext, useContext } from 'react';

const userContext = createContext({
  user: null,
});

export const useUser = () => useContext(userContext);
export default userContext;
