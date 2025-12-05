import Navbar from "../nav/Navbar";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { usersAPI } from "../../features/auth/userAPI";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type RegisterInputs = {
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  password: string;
  confirmPassword: string;
};

const schema = yup.object({
  first_name: yup.string().max(50, "Max 50 characters").required("First name is required"),
  last_name: yup.string().max(50, "Max 50 characters").required("Last name is required"),
  email: yup.string().email("Invalid email").max(100, "Max 100 characters").required("Email is required"),
  department: yup.string().max(100, "Max 100 characters").required("Department is required"),
  password: yup.string().min(6, "Min 6 characters").max(20, "Max 20 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export const Register = () => {
  const navigate = useNavigate();
  const [createUser, { isLoading }] = usersAPI.useCreateUsersMutation();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    try {
      await createUser(data).unwrap();
      toast.success("Registration successful! Please check your email to verify your account.");
      setTimeout(() => {
        navigate("/register/verify", { state: { email: data.email } });
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-base-200 p-4">
        <div className="w-full max-w-lg p-8 rounded-xl shadow-lg bg-white">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Employee Registration</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input {...register("first_name")} placeholder="First Name" className="input input-bordered w-full" />
            <p className="text-error text-sm">{errors.first_name?.message}</p>

            <input {...register("last_name")} placeholder="Last Name" className="input input-bordered w-full" />
            <p className="text-error text-sm">{errors.last_name?.message}</p>

            <input {...register("email")} type="email" placeholder="Email" className="input input-bordered w-full" />
            <p className="text-error text-sm">{errors.email?.message}</p>

            <input {...register("department")} placeholder="Department" className="input input-bordered w-full" />
            <p className="text-error text-sm">{errors.department?.message}</p>

            <input {...register("password")} type="password" placeholder="Password" className="input input-bordered w-full" />
            <p className="text-error text-sm">{errors.password?.message}</p>

            <input {...register("confirmPassword")} type="password" placeholder="Confirm Password" className="input input-bordered w-full" />
            <p className="text-error text-sm">{errors.confirmPassword?.message}</p>

            <button type="submit" className="btn btn-primary w-full mt-4" disabled={isLoading}>
              {isLoading ? <span className="loading loading-spinner text-white" /> : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
          </p>
        </div>
      </div>
    </>
  );
};
