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
    Skeleton,
    Upload
} from 'antd';
import { 
    BgColorsOutlined, 
    SaveOutlined, 
    EditOutlined,
    PictureOutlined,
    DeleteOutlined
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

    const handleMediaUpload = () => {
        if (!window.wp || !window.wp.media) return;

        const mediaUploader = window.wp.media({
            title: __('Select Logo', 'identity-press'),
            button: {
                text: __('Use this logo', 'identity-press')
            },
            multiple: false
        });

        mediaUploader.on('select', () => {
            const attachment = mediaUploader.state().get('selection').first().toJSON();
            form.setFieldsValue({ logo_url: attachment.url });
        });

        mediaUploader.open();
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
                    <Col span={24} lg={16}>
                        <div className="space-y-8">
                            {/* Brand Logo */}
                            <Card className="!border-slate-200">
                                <div className="flex items-center gap-2 mb-8">
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                        <PictureOutlined />
                                    </div>
                                    <Text className="font-bold text-slate-800">{__('Brand Identity', 'identity-press')}</Text>
                                </div>

                                <Form.Item label={__('Company Logo', 'identity-press')} name="logo_url">
                                    <div className="flex items-start gap-6">
                                        <div className="w-32 h-32 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group relative">
                                            {form.getFieldValue('logo_url') ? (
                                                <>
                                                    <img src={form.getFieldValue('logo_url')} className="w-full h-full object-contain p-2" alt="Logo Preview" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <Button 
                                                            type="text" 
                                                            icon={<DeleteOutlined className="text-white" />} 
                                                            onClick={() => form.setFieldsValue({ logo_url: '' })}
                                                        />
                                                    </div>
                                                </>
                                            ) : (
                                                <PictureOutlined className="text-3xl text-slate-300" />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <Text type="secondary" className="text-xs block leading-relaxed">
                                                {__('Upload your organization logo to be displayed on the authentication forms. Recommended size: 512x512px (PNG or SVG).', 'identity-press')}
                                            </Text>
                                            <Button icon={<PictureOutlined />} onClick={handleMediaUpload}>
                                                {__('Choose from Media Library', 'identity-press')}
                                            </Button>
                                            <Form.Item name="logo_url" className="!mb-0 !mt-2">
                                                <Input placeholder={__('Or enter manual URL...', 'identity-press')} />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </Form.Item>
                            </Card>

                            {/* Brand Palette */}
                            <Card className="!border-slate-200">
                                <div className="flex items-center gap-2 mb-8">
                                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                        <BgColorsOutlined />
                                    </div>
                                    <Text className="font-bold text-slate-800">{__('Color Palette', 'identity-press')}</Text>
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
                        </div>
                    </Col>

                    <Col span={24} lg={8}>
                        <Card className="!border-slate-200">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                                    <EditOutlined />
                                </div>
                                <Text className="font-bold text-slate-800">{__('Custom Styling', 'identity-press')}</Text>
                            </div>
                            <Form.Item label={__('CSS Injection', 'identity-press')} name="custom_css">
                                <Input.TextArea 
                                    autoSize={{ minRows: 10, maxRows: 20 }}
                                    className="!font-mono text-xs"
                                    placeholder={__('/* Add your custom styles here */', 'identity-press')} 
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
