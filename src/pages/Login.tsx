import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

const Login = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <h1>Login Page</h1>
        <p>This is a placeholder for the login page.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    </MainLayout>
  );
};

export default Login;