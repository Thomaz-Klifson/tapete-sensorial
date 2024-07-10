import React, { useEffect } from 'react';

const Game = () => {
  useEffect(() => {
    window.api.loadHtml('index.html')
      .then(response => {
        if (response.success) {
          console.log(response.message);
        } else {
          console.error(response.message);
        }
      });
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
    </div>
  );
};

export default Game;
