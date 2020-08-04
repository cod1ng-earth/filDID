import {
    JwtCredentialPayload, CredentialPayload,
  } from 'did-jwt-vc';

export interface CredentialSubject {
  id: string,
  [property: string]: any
}

export interface VerifiableCredentialParams {
  content: CredentialSubject,
  owners: string[];
}

export const makeCredentialSubject = ({
  subjectId, property, type, name,
}: {
  subjectId: string, property: string, type: string, name: string
}) : CredentialSubject => ({
  id: subjectId,
  [property]: {
    type,
    name,
  },
});

/**
 * used to build jwts.
 */
export const transformFormStateToJwtPayload = (
    issuer: string,
    credentialSubject: CredentialSubject
  ): JwtCredentialPayload => {
    const issuanceDate = Math.floor((new Date()).getTime() / 1000);
    const payload: JwtCredentialPayload = {
      iss: issuer,
      sub: credentialSubject.id,
      iat: issuanceDate,
      nbf: issuanceDate,
      vc: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential'],
        credentialSubject,
      },
    };
    return payload;
  };
  
/**
 * w3c compat credential
 */
export const makeCredentialPayload = (
  issuer: string,
  credentialSubject: CredentialSubject
  ): CredentialPayload => ({
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiableCredential'],
    issuanceDate: (new Date()).toISOString(),
    issuer: {
      id: issuer,
    },
    credentialSubject,
  });
