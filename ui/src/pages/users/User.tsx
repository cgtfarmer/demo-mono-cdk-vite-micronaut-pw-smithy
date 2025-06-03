import { useEffect, useReducer } from 'react';
import userReducer, { userInitialState } from '../../reducer/user-reducer';
import { Link as RouterLink, Params, useParams } from 'react-router';
import { Divider, Link, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { UserAccessor } from '../../accessors/user/user-accessor';
// import FakeUserAccessor from '../../accessors/user/fake-user-accessor';
import ApiUserAccessor from '../../accessors/user/api-user-accessor';
import { UserServiceClient } from '@cgtfarmer/user-service-client';
import { ApiUserAccessorMapper } from '../../accessors/user/api-user-accessor-mapper';

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

  if (!user.id) return null;

  const rows = [
    { key: 'ID', value: user.id },
    { key: 'First Name', value: user.firstName },
    { key: 'Last Name', value: user.lastName },
    { key: 'Age', value: user.age },
    { key: 'Weight', value: user.weight },
    { key: 'Smoker', value: user.smoker ? 'True' : 'False' }
  ];

  return (
    <>
      <Typography component="h1" variant="h4" gutterBottom>
        User
      </Typography>

      <Stack direction="row" gap="0.5rem">
        <Link component={RouterLink} to="/users">Back</Link>

        <Divider orientation="vertical" variant="middle" flexItem />

        <Link component={RouterLink} to={`/users/${user.id}/edit`}>Edit</Link>
      </Stack>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.key}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    width: '50%'
                  }}
                >
                  {row.key}
                </TableCell>
                <TableCell align="left">{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
