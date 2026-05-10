import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Form, Input, Button, Typography, Space, Alert, ConfigProvider } from 'antd';
import { ArrowRightOutlined, SafetyOutlined, PhoneOutlined } from '@ant-design/icons';
import fa_IR from "antd/lib/locale/fa_IR";

const { Title, Text } = Typography;

export default function AuthForm() {
    const [step, setStep] = useState('identifier'); // 'identifier' or 'otp'
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(120);
    const [canResend, setCanResend] = useState(false);
    const [identifier, setIdentifier] = useState('');
    const [feedback, setFeedback] = useState(null); // { type: 'error' | 'success', message: string }

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
        setLoading(true);
        setFeedback(null);
        // Mocking API call
        setTimeout(() => {
            setIdentifier(values.identifier);
            setStep('otp');
            setTimer(120);
            setCanResend(false);
            setLoading(false);
            setFeedback({ type: 'success', message: __('Verification code sent to your mobile.', 'identity-press') });
        }, 1000);
    };

    const handleVerifyOtp = (values) => {
        setLoading(true);
        setFeedback(null);
        // Mocking API call
        setTimeout(() => {
            setLoading(false);
            setFeedback({ type: 'success', message: __('Identity verified. Logging you in...', 'identity-press') });
        }, 1000);
    };

    const renderIdentifierStep = () => (
        <div className="animate-in space-y-6">
            <div className="text-center mb-8">
                <Title level={3} className="!mb-2 !font-extrabold !text-slate-900">
                    {__('Welcome Back', 'identity-press')}
                </Title>
                <Text type="secondary" className="text-sm">
                    {__('Please enter your mobile number to continue.', 'identity-press')}
                </Text>
            </div>

            <Form onFinish={handleSendOtp} layout="vertical">
                <Form.Item 
                    name="identifier"
                    rules={[{ required: true, message: __('Please enter your number', 'identity-press') }]}
                >
                    <Input 
                        placeholder={__('Mobile Number', 'identity-press')}
                        size="large"
                        className="!h-14 !rounded-2xl !bg-slate-50 !border-slate-100 !text-center !text-lg !font-bold"
                    />
                </Form.Item>

                <Button 
                    type="primary" 
                    htmlType="submit" 
                    block 
                    size="large" 
                    loading={loading}
                    className="!h-14 !rounded-2xl !bg-indigo-600 !font-bold !text-lg !shadow-xl !shadow-indigo-100"
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

            <div className="text-center mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Text className="text-[11px] text-slate-500 leading-relaxed">
                    {__('By continuing, you agree to our ', 'identity-press')}
                    <a href="#" className="text-indigo-600 font-bold hover:underline">{__('Terms of Service', 'identity-press')}</a>
                    {__(' and ', 'identity-press')}
                    <a href="#" className="text-indigo-600 font-bold hover:underline">{__('Privacy Policy', 'identity-press')}</a>.
                </Text>
            </div>
        </div>
    );

    const renderOtpStep = () => (
        <div className="animate-in space-y-6">
            <div className="text-center mb-8">
                <Title level={3} className="!mb-2 !font-extrabold !text-slate-900">
                    {__('Verification', 'identity-press')}
                </Title>
                <Text type="secondary" className="text-sm">
                    {__('Enter the 6-digit code sent to ', 'identity-press')}
                    <span className="font-bold text-slate-700">{identifier}</span>
                </Text>
            </div>

            <Form onFinish={handleVerifyOtp} layout="vertical">
                <Form.Item 
                    name="otp"
                    rules={[{ required: true, message: __('Please enter the full code', 'identity-press'), len: 6 }]}
                    className="!mb-8 flex justify-center"
                >
                    <Input.OTP 
                        length={6} 
                        size="large"
                        variant="filled"
                        autoFocus
                        onChange={(value) => {
                            if (value.length === 6) {
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
                            className="!text-indigo-600 !font-bold hover:!text-indigo-700"
                        >
                            {__('Resend Verification Code', 'identity-press')}
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                            <span>{__('Resend code in', 'identity-press')}</span>
                            <span className="text-indigo-600 font-mono font-bold text-sm">
                                {formatTime(timer)}
                            </span>
                        </div>
                    )}
                </div>

                <Button 
                    type="primary" 
                    htmlType="submit" 
                    block 
                    size="large" 
                    loading={loading}
                    className="!h-14 !rounded-2xl !bg-indigo-600 !font-bold !text-lg !shadow-xl !shadow-indigo-100"
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
                    {__('Change Mobile Number', 'identity-press')}
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
        <ConfigProvider locale={fa_IR} direction="rtl">
            <div className="max-w-[440px] mx-auto w-full bg-white p-10 rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden rtl">
                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50" />

                <div className="relative z-10">
                    <div className="flex justify-center mb-10">
                        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <SafetyOutlined className="text-white text-3xl" />
                        </div>
                    </div>

                    {step === 'identifier' ? renderIdentifierStep() : renderOtpStep()}
                </div>
            </div>
        </ConfigProvider>
    );
}
