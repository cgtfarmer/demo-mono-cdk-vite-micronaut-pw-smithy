import { User } from '../models/user';

export const usersInitialState: User[] = [];

type UserAction =
  | Readonly<{ type: 'SET_USERS'; payload: User[] }>
  | Readonly<{ type: 'RESET_USERS'; }>
  | Readonly<{ type: 'ADD_USER'; payload: User }>
  | Readonly<{ type: 'REMOVE_USER'; payload: { id: string } }>
  | Readonly<{ type: 'UPDATE_USER'; payload: { id: string; updates: Partial<User> } }>;

export default function userReducer(state: User[], action: UserAction): User[] {
  switch (action.type) {
    case 'SET_USERS':
      return action.payload;
    case 'RESET_USERS':
      return usersInitialState;
    case 'ADD_USER':
      return [...state, action.payload];
    case 'REMOVE_USER':
      return state.filter(user => user.id !== action.payload.id);
    case 'UPDATE_USER':
      return state.map(user =>
        user.id === action.payload.id
          ? { ...user, ...action.payload.updates }
          : user
      );
    default:
      throw new Error('Unhandled action type');
  }
}
