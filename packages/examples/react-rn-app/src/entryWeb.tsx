import ReactDOMClient from 'react-dom/client';
import App from './App';

const element = document.querySelector('#root')!;

const root = ReactDOMClient.createRoot(element);
root.render(<App />)
