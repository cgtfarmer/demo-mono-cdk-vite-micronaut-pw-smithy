import { Link } from "react-router";

export default function Page() {
  return (
    <>
      <h1>Page Not Found</h1>

      <p>The page you are looking for does not exist.</p>

      <Link to="/">Go to Home</Link>
    </>
  );
}
