import React, { useRef, useState } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import apis from '../../apis';

const EmailVerifyingPage = () => {
  const intervalForEmails = useRef<number>(60);
  const [isDisabled, setIsDisabled] = useState(false);

  const sendEmailVerification = () => {
    apis.auth.sendVerificationEmail();
    setIsDisabled(true);
    setTimeout(() => {
      setIsDisabled(false);
    }, intervalForEmails.current * 1000);
  };
  return (
    <Container>
      <Card className="mt-5">
        <Card.Header>
          <h4>Your email hasn&apos;t been verified!</h4>
        </Card.Header>
        <Card.Body>
          <div>Please verify youe email. If you haven&apos;t received verification email click on resend button.</div>
        </Card.Body>
        <Card.Footer>
          <Button type="button" disabled={isDisabled} onClick={sendEmailVerification}>
            Resend
          </Button>
          {isDisabled && <div>you can request after 60s.</div>}
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default EmailVerifyingPage;
