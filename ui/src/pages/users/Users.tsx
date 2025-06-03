import { useEffect, useReducer } from 'react';
import usersReducer, { usersInitialState } from '../../reducer/users-reducer';
import { Link as RouterLink } from 'react-router';
import { Link, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { UserAccessor } from '../../accessors/user/user-accessor';
// import FakeUserAccessor from '../../accessors/user/fake-user-accessor';
import ApiUserAccessor from '../../accessors/user/api-user-accessor';
import { UserServiceClient } from '@cgtfarmer/user-service-client';
import { ApiUserAccessorMapper } from '../../accessors/user/api-user-accessor-mapper';

// const userClient: UserAccessor = new FakeUserAccessor();
const userClient: UserAccessor = new ApiUserAccessor(
  new UserServiceClient({
    endpoint: import.meta.env.VITE_API_URL as string
  }),
  new ApiUserAccessorMapper()
);

export default function Page() {
  const [users, dispatch] = useReducer(usersReducer, usersInitialState);

  const handleDestroyUser = async (userId: string | undefined) => {
    const confirmation = window.confirm('Are you sure you want to delete this?');

    if (!confirmation) return;

    if (!userId) return;

    const deleteSuccessful = await userClient.destroy(userId);

    if (!deleteSuccessful) return;

    const users = await userClient.fetchAll();

    dispatch({ type: 'SET_USERS', payload: users })
  };

  useEffect(() => {
    async function fetchUsers() {
      const users = await userClient.fetchAll();

      dispatch({ type: 'SET_USERS', payload: users })
    }

    void fetchUsers();
  }, []);

  return (
    <>
      <Typography component="h1" variant="h4" gutterBottom>
        Users
      </Typography>

      <Link component={RouterLink} to="/users/new">Create</Link>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>Smoker</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.age}</TableCell>
                <TableCell>{user.weight}</TableCell>
                <TableCell>{user.smoker ? 'True' : 'False' }</TableCell>
                <TableCell>
                  <Stack direction="row" gap="0.5rem">
                    <Link
                      component={RouterLink}
                      to={`/users/${user.id ? user.id.toString() : ''}`}
                    >
                      Show
                    </Link>

                    <Link
                      component={RouterLink}
                      to={`/users/${user.id ? user.id.toString() : ''}/edit`}
                    >
                      Edit
                    </Link>

                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => void handleDestroyUser(user.id)}
                    >
                      Delete
                    </Link>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
