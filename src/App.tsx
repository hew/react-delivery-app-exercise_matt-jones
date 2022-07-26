import './App.css';
import {useAppState} from './hooks';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Deliveries, DeliveryItems, NotFound} from './components';
import {ErrorBoundary} from './error-boundary';

function Content() {
  const {appState, dispatch, updateStatus} = useAppState();

  if (!appState.deliveries.length) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={
            <Deliveries
              updateStatus={updateStatus}
              appState={appState}
              dispatch={dispatch}
            />
          }
        />
        <Route
          path=":id/items"
          element={<DeliveryItems appState={appState} updateStatus={updateStatus} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <main className="page">
      <h1 className="page-header">Foodee Delivery Exercise</h1>
      <ErrorBoundary>
        <Content />
      </ErrorBoundary>
    </main>
  );
}

export default App;
