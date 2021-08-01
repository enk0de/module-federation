import React from 'react';
import { testState } from 'shared';
import { useRecoilState } from 'recoil';

const App: React.FC = () => {
  const [test, setTest] = useRecoilState(testState);
  return (
    <>
      <p>Remote2 Recoil State : {test}</p>
      <button onClick={() => setTest('Remote2')}>Remote2 Recoil Set State</button>
      Remote2
    </>
  );
};

export default App;
