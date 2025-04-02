const initialState = {
    user: null,
    isAuthenticated: false,
    role: null,
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN':
        return {
          ...state,
          user: action.payload,
          isAuthenticated: true,
          role: action.payload.role,
        };
      case 'LOGOUT':
        return initialState;
      default:
        return state;
    }
  };
  
  export default userReducer;