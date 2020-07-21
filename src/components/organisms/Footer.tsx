import React from 'react';
import { Container } from 'decentraland-ui';

export type FooterProps = {
    isFullscreen?: boolean
    className?: string
  }

export const Footer = (props: FooterProps) => {
  let classes = 'dcl footer';
  if (props.isFullscreen) {
    classes += ' fullscreen';
  }
  if (props.className) {
    classes += ` ${props.className}`;
  }

  return <Container className={classes}>
    <div className="main-footer">
      <div className="links">
        <a href="https://">Home</a>
      </div>
    </div>
    <div className="secondary-footer">
      <div className="social-links">
        <a href="https://github.com/cod1ng-earth/filDID">
          <i className="social-icon github" />
        </a>
      </div>
      <div className="copyright">
        © {new Date().getFullYear()} Stefan Anmol &amp; Juan
      </div>
    </div>
  </Container>;
};
