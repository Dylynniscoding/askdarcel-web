import { combineReducers } from 'redux';
import { combineForms } from 'react-redux-form';
import { connectRouter } from 'connected-react-router';
import auth from './authReducer';
import popUpMessageReducer from './popUpMessageReducer';
import forms from './formConfig';

import { User } from '../models';

const createRootReducer = history => combineReducers({
  auth,
  forms: combineForms(forms, 'forms'),
  popUpMessage: popUpMessageReducer,
  router: connectRouter(history),
  user: User.REDUCER,
});

export default createRootReducer;
