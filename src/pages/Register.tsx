import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

const Register = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <h1>Register Page</h1>
        <p>This is a placeholder for the registration page.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    </MainLayout>
  );
};

export default Register;