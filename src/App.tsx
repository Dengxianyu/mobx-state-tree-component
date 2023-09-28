import React, { useState } from 'react';
import S1, { S1Model } from './modules/S1';
import S2 from './modules/S2';
import A from './modules/A';
import S3 from './modules/S3';

function App() {
  return (
    <S1 s1P1='s1' s1P2={{name: 's1P2', value: 'vv'}}>
      <S2 s2P1='s2' s2P2={{name: 's2P2', value: 'vv'}}>
        <A aP1='a' aP2={{name: 'aP2', value: 'vv'}}>render A</A>
      </S2>
      <S3 s3P1='s2' s3P2={{name: 's3P2', value: 'vv'}}>
        <A aP1='a' aP2={{name: 'aP2', value: 'vv'}}>render A</A>
      </S3>
    </S1>
  );
}

export default App;
