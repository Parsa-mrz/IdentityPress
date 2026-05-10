import { __ } from '@wordpress/i18n';
import { Tabs, Layout, Typography, Badge, Space } from 'antd';
import { 
    ApiOutlined, 
    SettingOutlined, 
    BgColorsOutlined, 
    FileTextOutlined,
    RocketOutlined,
} from '@ant-design/icons';

import GatewaySettings from './features/GatewaySettings';
import GeneralSettings from './features/GeneralSettings';
import StyleSettings from './features/StyleSettings';
import Logs from './features/Logs';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function App() {
    const items = [
        {
            key: 'general',
            label: (
                <span className="flex items-center gap-2">
                    <SettingOutlined />
                    {__('General', 'identity-press')}
                </span>
            ),
            children: <GeneralSettings />,
        },
        {
            key: 'gateway',
            label: (
                <span className="flex items-center gap-2">
                    <ApiOutlined />
                    {__('Gateways', 'identity-press')}
                </span>
            ),
            children: <GatewaySettings />,
        },
        {
            key: 'style',
            label: (
                <span className="flex items-center gap-2">
                    <BgColorsOutlined />
                    {__('Style', 'identity-press')}
                </span>
            ),
            children: <StyleSettings />,
        },
        {
            key: 'logs',
            label: (
                <span className="flex items-center gap-2">
                    <FileTextOutlined />
                    {__('Logs', 'identity-press')}
                </span>
            ),
            children: <Logs />,
        },
    ];

    return (
        <Layout className="min-h-screen bg-[#f8fafc]">
            <Content className="p-12 max-w-7xl mx-auto w-full">
                <div className="mb-10 animate-in">
                    
                    <Title level={2} className="!mb-1 !text-slate-900 !font-extrabold !tracking-tight flex gap-2">
                        <span className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                            <RocketOutlined className="text-white text-xl" />
                        </span>
                        {__('Plugin Dashboard', 'identity-press')}
                    </Title>
                    <Text className="text-slate-500 text-base">
                        {__('Configure and monitor your authentication ecosystem with ease.', 'identity-press')}
                    </Text>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 min-h-[600px]">
                    <Tabs 
                        defaultActiveKey="general" 
                        items={items} 
                        className="modern-tabs"
                    />
                </div>
                
                <div className="mt-12 flex justify-between items-center text-[11px] text-slate-400 font-bold uppercase tracking-widest px-4">
                    <span>© 2026 IdentityPress</span>
                    <Space size="large">
                        <a href="#" className="hover:text-indigo-600 transition-colors">{__('Documentation', 'identity-press')}</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">{__('Support', 'identity-press')}</a>
                    </Space>
                </div>
            </Content>
        </Layout>
    );
}