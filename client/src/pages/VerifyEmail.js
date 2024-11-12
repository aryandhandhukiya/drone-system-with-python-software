import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../utils/services';
import { Context } from '../context/Context';

const VerifyEmail = () => {
  const { notifyAlert, socket, socketConnect } = useContext(Context);
  const { token } = useParams();
  const [isUserVerified, setIsUserVerified] = useState(null);

  const handleVerification = async () => {
    try {
      const response = await axios.post(`${baseUrl}/api/disaster/auth`, { token });
      console.log(response);
      if (response.data?.error) {
        setIsUserVerified(false);
      } else if (response.data.message === 'Alert sent') {
        await notifyAlert(response.data.data);
        setIsUserVerified(true);
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      setIsUserVerified(false);
    }
  };

  useEffect(() => {
    if (isUserVerified === null && socket != null) {
      handleVerification();
    }
  }, [isUserVerified, socket]);

  if (isUserVerified === null) {
    return <p>Loading...</p>; // You can replace this with a loading indicator
  } else if (!isUserVerified) {
    return <p>Alert failed</p>;
  } else if (isUserVerified) {
    return (
      <>Alert Sent</>
    );
  }
};

export default VerifyEmail;
