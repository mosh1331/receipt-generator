import logo from './logo.svg'
import './App.css'
import RootRoutes from './route/RootRoutes'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'


function App () {
  return <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RootRoutes />
    </PersistGate>
  </Provider>
}

export default App
