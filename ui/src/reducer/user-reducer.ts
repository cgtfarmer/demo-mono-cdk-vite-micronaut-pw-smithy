import { User } from '../models/user';

export const userInitialState: User = {
  id: '',
  firstName: '',
  lastName: '',
  age: '',
  weight: '',
  smoker: false
};

type UserAction =
  | Readonly<{ type: 'SET_USER'; payload: User }>
  | Readonly<{ type: 'RESET_USER'; }>
  | Readonly<{ type: 'UPDATE_USER'; payload: Partial<User> }>;

export default function userReducer(state: User, action: UserAction): User {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;

    case 'RESET_USER':
      return userInitialState;

    case 'UPDATE_USER':
      return { ...state, ...action.payload };

    default:
      throw new Error('Unhandled action type');
  }
}
