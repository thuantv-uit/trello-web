import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme'
// Using react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// Cấu hình MUI Dialog
import { ConfirmProvider } from 'material-ui-confirm'
// Cấu hingh Redux Store
import { Provider } from 'react-redux'
import { store } from '~/redux/store'


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <CssVarsProvider theme={theme}>
      <ConfirmProvider>
        <CssBaseline/>
        <App />
        <ToastContainer position="bottom-right" theme="colored" />
      </ConfirmProvider>
    </CssVarsProvider>
  </Provider>
)
