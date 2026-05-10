import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import { StrictMode } from 'react';
import { ConfigProvider } from 'antd';
import './index.css';
import App from './App.jsx';
import AuthForm from './features/AuthForm';
import fa_IR from "antd/lib/locale/fa_IR";

domReady(() => {
    // Render Admin Console
    const adminRoot = document.getElementById('identity-press-admin-root');
    if (adminRoot) {
        const root = createRoot(adminRoot);
        root.render(
            <StrictMode>
                <ConfigProvider locale={fa_IR}>
                    <App />
                </ConfigProvider>
            </StrictMode>
        );
    }

    // Render Frontend Auth Form (Shortcode)
    const authRoots = document.querySelectorAll('.identity-press-auth-root');
    if (authRoots.length > 0) {
        authRoots.forEach((container) => {
            const root = createRoot(container);
            root.render(
                <StrictMode>
                    <ConfigProvider locale={fa_IR} direction="rtl">
                        <AuthForm />
                    </ConfigProvider>
                </StrictMode>
            );
        });
    }
});