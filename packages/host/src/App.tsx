import * as React from 'react';

const Remote1 = React.lazy(() => import('remote1/App'));
const Remote2 = React.lazy(() => import('remote2/App'));

const App: React.FC = () => {
  return (
    <>
      <React.Suspense fallback={<>Loading Remote1</>}>
        <Remote1 />
      </React.Suspense>
      <React.Suspense fallback={<>Loading Remote2</>}>
        <Remote2 />
      </React.Suspense>
    </>
  );
};

export default App;
