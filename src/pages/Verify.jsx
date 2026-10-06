import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import VerifyLayout from '../components/verify/VerifyLayout.jsx';
import RoleStep from '../components/verify/RoleStep.jsx';
import CountryStep from '../components/verify/CountryStep.jsx';
import PhoneStep from '../components/verify/PhoneStep.jsx';
import OtpStep from '../components/verify/OtpStep.jsx';
import VerifyNextPlaceholder from '../components/verify/VerifyNextPlaceholder.jsx';

export default function Verify() {
  const { profile } = useAuth();
  const [phonePhase, setPhonePhase] = useState('phone');
  const [pendingPhone, setPendingPhone] = useState('');

  const hasRole = profile?.role === 'buyer' || profile?.role === 'seller';
  const country = profile?.country === 'GB' || profile?.country === 'NG' ? profile.country : '';
  const phoneVerified = profile?.phone_verified === true;
  const showOtp = phonePhase === 'otp' && /^\+(44|234)\d{10}$/.test(pendingPhone);

  let step = 1;
  let content = <RoleStep />;

  if (!hasRole) {
    step = 1;
    content = <RoleStep />;
  } else if (!country) {
    step = 2;
    content = <CountryStep />;
  } else if (!phoneVerified) {
    step = 3;
    content = showOtp ? (
      <OtpStep
        e164={pendingPhone}
        onChangeNumber={() => setPhonePhase('phone')}
      />
    ) : (
      <PhoneStep
        country={country}
        initialE164={pendingPhone}
        onSent={(e164) => {
          setPendingPhone(e164);
          setPhonePhase('otp');
        }}
      />
    );
  } else {
    step = 4;
    content = <VerifyNextPlaceholder />;
  }

  return (
    <VerifyLayout step={step}>
      {content}
    </VerifyLayout>
  );
}
