import * as React from 'react';
import { Test, testState } from 'shared';
import { useRecoilState } from 'recoil';

const Remote1 = React.lazy(() => import('remote1/App'));
const Remote2 = React.lazy(() => import('remote2/App'));

const App: React.FC = () => {
  const [test, setTest] = useRecoilState(testState);

  return (
    <>
      <p>Host Recoil State : {test}</p>
      <button onClick={() => setTest('Host')}>Host Recoil Set State</button>
      <React.Suspense fallback={<>Loading Remote1</>}>
        <Remote1 />
      </React.Suspense>
      <React.Suspense fallback={<>Loading Remote2</>}>
        <Remote2 />
      </React.Suspense>
      <Test />
    </>
  );
};

export default App;
