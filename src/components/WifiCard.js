import {
  CameraIcon,
  Card,
  Heading,
  MobilePhoneIcon,
  Pane,
  Paragraph,
  Text,
  TextareaField,
} from 'evergreen-ui';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import logo from '../../src/images/wifi-dark.png';
import './style.css';

export const WifiCard = (props) => {
  const { t } = useTranslation();
  const [qrvalue, setQrvalue] = useState('');

  const escape = (v) => {
    const needsEscape = ['"', ';', ',', ':', '\\'];

    let escaped = '';
    for (const c of v) {
      if (needsEscape.includes(c)) {
        escaped += `\\${c}`;
      } else {
        escaped += c;
      }
    }
    return escaped;
  };

  useEffect(() => {
    let opts = {};

    opts.T = props.settings.encryptionMode || 'nopass';
    if (props.settings.encryptionMode === 'WPA2-EAP') {
      opts.E = props.settings.eapMethod;
      opts.I = props.settings.eapIdentity;
    }
    opts.S = escape(props.settings.ssid);
    opts.P = escape(props.settings.password);
    opts.H = props.settings.hiddenSSID;

    let data = '';
    Object.entries(opts).forEach(([k, v]) => (data += `${k}:${v};`));
    const qrval = `WIFI:${data};`;

    setQrvalue(qrval);
  }, [props.settings]);

  const portraitWidth = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    return isMobile ? '100%' : '300px';
  };

  const passwordFieldLabel = () => {
    const hiddenPassword =
      props.settings.hidePassword || !props.settings.encryptionMode;
    return hiddenPassword ? '' : t('wifi.password');
  };

  const eapIdentityFieldLabel = () => {
    const hiddenIdentity = props.settings.encryptionMode !== 'WPA2-EAP';
    return hiddenIdentity ? '' : t('wifi.identity');
  };

  const eapMethodFieldLabel = () => {
    return !eapIdentityFieldLabel() ? '' : t('wifi.encryption.eapMethod');
  };

  return (
    <Card
      className="card-print"
      elevation={3}
      style={{
        maxWidth: props.settings.portrait ? portraitWidth() : '100%',
        background: '#1e1e1e', // Dark background
        color: '#d4d4d4', // Light text color
        borderRadius: '8px', // Rounded corners
        position: 'relative',
      }}
    >
      {/* VSCode-style window buttons */}
      <Pane
        display="flex"
        alignItems="center"
        paddingBottom={12}
        paddingTop={5}
        paddingLeft={5}
        style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          display: 'flex',
          gap: '8px',
        }}
      >
        <div
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#ff5f57', // Red button
            borderRadius: '50%',
          }}
        ></div>
        <div
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#ffbd2e', // Yellow button
            borderRadius: '50%',
          }}
        ></div>
        <div
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#28c840', // Green button
            borderRadius: '50%',
          }}
        ></div>
      </Pane>

      <Pane display="flex" paddingBottom={12} style={{ paddingTop: '24px' }}>
        <img alt="icon" src={logo} width="24" height="24" />
        <Heading
          size={700}
          paddingRight={10}
          paddingLeft={10}
          textAlign={props.settings.portrait ? 'center' : 'unset'}
          style={{ color: '#d4d4d4' }} // Light text color
        >
          {t('wifi.login')}
        </Heading>
      </Pane>

      <Pane
        className="details"
        style={{
          flexDirection: props.settings.portrait ? 'column' : 'row',
          borderRadius: '4px',
          padding: '16px',
          alignItems: props.settings.portrait ? 'center' : 'flex-start',
        }}
      >
        <QRCode
          className="qrcode"
          style={{
            marginBottom: props.settings.portrait ? '1.5em' : '0',
          }}
          value={qrvalue}
          size={150}
        />

        <Pane
          width={'100%'}
          style={{
            marginLeft: props.settings.portrait ? '0' : '1em',
          }}
        >
          <TextareaField
            id="ssid"
            type="text"
            marginBottom={5}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            maxLength="32"
            label={<span style={{ color: '#d4d4d4' }}>{t('wifi.name')}</span>}
            placeholder={t('wifi.name.placeholder')}
            value={props.settings.ssid}
            onChange={(e) => props.onSSIDChange(e.target.value)}
            isInvalid={!!props.ssidError}
            validationMessage={!!props.ssidError && props.ssidError}
            style={{
              backgroundColor: '#1e1e1e', // Dark input background
              color: '#d4d4d4', // Light text color
              lineHeight: '1.2em', // Improved readability
            }}
          />
          {props.settings.encryptionMode === 'WPA2-EAP' && (
            <>
              <TextareaField
                id="eapmethod"
                type="text"
                marginBottom={5}
                readOnly={true}
                spellCheck={false}
                label={
                  <span style={{ color: '#d4d4d4' }}>
                    {eapMethodFieldLabel()}
                  </span>
                }
                value={props.settings.eapMethod}
                style={{
                  backgroundColor: '#1e1e1e', // Dark input background
                  color: '#d4d4d4', // Light text color
                }}
              />

              <TextareaField
                id="identity"
                type="text"
                color="#d4d4d4" // Light text color
                marginBottom={5}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                label={
                  <span style={{ color: '#d4d4d4' }}>
                    {eapIdentityFieldLabel()}
                  </span>
                }
                placeholder={t('wifi.identity.placeholder')}
                value={props.settings.eapIdentity}
                onChange={(e) => props.onEapIdentityChange(e.target.value)}
                isInvalid={!!props.eapIdentityError}
                validationMessage={
                  !!props.eapIdentityError && props.eapIdentityError
                }
                style={{
                  backgroundColor: '#1e1e1e', // Dark input background
                  color: '#d4d4d4', // Light text color
                }}
              />
            </>
          )}
          {!(props.settings.hidePassword || !props.settings.encryptionMode) && (
            <TextareaField
              id="password"
              type="text"
              maxLength="63"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              height={
                props.settings.portrait && props.settings.password.length > 40
                  ? '5em'
                  : 'auto'
              }
              marginBottom={5}
              label={
                <span style={{ color: '#d4d4d4' }}>{passwordFieldLabel()}</span>
              }
              placeholder={t('wifi.password.placeholder')}
              value={props.settings.password}
              onChange={(e) => props.onPasswordChange(e.target.value)}
              isInvalid={!!props.passwordError}
              validationMessage={!!props.passwordError && props.passwordError}
              style={{
                backgroundColor: '#1e1e1e', // Dark input background
                color: '#d4d4d4', // Light text color
              }}
            />
          )}
        </Pane>
      </Pane>
      {!props.settings.hideTip && (
        <>
          <hr style={{ borderColor: '#606368', marginBottom: '10px' }} />
          <Paragraph
            style={{
              display: 'flex',
              justifyContent: props.settings.portrait ? 'center' : 'flex-start',
              alignItems: 'center',
              padding: '0 5px',
              color: '#d4d4d4',
            }}
          >
            <CameraIcon />
            <MobilePhoneIcon />
            <Text color={'#d4d4d4'} size={300} paddingRight={8} paddingLeft={8}>
              {t('wifi.tip')}
            </Text>
          </Paragraph>
        </>
      )}
    </Card>
  );
};
