import { ChangeEvent, useReducer } from 'react';
import userReducer, { userInitialState } from '../../reducer/user-reducer';
import ApiUserAccessor from '../../accessors/user/api-user-accessor';
import { UserServiceClient } from '@cgtfarmer/user-service-client';
import { ApiUserAccessorMapper } from '../../accessors/user/api-user-accessor-mapper';
import { UserAccessor } from '../../accessors/user/user-accessor';
import { Button, Checkbox, FormControlLabel, FormGroup, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

// const userClient: UserAccessor = new FakeUserAccessor();
const userClient: UserAccessor = new ApiUserAccessor(
  new UserServiceClient({
    endpoint: import.meta.env.VITE_API_URL as string
  }),
  new ApiUserAccessorMapper()
);

export default function Page() {
  const [user, dispatch] = useReducer(userReducer, userInitialState);

  const navigate = useNavigate();

  const handleCreateUser = async (): Promise<void> => {
    console.log('NewUser#handleCreateUser');

    const newUser = await userClient.create(user);

    if (!newUser) {
      console.error('Create user failed');
      return;
    }

    await navigate(`/users/${newUser.id}`);
  };

  return (
    <>
      <Typography component="h1" variant="h4" gutterBottom>
        Add user
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
          onClick={() => void handleCreateUser()}
          sx={{ maxWidth: '10rem' }}
        >
          Submit
        </Button>
      </Stack>
    </>
  );
};
