import { useState, useEffect } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { Form, Input, Button, Typography, Alert, ConfigProvider, Skeleton } from 'antd';
import { ArrowRightOutlined, SafetyOutlined } from '@ant-design/icons';
import fa_IR from "antd/lib/locale/fa_IR";
import useSettings from '../../hooks/useSettings';

const { Title, Text } = Typography;

export default function AuthForm() {
    const { settings, loading } = useSettings();
    const [step, setStep] = useState('identifier'); // 'identifier' or 'otp'
    const [actionLoading, setActionLoading] = useState(false);
    const [timer, setTimer] = useState(120);
    const [canResend, setCanResend] = useState(false);
    const [identifier, setIdentifier] = useState('');
    const [feedback, setFeedback] = useState(null);

    // Dynamic settings
    const primaryColor = settings?.style?.primary_color || '#4f46e5';
    const secondaryColor = settings?.style?.secondary_color || '#f8fafc';
    const otpLength = parseInt(settings?.general?.otp_length || '5');
    const loginMethod = settings?.general?.login_method || 'phone';

    // Auto-hide feedback alert
    useEffect(() => {
        if (feedback) {
            const timeout = setTimeout(() => {
                setFeedback(null);
            }, 5000);
            return () => clearTimeout(timeout);
        }
    }, [feedback]);

    useEffect(() => {
        let interval;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSendOtp = (values) => {
        setActionLoading(true);
        setFeedback(null);
        setTimeout(() => {
            setIdentifier(values.identifier);
            setStep('otp');
            setTimer(120);
            setCanResend(false);
            setActionLoading(false);
            setFeedback({ type: 'success', message: __('Verification code sent successfully.', 'identity-press') });
        }, 1000);
    };

    const handleVerifyOtp = (values) => {
        setActionLoading(true);
        setFeedback(null);
        setTimeout(() => {
            setActionLoading(false);
            setFeedback({ type: 'success', message: __('Identity verified. Logging you in...', 'identity-press') });
        }, 1000);
    };

    if (loading) {
        return (
            <div className="max-w-[440px] mx-auto w-full bg-white p-10 rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-100">
                <Skeleton active avatar paragraph={{ rows: 4 }} />
            </div>
        );
    }

    const getIdentifierProps = () => {
        switch (loginMethod) {
            case 'email_phone':
                return {
                    label: __('Email or Mobile Number', 'identity-press'),
                    placeholder: __('Enter email or mobile', 'identity-press'),
                    rules: [{ required: true, message: __('Please enter your email or mobile', 'identity-press') }]
                };
            case 'username':
                return {
                    label: __('Username', 'identity-press'),
                    placeholder: __('Enter your username', 'identity-press'),
                    rules: [{ required: true, message: __('Please enter your username', 'identity-press') }]
                };
            default:
                return {
                    label: __('Mobile Number', 'identity-press'),
                    placeholder: __('Enter mobile number', 'identity-press'),
                    rules: [
                        { required: true, message: __('Please enter your mobile number', 'identity-press') },
                        { pattern: /^[0-9+]{10,15}$/, message: __('Please enter a valid mobile number', 'identity-press') }
                    ]
                };
        }
    };

    const identifierProps = getIdentifierProps();

    const renderIdentifierStep = () => (
        <div className="animate-in space-y-6">
            <div className="text-center mb-8">
                <Title level={3} className="!mb-2 !font-extrabold !text-slate-900">
                    {__('Welcome Back', 'identity-press')}
                </Title>
                <Text type="secondary" className="text-sm">
                    {sprintf(__('Please enter your %s to continue.', 'identity-press'), identifierProps.label.toLowerCase())}
                </Text>
            </div>

            <Form onFinish={handleSendOtp} layout="vertical">
                <Form.Item 
                    name="identifier"
                    rules={identifierProps.rules}
                >
                    <Input 
                        placeholder={identifierProps.placeholder}
                        size="large"
                        style={{ backgroundColor: secondaryColor }}
                        className="!h-14 !rounded-2xl !border-slate-100 !text-center !text-lg !font-bold"
                    />
                </Form.Item>

                <Button 
                    htmlType="submit" 
                    block 
                    size="large" 
                    loading={actionLoading}
                    style={{ 
                        backgroundColor: primaryColor,
                        boxShadow: `0 10px 15px -3px ${primaryColor}33, 0 4px 6px -4px ${primaryColor}33`
                    }}
                    className="!h-14 !rounded-2xl !font-bold !text-lg !border-none"
                >
                    {__('Get Verification Code', 'identity-press')}
                </Button>
            </Form>

            {feedback && step === 'identifier' && (
                <Alert
                    message={feedback.message}
                    type={feedback.type}
                    showIcon
                    className="!rounded-2xl !mt-4 animate-in"
                />
            )}
        </div>
    );

    const renderOtpStep = () => (
        <div className="animate-in space-y-6">
            <div className="text-center mb-8">
                <Title level={3} className="!mb-2 !font-extrabold !text-slate-900">
                    {__('Verification', 'identity-press')}
                </Title>
                <Text type="secondary" className="text-sm">
                    {sprintf(
                        /* translators: %d: OTP Length */
                        __('Enter the %d-digit code sent to ', 'identity-press'),
                        otpLength
                    )}
                    <span className="font-bold text-slate-700 ml-1">{identifier}</span>
                </Text>
            </div>

            <Form onFinish={handleVerifyOtp} layout="vertical">
                <Form.Item 
                    name="otp"
                    rules={[{ 
                        required: true, 
                        message: sprintf(__('Please enter the full %d-digit code', 'identity-press'), otpLength), 
                        len: otpLength 
                    }]}
                    className="!mb-8 flex justify-center"
                >
                    <Input.OTP 
                        length={otpLength} 
                        size="large"
                        variant="filled"
                        autoFocus
                        onChange={(value) => {
                            if (value.length === otpLength) {
                                setTimeout(() => {
                                    handleVerifyOtp({ otp: value });
                                }, 100);
                            }
                        }}
                    />
                </Form.Item>

                <div className="flex flex-col items-center gap-4 mb-8">
                    {canResend ? (
                        <Button 
                            type="link" 
                            onClick={() => {
                                setTimer(120);
                                setCanResend(false);
                                setFeedback({ type: 'success', message: __('New code has been sent.', 'identity-press') });
                            }}
                            style={{ color: primaryColor }}
                            className="!font-bold hover:!opacity-80"
                        >
                            {__('Resend Verification Code', 'identity-press')}
                        </Button>
                    ) : (
                        <div 
                            style={{ backgroundColor: secondaryColor, borderColor: `${primaryColor}22` }}
                            className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-slate-100"
                        >
                            <span>{__('Resend code in', 'identity-press')}</span>
                            <span style={{ color: primaryColor }} className="font-mono font-bold text-sm">
                                {formatTime(timer)}
                            </span>
                        </div>
                    )}
                </div>

                <Button 
                    htmlType="submit" 
                    block 
                    size="large" 
                    loading={actionLoading}
                    style={{ 
                        backgroundColor: primaryColor,
                        boxShadow: `0 10px 15px -3px ${primaryColor}33, 0 4px 6px -4px ${primaryColor}33`
                    }}
                    className="!h-14 !rounded-2xl !font-bold !text-lg !border-none"
                >
                    {__('Verify Identity', 'identity-press')}
                </Button>

                <Button 
                    type="text" 
                    icon={<ArrowRightOutlined className="rotate-180" />} 
                    block
                    onClick={() => {
                        setStep('identifier');
                        setFeedback(null);
                    }}
                    className="!mt-4 !text-slate-400 !font-semibold hover:!text-slate-600"
                >
                    {__('Change Identifier', 'identity-press')}
                </Button>
            </Form>

            {feedback && step === 'otp' && (
                <Alert
                    message={feedback.message}
                    type={feedback.type}
                    showIcon
                    className="!rounded-2xl !mt-4 animate-in"
                />
            )}
        </div>
    );

    return (
        <ConfigProvider 
            locale={fa_IR} 
            direction="rtl"
            theme={{
                token: {
                    colorPrimary: primaryColor,
                    borderRadius: 16,
                },
            }}
        >
            <div 
                style={{ backgroundColor: secondaryColor }}
                className="max-w-[440px] mx-auto w-full p-10 rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden rtl"
            >
                <div 
                    className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20" 
                    style={{ backgroundColor: primaryColor }}
                />
                <div 
                    className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-20" 
                    style={{ backgroundColor: primaryColor }}
                />

                <div className="relative z-10">
                    <div className="flex justify-center mb-10">
                        <div 
                            style={{ backgroundColor: primaryColor }}
                            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200"
                        >
                            <SafetyOutlined className="text-white text-3xl" />
                        </div>
                    </div>

                    {step === 'identifier' ? renderIdentifierStep() : renderOtpStep()}
                </div>
            </div>
        </ConfigProvider>
    );
}
