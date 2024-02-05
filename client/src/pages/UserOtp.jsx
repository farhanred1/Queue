import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserOtp({ adminId, queueId, phoneNumber }) {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const otpInputRefs = Array.from({ length: 6 }, () => React.createRef());

    const handleOtpChange = (index, value) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to the next input field automatically
        if (value && index < otp.length - 1) {
            otpInputRefs[index + 1].current.focus();
        } else if (!value && index > 0) {
            // If deleting and the current field is empty, move to the previous field
            otpInputRefs[index - 1].current.focus();
        }
    };

    const handleJoinClick = async () => {
        // Handle join button click with OTP
        const enteredOtp = otp.join('');
        console.log('Join button clicked with OTP:', enteredOtp);
      
        try {
          // Verify OTP
          const verifyResponse = await fetch(`http://localhost:8080/ticket/${adminId}/queue/${queueId}/verifyOTP`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phone_no: phoneNumber,
              otp: enteredOtp,
            }),
          });
      
          if (verifyResponse.ok) {
            console.log('OTP verified successfully');
      
            // Create Ticket
            const createTicketResponse = await fetch(`http://localhost:8080/ticket/${adminId}/queue/${queueId}/createTicket`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                phone_no: phoneNumber,
              }),
            });
      
            if (createTicketResponse.ok) {
              const ticketResult = await createTicketResponse.json();
              console.log('createTicket', ticketResult);
                const ticketId = ticketResult.ticket._id;
              // Redirect to the new empty page or perform any other actions
              navigate(`/dashboard/${adminId}/${queueId}/${ticketId}`);
            } else {
              console.log(`Error creating ticket: ${createTicketResponse.status} - ${createTicketResponse.statusText}`);
            }
          } else {
            console.log(`Error verifying OTP: ${verifyResponse.status} - ${verifyResponse.statusText}`);
          }
        } catch (error) {
          console.error('Error handling join click:', error.message);
        }
      };
      
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-80">
                <div className="mb-6 text-center text-black text-4xl font-normal">Enter OTP</div>
                <div className="mb-6 flex justify-between">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            className="w-12 h-12 border-2 rounded-md text-center"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            ref={otpInputRefs[index]}
                        />
                    ))}
                </div>
                <div className="relative">
                    <button className="w-full h-12 bg-black rounded-md text-white text-xs font-black uppercase tracking-wide"
                        onClick={handleJoinClick}
                    >
                        Join
                    </button>
                </div>

            </div>
        </div>
    )
}

export default UserOtp