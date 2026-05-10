import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import { StrictMode } from 'react';
import { ConfigProvider } from 'antd';
import './index.css';
import App from './App.jsx';
import fa_IR from "antd/lib/locale/fa_IR";


domReady(() => {
    const root = createRoot(
        document.getElementById('identity-press-admin-root')
    );

    root.render(
        <StrictMode>
                <ConfigProvider
                    locale={fa_IR}
                >
                    <App />
                </ConfigProvider>
        </StrictMode>,
    );
});