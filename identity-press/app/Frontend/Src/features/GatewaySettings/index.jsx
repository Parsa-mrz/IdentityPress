import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { 
    Form, 
    Input, 
    Select, 
    Button, 
    Card, 
    Typography, 
    Modal, 
    message,
    Tag,
    Table,
    Space,
    Switch
} from 'antd';
import { 
    PlusOutlined, 
    ApiOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    CheckCircleOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function GatewaySettings() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [gateways, setGateways] = useState([]); // Mocking state for now

    const handleAddGateway = () => {
        form.validateFields().then(values => {
            const newGateway = {
                ...values,
                key: Date.now(),
                status: 'active'
            };
            setGateways([...gateways, newGateway]);
            setIsModalOpen(false);
            form.resetFields();
            message.success(__('Gateway added successfully.', 'identity-press'));
        });
    };

    const columns = [
        {
            title: __('Gateway Name', 'identity-press'),
            dataIndex: 'name',
            key: 'name',
            render: (text) => <Text className="font-bold text-slate-700">{text}</Text>
        },
        {
            title: __('Provider', 'identity-press'),
            dataIndex: 'provider',
            key: 'provider',
            render: (provider) => <Tag color="blue" className="!rounded-full px-3 capitalize">{provider}</Tag>
        },
        {
            title: __('Status', 'identity-press'),
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Space>
                    <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`} />
                    <Text className="text-xs font-semibold capitalize">{status}</Text>
                </Space>
            )
        },
        {
            title: __('Actions', 'identity-press'),
            key: 'actions',
            render: () => (
                <Space>
                    <Button type="text" icon={<EditOutlined />} />
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Space>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in">
            <div className="flex items-center justify-between">
                <div>
                    <Title level={4} className="!mb-1 !font-bold">{__('SMS Gateways', 'identity-press')}</Title>
                    <Text type="secondary">{__('Connect and manage your SMS service providers.', 'identity-press')}</Text>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => setIsModalOpen(true)}
                >
                    {__('Add New Gateway', 'identity-press')}
                </Button>
            </div>

            {gateways.length > 0 ? (
                <Card className="!border-slate-200 !p-0 overflow-hidden">
                    <Table 
                        columns={columns} 
                        dataSource={gateways} 
                        pagination={false}
                    />
                </Card>
            ) : (
                <Card className="!border-slate-200">
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                            <ApiOutlined className="text-3xl text-slate-300" />
                        </div>
                        <Title level={5} className="!mb-2">{__('No Gateways Found', 'identity-press')}</Title>
                        <Text type="secondary" className="max-w-xs mx-auto mb-8">
                            {__('You haven’t configured any SMS gateways yet. Please add one to start sending OTP codes.', 'identity-press')}
                        </Text>
                        <Button 
                            type="dashed" 
                            icon={<PlusOutlined />} 
                            size="large"
                            onClick={() => setIsModalOpen(true)}
                        >
                            {__('Configure First Gateway', 'identity-press')}
                        </Button>
                    </div>
                </Card>
            )}

            <Modal
                title={__('Add New Gateway', 'identity-press')}
                open={isModalOpen}
                onOk={handleAddGateway}
                onCancel={() => setIsModalOpen(false)}
                okText={__('Save Gateway', 'identity-press')}
                cancelText={__('Cancel', 'identity-press')}
                className="modern-modal"
                destroyOnClose
            >
                <Form form={form} layout="vertical" className="mt-6">
                    <Form.Item 
                        label={__('Friendly Name', 'identity-press')} 
                        name="name"
                        rules={[{ required: true, message: __('Please enter a name', 'identity-press') }]}
                    >
                        <Input placeholder={__('e.g. Primary SMS Service', 'identity-press')} />
                    </Form.Item>

                    <Form.Item 
                        label={__('Provider Type', 'identity-press')} 
                        name="provider"
                        rules={[{ required: true, message: __('Please select a provider', 'identity-press') }]}
                    >
                        <Select placeholder={__('Select Provider', 'identity-press')}>
                            <Select.Option value="farazsms">FarazSMS</Select.Option>
                            <Select.Option value="kavehnegar">KavehNegar</Select.Option>
                            <Select.Option value="smsir">Sms.ir</Select.Option>
                            <Select.Option value="melli-payamak">Melli Payamak</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item 
                        label={__('API Key / Username', 'identity-press')} 
                        name="api_key"
                        rules={[{ required: true, message: __('Please enter API credentials', 'identity-press') }]}
                    >
                        <Input.Password placeholder={__('Enter credentials', 'identity-press')} />
                    </Form.Item>

                    <Form.Item 
                        label={__('Sender Number', 'identity-press')} 
                        name="sender"
                    >
                        <Input placeholder={__('e.g. 50001234', 'identity-press')} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
