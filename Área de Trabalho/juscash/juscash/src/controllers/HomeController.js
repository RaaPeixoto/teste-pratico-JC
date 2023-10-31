import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Home } from '../pages/index.js';
import { Loading } from '../components/index.js';

function HomeController() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
    setLoading(false);
  }, [user, navigate]);

  if (loading) {
    return <Loading />;
  }

  return <Home />;
}

export default HomeController;