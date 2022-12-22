import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { extendTheme, ChakraProvider } from '@chakra-ui/react';
import reportWebVitals from './reportWebVitals';

// components
import AppRoot from './components/AppRoot/AppRoot';

// Create react-query client
const queryClient = new QueryClient();

// override checkbox label style a bit to silence chakra-ui error, when checkbox used in modal...
const theme = extendTheme({
  components: {
    Checkbox: {
      baseStyle: {
        label: {
          touchAction: 'none',
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.Fragment>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <AppRoot />
        </ChakraProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.Fragment>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
