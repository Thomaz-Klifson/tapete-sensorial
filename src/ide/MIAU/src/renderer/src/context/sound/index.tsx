import React, { createContext, useState } from 'react';

// Cria o contexto
export const BlockContext = createContext();

export const BlockProvider = ({ children }) => {
  const [blockAudios, setBlockAudios] = useState({
    'sound-0': { name: '', type: '' },
    'sound-1': { name: '', type: '' },
    'sound-2': { name: '', type: '' },
    'sound-3': { name: '', type: '' },
    'sound-4': { name: '', type: '' },
    'sound-5': { name: '', type: '' },
    'sound-6': { name: '', type: '' },
    'sound-7': { name: '', type: '' },
    'sound-8': { name: '', type: '' },
  });

  const [blockImages, setBlockImages] = useState({
    'animal-0': { name: '', type: '', data: '' },
    'animal-1': { name: '', type: '', data: '' },
    'animal-2': { name: '', type: '', data: '' },
    'animal-3': { name: '', type: '', data: '' },
    'animal-4': { name: '', type: '', data: '' },
    'animal-5': { name: '', type: '', data: '' },
    'animal-6': { name: '', type: '', data: '' },
    'animal-7': { name: '', type: '', data: '' },
    'animal-8': { name: '', type: '', data: '' },
  });

  const [blockBackgrounds, setBlockBackgrounds] = useState({
    'bg-0': { name: '', type: '', data: '' },
    'bg-1': { name: '', type: '', data: '' },
    'bg-2': { name: '', type: '', data: '' },
    'bg-3': { name: '', type: '', data: '' },
    'bg-4': { name: '', type: '', data: '' },
    'bg-5': { name: '', type: '', data: '' },
    'bg-6': { name: '', type: '', data: '' },
    'bg-7': { name: '', type: '', data: '' },
    'bg-8': { name: '', type: '', data: '' },
  });

  return (
    <BlockContext.Provider value={{ blockAudios, setBlockAudios, blockImages, setBlockImages, blockBackgrounds, setBlockBackgrounds }}>
      {children}
    </BlockContext.Provider>
  );
};
