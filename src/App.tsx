import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AppRouter } from './app-routes';

function App() {
  return (
    <div className="App">
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Notifications />
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </MantineProvider>
    </div>
  );
}

export default App;
