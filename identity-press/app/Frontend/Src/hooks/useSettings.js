import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { notification } from 'antd';
import { __ } from '@wordpress/i18n';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

export default function useSettings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchSettings = async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const response = await apiFetch({ path: '/identity-press/v1/settings' });
            setSettings(response);
        } catch (error) {
            notification.error({
                message: __('Error', 'identity-press'),
                description: __('Failed to load settings from server.', 'identity-press'),
                placement: 'bottomRight',
                icon: <CloseCircleOutlined className="text-red-500" />,
                className: ' !border-red-100 !bg-red-50'
            });
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const saveSettings = async (group, data) => {
        try {
            setSaving(true);
            await apiFetch({
                path: `/identity-press/v1/settings/${group}`,
                method: 'POST',
                data,
            });
            notification.success({
                message: __('Success', 'identity-press'),
                description: __('Your changes have been saved and applied.', 'identity-press'),
                placement: 'bottomRight',
                icon: <CheckCircleOutlined className="text-indigo-500" />,
                className: ' !border-indigo-100 !bg-indigo-50'
            });
            await fetchSettings(true);
        } catch (error) {
            notification.error({
                message: __('Save Failed', 'identity-press'),
                description: __('Unable to sync settings with the backend.', 'identity-press'),
                placement: 'bottomRight',
                icon: <CloseCircleOutlined className="text-red-500" />,
                className: ' !border-red-100 !bg-red-50'
            });
        } finally {
            setSaving(false);
        }
    };

    const addGateway = async (data) => {
        try {
            setSaving(true);
            await apiFetch({
                path: '/identity-press/v1/gateways',
                method: 'POST',
                data,
            });
            notification.success({
                message: __('Gateway Added', 'identity-press'),
                description: __('The new SMS gateway is now active.', 'identity-press'),
                placement: 'bottomRight',
                icon: <CheckCircleOutlined className="text-indigo-500" />,
                className: ' !border-indigo-100 !bg-indigo-50'
            });
            await fetchSettings();
        } catch (error) {
            notification.error({
                message: __('Gateway Error', 'identity-press'),
                description: __('Could not register the new provider.', 'identity-press'),
                placement: 'bottomRight',
                icon: <CloseCircleOutlined className="text-red-500" />,
                className: ' !border-red-100 !bg-red-50'
            });
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return {
        settings,
        loading,
        saving,
        saveSettings,
        addGateway,
        refresh: fetchSettings
    };
}
