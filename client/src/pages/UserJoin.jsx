import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserOtp from './UserOtp';

function UserJoin() {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
    const { adminId, queueId } = useParams();
    const [showUserOtp, setShowUserOtp] = useState(false);

    const handlePhoneNumberChange = (e) => {
        const inputValue = e.target.value;
        const isValid = /^(\+65)?[689]\d{7}$/.test(inputValue);
        setIsValidPhoneNumber(isValid);
        setPhoneNumber(inputValue);
    };

    const handleNextClick = async () => {
        if (isValidPhoneNumber) {
            try {
                const response = await fetch(`http://localhost:8080/ticket/${adminId}/queue/${queueId}/checkPhoneNumberUnique`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ phone_no: phoneNumber }),
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        console.log("checkPhoneNumberUnique", result);

                        // If the phone number is unique, generate OTP before navigating to the OTP page
                        try {
                            const otpResponse = await fetch(`http://localhost:8080/ticket/${adminId}/queue/${queueId}/generateOTP`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ phone_no: phoneNumber }),
                            });

                            if (otpResponse.ok) {
                                const otpResult = await otpResponse.json();
                                console.log("generateOTP", otpResult);

                                // If the phone number is unique, set the state to show UserOtp component
                                setShowUserOtp(true);
                            } else {
                                console.log(`Error generating OTP: ${otpResponse.status} - ${otpResponse.statusText}`);
                            }
                        } catch (otpError) {
                            console.error('Error generating OTP:', otpError.message);
                        }
                    } else {
                        console.log('Phone number already exists in the queue. Please enter a different number.');
                    }
                } else {
                    console.log(`Error checking phone number uniqueness: ${response.status} - ${response.statusText}`);
                }
            } catch (error) {
                console.error('Error checking phone number uniqueness:', error.message);
            }
        } else {
            console.log('Invalid phone number. Please enter a valid Singapore phone number.');
        }
    };






    return (
        <>
            {showUserOtp ? (
                <UserOtp
                    adminId={adminId}
                    queueId={queueId}
                    phoneNumber={phoneNumber}
                />
            ) : (
                <div className="flex items-center justify-center h-screen">
                    <div className="w-80">
                        <div className="mb-6 text-center text-black text-4xl font-normal">Join Queue</div>
                        <div className="mb-6 relative">
                            <input
                                type="tel"
                                className={`w-full p-2 h-12 border-2 rounded-md outline-none ${isValidPhoneNumber ? 'border-black' : 'border-red-500'}`}
                                placeholder="Phone Number"
                                pattern="^(\+65)?[689]\d{7}$"
                                value={phoneNumber}
                                onChange={handlePhoneNumberChange}
                            />
                            {!isValidPhoneNumber && (
                                <div className="mt-1 text-red-500 text-sm font-normal">Invalid phone number. Please enter a valid Singapore phone number.</div>
                            )}
                        </div>
                        <div className="relative">
                            <button
                                className="w-full h-12 bg-black rounded-md text-white text-xs font-black uppercase tracking-wide"
                                onClick={handleNextClick}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserJoin;
