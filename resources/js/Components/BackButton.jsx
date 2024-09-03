import React from 'react';
import { usePage } from '@inertiajs/react';
import { IconArrowBack, IconArrowLeft } from '@tabler/icons-react';

const BackButton = () => {
  const { props } = usePage();

  const goBack = () => {
    window.history.back(); // This will take the user to the previous page
  };

  return (
    
      <IconArrowLeft onClick={goBack} className='cursor-pointer mb-2'/>
    
  );
};

export default BackButton