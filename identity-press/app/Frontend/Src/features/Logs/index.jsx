import { __ } from '@wordpress/i18n';
import { Table, Tag, Card, Button, Input, Typography, Space } from 'antd';
import { SearchOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Logs() {
    const columns = [
        {
            title: __('Date & Time', 'identity-press'),
            dataIndex: 'date',
            key: 'date',
            render: (text) => <Text className="font-mono text-xs text-slate-400">{text || '2026-05-11 01:46:12'}</Text>
        },
        {
            title: __('Activity Event', 'identity-press'),
            dataIndex: 'event',
            key: 'event',
            render: (text) => <Text className="font-semibold text-slate-700">{text || __('Successful Authentication', 'identity-press')}</Text>
        },
        {
            title: __('Operational Status', 'identity-press'),
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'success' ? 'success' : 'processing'} className="!rounded-full !px-3 !m-0 !text-[10px] !font-bold uppercase tracking-wider">
                    {status || 'SUCCESS'}
                </Tag>
            )
        },
        {
            title: __('Identifier', 'identity-press'),
            dataIndex: 'user',
            key: 'user',
            render: (text) => <Text className="text-slate-500 font-medium">{text || '989123456789'}</Text>
        }
    ];

    return (
        <div className="space-y-8 animate-in">
            <div className="flex items-center justify-between">
                <div>
                    <Title level={4} className="!mb-1 !font-bold">{__('Activity Logs', 'identity-press')}</Title>
                    <Text type="secondary">{__('Monitor all authentication activities and system events.', 'identity-press')}</Text>
                </div>
                <Button danger icon={<DeleteOutlined />} className="!rounded-xl">
                    {__('Clear All Logs', 'identity-press')}
                </Button>
            </div>

            <Card className="!border-slate-200 !p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <Input 
                        placeholder={__('Filter by identifier...', 'identity-press')} 
                        prefix={<SearchOutlined className="text-slate-300" />}
                        className="max-w-xs"
                    />
                    <Space className="text-slate-400">
                        <InfoCircleOutlined />
                        <Text type="secondary" className="text-xs">{__('Retention: 30 Days', 'identity-press')}</Text>
                    </Space>
                </div>
                <Table 
                    columns={columns} 
                    dataSource={[{}, {}, {}]} 
                    pagination={false}
                />
            </Card>
        </div>
    );
}
