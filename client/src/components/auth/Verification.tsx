import Navbar from "../nav/Navbar"
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { usersAPI } from '../../features/auth/userAPI';
import { Footer } from '../footer/Footer';

type VerifyInputs = {
    email: string;
    code: string;
};

const schema = yup.object({
    email: yup.string().email('Invalid email').max(100, 'Max 100 characters').required('Email is required'),
    code: yup.string().length(6, 'Must be exactly 6 characters').required('Code is required'),
});

export const Verification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const emailFromState = location.state?.email || '';

    const [verifyUser, { isLoading }] = usersAPI.useVerifyUserMutation();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<VerifyInputs>({
        resolver: yupResolver(schema),
        defaultValues: { email: emailFromState }
    })

    const onSubmit: SubmitHandler<VerifyInputs> = async (data) => {
        try {
            await verifyUser(data).unwrap();
            toast.success("Account verified successfully! Please login.");
            navigate("/login");
        } catch (error) {
            console.log("Verification error:", error);
            toast.error("Verification failed. Please check your code.");
        }
    }

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center min-h-screen bg-base-200">
                <div className="w-full max-w-lg p-8 rounded-xl shadow-lg bg-white">
                    <h1 className="text-3xl font-bold mb-6 text-center">Verify your Account</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <input
                            type="email"
                            {...register("email")}
                            placeholder="Email"
                            className="input border border-gray-300 rounded w-full p-2 text-lg"
                        />
                        {errors.email && (
                            <span className="text-sm text-red-700">{errors.email.message}</span>
                        )}

                        <input
                            type="text"
                            {...register("code")}
                            placeholder="Verification Code"
                            className="input border border-gray-300 rounded w-full p-2 text-lg"
                        />
                        {errors.code && (
                            <span className="text-sm text-red-700">{errors.code.message}</span>
                        )}

                        <button type="submit" className="btn btn-primary w-full mt-4" disabled={isLoading}>
                            {isLoading ? <span className="loading loading-spinner text-white" /> : "Verify your Account"}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    )
}