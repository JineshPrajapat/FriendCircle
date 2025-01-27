import InputField from "@/common/InputField";
import { register } from "@/services/auth";
import { AppDispatch } from "@/store/store";
import React, { useState } from "react"
import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";

const RegisterForm: React.FC = () => {

    // const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [formData, setFormData] = useState({
        userName: '',
        fullName: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [success, _] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (!formData.userName || !formData.password || !formData.confirmPassword) {
            setError('Please fill out all fields');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        dispatch(register(formData));

        setFormData({
            userName: '',
            fullName: '',
            password: '',
            confirmPassword: ''
        })
    };

    return (
        <div className="h-[84vh] flex items-center justify-center md:bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-gray-100 md:bg-white p-3 md:p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Sign Up</h2>

                {error && <div className="text-red-500 mb-4">{error}</div>}
                {success && <div className="text-green-500 mb-4">{success}</div>}

                <InputField
                    label="Username"
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                />

                <InputField
                    label="Full Name"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                />

                <InputField
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                />

                <InputField
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                />

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
                >
                    Sign Up
                </button>
            </form>
        </div>
    )
}

export default RegisterForm;