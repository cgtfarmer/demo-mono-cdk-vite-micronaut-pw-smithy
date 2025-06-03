import { ChangeEvent, useEffect, useReducer } from 'react';
import userReducer, { userInitialState } from '../../reducer/user-reducer';
import ApiUserAccessor from '../../accessors/user/api-user-accessor';
import { UserServiceClient } from '@cgtfarmer/user-service-client';
import { ApiUserAccessorMapper } from '../../accessors/user/api-user-accessor-mapper';
import { UserAccessor } from '../../accessors/user/user-accessor';
import { Button, Checkbox, FormControlLabel, FormGroup, Stack, TextField, Typography } from '@mui/material';
import { Params, useNavigate, useParams } from 'react-router';

// eslint-disable-next-line functional/type-declaration-immutability
interface RouteParams extends Params {
  userId: string
};

// const userClient: UserAccessor = new FakeUserAccessor();
const userClient: UserAccessor = new ApiUserAccessor(
  new UserServiceClient({
    endpoint: import.meta.env.VITE_API_URL as string
  }),
  new ApiUserAccessorMapper()
);

export default function Page() {
  const [user, dispatch] = useReducer(userReducer, userInitialState);

  const params = useParams<RouteParams>();

  const navigate = useNavigate();

  const handleUpdateUser = async () => {
    const newUser = await userClient.update(user);

    if (!newUser) return;

    await navigate(`/users/${newUser.id}`);
  };

  useEffect(() => {
    async function fetchUser(userId: string) {
      const user = await userClient.fetch(userId);

      if (!user) return;

      dispatch({ type: 'SET_USER', payload: user })
    }

    if (!params.userId) return;

    console.log(`User ID: ${params.userId}`);

    void fetchUser(params.userId);
  }, [params.userId]);

  return (
    <>
      <Typography component="h1" variant="h4" gutterBottom>
        Update user
      </Typography>

      <Stack gap="1rem" maxWidth="30rem">
        <TextField
          label="First Name"
          variant="outlined"
          value={user.firstName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'UPDATE_USER',
              payload: { firstName: e.target.value }
            });
          }}
        />

        <TextField
          label="Last Name"
          variant="outlined"
          value={user.lastName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'UPDATE_USER',
              payload: { lastName: e.target.value }
            })
          }}
        />

        <TextField
          label="Age"
          variant="outlined"
          type="number"
          value={user.age}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'UPDATE_USER',
              payload: { age: e.target.value }
            })
          }}
        />

        <TextField
          label="Weight"
          variant="outlined"
          type="number"
          value={user.weight}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'UPDATE_USER',
              payload: { weight: e.target.value }
            })
          }}
        />

        <FormGroup>
          <FormControlLabel
            label="Smoker"
            control={
              <Checkbox
                checked={user.smoker}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  dispatch({
                    type: 'UPDATE_USER',
                    payload: { smoker: e.target.checked }
                  })
                }}
              />
            }
          />
        </FormGroup>

        <Button
          variant="contained"
          onClick={() => void handleUpdateUser()}
          sx={{ maxWidth: '10rem' }}
        >
          Submit
        </Button>
      </Stack>
    </>
  );
};
