import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { message } from 'antd';

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
            message.error('Failed to load settings');
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
            message.success('Settings updated successfully');
            await fetchSettings(true);
        } catch (error) {
            message.error('Failed to save settings');
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
            message.success('Gateway added successfully');
            await fetchSettings();
        } catch (error) {
            message.error('Failed to add gateway');
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
