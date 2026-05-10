import { __ } from '@wordpress/i18n';
import { Form, Input, Select, Button, Switch, Card, Divider, Row, Col, Typography, Tag, Alert } from 'antd';
import { 
    SettingOutlined, 
    SaveOutlined, 
    ExperimentOutlined, 
    ShoppingCartOutlined,
    LockOutlined,
    LoginOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function GeneralSettings() {
    return (
        <div className="space-y-8 animate-in">
            <div>
                <Title level={4} className="!mb-1 !font-bold">{__('Core Configuration', 'identity-press')}</Title>
                <Text type="secondary">{__('Manage your authentication protocols and system security.', 'identity-press')}</Text>
            </div>

            <Form layout="vertical">
                <Row gutter={[32, 32]}>
                    <Col span={24} lg={16}>
                        <div className="space-y-6">
                            {/* Authentication Protocol */}
                            <Card className="!border-slate-200">
                                <div className="flex items-center gap-2 mb-8">
                                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                        <SettingOutlined />
                                    </div>
                                    <Text className="font-bold text-slate-800">{__('Authentication Protocol', 'identity-press')}</Text>
                                </div>
                                
                                <Row gutter={[24, 24]}>
                                    <Col span={24} md={12}>
                                        <Form.Item label={__('Identifier Method', 'identity-press')} name="login_method">
                                            <Select defaultValue="phone">
                                                <Select.Option value="phone">{__('Phone Number Only', 'identity-press')}</Select.Option>
                                                <Select.Option value="email_phone">{__('Email & Phone Number', 'identity-press')}</Select.Option>
                                                <Select.Option value="username">{__('Username & Password', 'identity-press')}</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24} md={12}>
                                        <Form.Item label={__('OTP Length', 'identity-press')} name="otp_length">
                                            <Select defaultValue="5">
                                                <Select.Option value="4">4 {__('Digits', 'identity-press')}</Select.Option>
                                                <Select.Option value="5">5 {__('Digits', 'identity-press')}</Select.Option>
                                                <Select.Option value="6">6 {__('Digits (Recommended)', 'identity-press')}</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Divider className="!my-8" />

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 transition-colors hover:border-slate-200 group">
                                        <div className="flex gap-4">
                                            <ExperimentOutlined className="text-slate-400 mt-1" />
                                            <div>
                                                <Text className="block font-bold text-slate-700">{__('Develop Mode', 'identity-press')}</Text>
                                                <Text type="secondary" className="text-xs">{__('OTP codes will be printed to the browser console.', 'identity-press')}</Text>
                                            </div>
                                        </div>
                                        <Switch />
                                    </div>
                                </div>
                            </Card>

                            {/* WooCommerce Integration */}
                            <Card className="!border-slate-200">
                                <div className="flex items-center gap-2 mb-8">
                                    <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                                        <ShoppingCartOutlined />
                                    </div>
                                    <Text className="font-bold text-slate-800">{__('WooCommerce Integration', 'identity-press')}</Text>
                                </div>

                                <div className="space-y-4">
                                    {!identityPressAdmin?.is_wc_active && (
                                        <Alert
                                            message={__('WooCommerce Not Detected', 'identity-press')}
                                            description={__('WooCommerce must be active to enable these integration features.', 'identity-press')}
                                            type="warning"
                                            showIcon
                                            className="!rounded-xl !mb-6"
                                        />
                                    )}
                                    <div className={`space-y-4 ${!identityPressAdmin?.is_wc_active ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 transition-colors hover:border-slate-200 group">
                                            <div className="flex gap-4">
                                                <LoginOutlined className="text-slate-400 mt-1" />
                                                <div>
                                                    <Text className="block font-bold text-slate-700">{__('Replace Login Form', 'identity-press')}</Text>
                                                    <Text type="secondary" className="text-xs">{__('Use IdentityPress OTP login instead of default WooCommerce login form.', 'identity-press')}</Text>
                                                </div>
                                            </div>
                                            <Switch name="wc_replace_login" />
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 transition-colors hover:border-slate-200 group">
                                            <div className="flex gap-4">
                                                <LockOutlined className="text-slate-400 mt-1" />
                                                <div>
                                                    <Text className="block font-bold text-slate-700">{__('Lock Checkout', 'identity-press')}</Text>
                                                    <Text type="secondary" className="text-xs">{__('Force users to authenticate before accessing the checkout page.', 'identity-press')}</Text>
                                                </div>
                                            </div>
                                            <Switch name="wc_lock_checkout" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Col>

                    <Col span={24} lg={8}>
                        <Card className="!bg-slate-50 !border-slate-200">
                            <Text className="block font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-6">{__('System Information', 'identity-press')}</Text>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <Text className="text-xs font-semibold text-slate-500">{__('Plugin Version', 'identity-press')}</Text>
                                    <Text className="text-xs font-mono text-slate-400">v{identityPressAdmin?.version}</Text>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <div className="flex justify-end mt-10">
                    <Button type="primary" icon={<SaveOutlined />} size="large">
                        {__('Save Settings', 'identity-press')}
                    </Button>
                </div>
            </Form>
        </div>
    );
}
