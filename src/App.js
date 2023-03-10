import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import DmScreen from './pages/dm-screen.js';
import PlayerView from './pages/player-view.js';

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router basename='/dm-screen'>
        <Routes>
          <Route exact path='/' element={<DmScreen />} />
          <Route exact path='/?/players' element={<PlayerView />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
