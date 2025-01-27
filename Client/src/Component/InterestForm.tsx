import { getUserData, updateInterest } from '@/services/networkManagement';
import { AppDispatch } from '@/store/store';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';


// Type for interest list
const interests: string[] = [
    'Coding',
    'Reading Books',
    'Machine Learning',
    'Travelling',
    'Music',
    'Sports',
    'Photography',
    'Gaming',
    'Cooking',
    'Writing',
    'Movies',
    'Fitness',
];

const InterestForm: React.FC = () => {
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const { userId } = useParams<{ userId: string }>();

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (userId) {
                dispatch(getUserData({ userId }));
            }
        }, 2000);

        return () => clearInterval(intervalId);
    }, [dispatch]);

    const handleSelectInterest = (interest: string): void => {
        if (selectedInterests.includes(interest)) {
            // Remove interest if already selected
            setSelectedInterests(selectedInterests.filter((i) => i !== interest));
        } else {
            // Add interest if not selected
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        dispatch(updateInterest({ selectedInterests }));
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4">Select Your Interests</h2>

            {/* Display available interests */}
            <div className="mb-4">
                <h3 className="font-medium">Available Interests:</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                    {interests.map((interest, index) => (
                        <button
                            key={index}
                            className={`px-4 py-2 rounded-md  ${selectedInterests.includes(interest)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                                }`}
                            onClick={() => handleSelectInterest(interest)}
                        >
                            {interest}
                        </button>
                    ))}
                </div>
            </div>

            <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={handleSubmit}
            >
                Save Interests
            </button>
        </div>
    );
};

export default InterestForm;
