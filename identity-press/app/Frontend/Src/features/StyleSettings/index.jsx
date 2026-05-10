import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { 
    Form, 
    Input, 
    Button, 
    Card, 
    ColorPicker, 
    Typography, 
    Row, 
    Col,
    Skeleton
} from 'antd';
import { 
    BgColorsOutlined, 
    SaveOutlined, 
    EditOutlined
} from '@ant-design/icons';
import useSettings from '../../hooks/useSettings';

const { Title, Text } = Typography;

export default function StyleSettings() {
    const { settings, loading, saving, saveSettings } = useSettings();
    const [form] = Form.useForm();

    useEffect(() => {
        if (settings?.style) {
            form.setFieldsValue(settings.style);
        }
    }, [settings, form]);

    const onFinish = (values) => {
        // Convert color objects to hex strings if necessary
        const processedValues = {
            ...values,
            primary_color: typeof values.primary_color === 'string' ? values.primary_color : values.primary_color?.toHexString?.() || values.primary_color,
            secondary_color: typeof values.secondary_color === 'string' ? values.secondary_color : values.secondary_color?.toHexString?.() || values.secondary_color,
        };
        saveSettings('style', processedValues);
    };

    if (loading) return <Skeleton active className="p-8" />;

    return (
        <div className="space-y-8 animate-in">
            <div>
                <Title level={4} className="!mb-1 !font-bold">{__('Branding & Styles', 'identity-press')}</Title>
                <Text type="secondary">{__('Customize your brand colors and apply custom CSS overrides.', 'identity-press')}</Text>
            </div>

            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[32, 32]}>
                    <Col span={24}>
                        <Card className="!border-slate-200">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                    <BgColorsOutlined />
                                </div>
                                <Text className="font-bold text-slate-800">{__('Brand Palette', 'identity-press')}</Text>
                            </div>
                            
                            <Row gutter={[24, 24]}>
                                <Col span={24} md={12}>
                                    <Form.Item label={__('Primary Brand Color', 'identity-press')} name="primary_color" getValueFromEvent={(color) => color.toHexString()}>
                                        <ColorPicker showText className="!w-full !justify-start !h-12 !bg-slate-50 !border-slate-100 !rounded-xl" />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={12}>
                                    <Form.Item label={__('Secondary Color', 'identity-press')} name="secondary_color" getValueFromEvent={(color) => color.toHexString()}>
                                        <ColorPicker showText className="!w-full !justify-start !h-12 !bg-slate-50 !border-slate-100 !rounded-xl" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Card className="!border-slate-200">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                                    <EditOutlined />
                                </div>
                                <Text className="font-bold text-slate-800">{__('Custom Styling', 'identity-press')}</Text>
                            </div>
                            <Form.Item label={__('Custom CSS Injection', 'identity-press')} name="custom_css">
                                <Input.TextArea 
                                    autoSize={{ minRows: 20, maxRows: 50 }}
                                    className="!font-mono text-xs"
                                    placeholder={__('/* Add your custom styles here */\n.ip-form-button {\n  text-transform: uppercase;\n}', 'identity-press')} 
                                />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>

                <div className="flex justify-end mt-8">
                    <Button 
                        type="primary" 
                        icon={<SaveOutlined />} 
                        size="large" 
                        htmlType="submit"
                        loading={saving}
                    >
                        {__('Save & Apply Styles', 'identity-press')}
                    </Button>
                </div>
            </Form>
        </div>
    );
}
