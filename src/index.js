import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faFrog, faStar, faRocket, faCat, faQuestion, faCircleQuestion, faCoffee, faPoo, faDog } from '@fortawesome/free-solid-svg-icons'

library.add(fab, faFrog, faStar, faRocket, faCat, faQuestion, faCircleQuestion, faCoffee, faPoo, faDog)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
