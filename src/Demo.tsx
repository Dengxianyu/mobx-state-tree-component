import React, { useState } from 'react';
import PrivateStateWithMST from './modules/PrivateStateWithMST';

function Demo() {
  const [number, setNumber] = useState(0);
  console.log("🚀 ~ file: Demo.tsx:6 ~ Demo ~ number:", number)
  return (
    <>
      <button onClick={() => setNumber(number + 1)}>add</button> {number}
      <PrivateStateWithMST />
    </>
  );
}

export default Demo;
