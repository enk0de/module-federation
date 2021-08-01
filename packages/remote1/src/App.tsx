import React from 'react';
import { testState } from 'shared';
import { useRecoilState } from 'recoil';

const App: React.FC = () => {
  const [test, setTest] = useRecoilState(testState);
  return (
    <>
      <p>Remote1 Recoil State : {test}</p>
      <button onClick={() => setTest('Remote1')}>Remote1 Recoil Set State</button>
      Remote1
    </>
  );
};

export default App;
