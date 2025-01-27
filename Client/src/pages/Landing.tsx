import LoginForm from "@/features/auth/components/LoginForm";
import RegisterForm from "@/features/auth/components/RegisterForm";
import React, { useState } from "react"

const Landing: React.FC = () => {

    const [activeTab, setActiveTab] = useState('signup');

    return (
        <div className="h-[100vh] flex flex-col items-center justify-center bg-gray-100 md:p-4">
            <div className="bg-white px-2 md:p-8 rounded-lg shadow-lg w-full">
                <div className="flex mb-6 border-b border-gray-300 mt-4 md:mt-0">
                    <button
                        className={`w-1/2 py-3 text-lg font-semibold ${activeTab === 'signup' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'} transition-colors duration-300`}
                        onClick={() => setActiveTab('signup')}
                    >
                        Sign Up
                    </button>
                    <button
                        className={`w-1/2 py-3 text-lg font-semibold ${activeTab === 'login' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'} transition-colors duration-300`}
                        onClick={() => setActiveTab('login')}
                    >
                        Login
                    </button>
                </div>
                <header className="w-full text-center ">
                    <p className="text-xl md:text-2xl font-bold text-gray-800">
                        Welocome to Friend Connections
                    </p>
                </header>
                {activeTab === 'signup' && <RegisterForm />}
                {activeTab === 'login' && <LoginForm />}
            </div>
        </div>
    )
}

export default Landing