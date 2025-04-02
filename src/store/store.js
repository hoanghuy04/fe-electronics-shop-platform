import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './reducers/cartReducer';
import userReducer from './reducers/userReducer';

// const allReducers = combineReducers({
//     cart: cartReducer, // Key 'cart' dùng trong useSelector(state => state.cart)
// });

// const store = createStore(
//     allReducers,
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // Hỗ trợ Redux DevTools
// );

// export default store;

const store = configureStore({
    reducer: {
      cart: cartReducer,
      user: userReducer 
    },
  });
  
  export default store;