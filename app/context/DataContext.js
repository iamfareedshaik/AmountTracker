import React, { createContext, useContext, useState } from 'react';
const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [sharedData, setSharedData] = useState([]);
  const [SplitType,setSplitType] = useState('Equally');
  const [basketid,setBasketId] = useState()

  const updateData = (newData) => {
    setSharedData(newData);
  };

  const updateSplitType = (newData) => {
    setSplitType(newData);
  }

  const updateBasketId = (newData) => {
    setBasketId(newData);
  }

  return (
    <DataContext.Provider value={{ sharedData, updateData, SplitType, updateSplitType, basketid, updateBasketId  }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
