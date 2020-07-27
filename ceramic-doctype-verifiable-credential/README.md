# Ceramic Verifiable Credential doctype

> This package contains Verifiable Credential doctype spec suggestion.

## Doctype sample

```json
{
    "doctype": "VerifiableCredential",
    "owners": ["<Issuer DID>"],
    "content": {
        "vcJwt": "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImRlZ3JlZSI6eyJ0eXBlIjoiSGFja0ZTIEZpbERJRCB1c2VyIiwibmFtZSI6IlRoaXMgdXNlciB3b3JrZWQgb24gRmlsRElEIn19fSwic3ViIjoiZGlkOmV0aHI6MHhFMjMxQjRlNTVmRTFEMEFmYjNlNzQ2ZTY0RTc4ZUVmZkI1YjU5OWQxIiwibmJmIjoxNTYyOTUwMjgyLCJpc3MiOiJkaWQ6ZXRocjoweGYyMTc2NzlCMDE0NkY3RmFBRjliMUZlMmVmMEExQjlkMzdGNjY4NmQifQ.iKeGGc5VBhili9-4rxEeCq8T4CLwWPwN5b-tl4S2cFlj_0lBTYBibxFb2LtmBrTF_3nINPH0O7vF8BW2mkby7w",
        "vcJwtHash": "<IPLD Hash of the vcjwt property>"
    }
}
```

## Doctype creation workflow

An authenticated issuer creates a Verifiable credential document using the createDocument API, passing few required parameters as the credential payload. A sample payload would look like the following:

```json
{
    "sub": "DID of the subject",    // Mandatory
    "nbf": "Not before time",
    "vc": {
        "@context": ["https://www.w3.org/2018/credentials/v1"], // Mandatory
        "type": ["VerifiableCredential"],   // Mandatory
        "credentialSubject": {
            "degreee": {
                "type": "BachelorDegree",
                "name": "Baccalauréat en musiques numériques"'
            }
        }
    }
}
```

The above payload schema is taken from here: [did-jwt-vc-payload](https://github.com/decentralized-identity/did-jwt-vc/blob/608520122f29b6cd19fa747e55d76c0aa73ed046/src/types.ts#L12). The Verifiable credential doctype handler would validate necessary params, and would create a Verifiable credential JWT, by auto populating other necessary properties of a Verifiable credential in the context of an user, which would be the issuer in this case. All the credentials will also have ```id```  property which would be the document ID. This helps in easy verification of claims comparing the latest hash of the document ```vcJwtHash``` and the one which the holder would disclose to the verifier.

## Helper library

 A few other helper methods would be needed which would the serve the following purpose:

- Return the Verifiable Credential JWT given the doc ID.
- Verify the credential given the JWT token.
- Create a Verifiable Presentation given a list of Verifiable Credential doc IDs.

## Revocation workflow

Coming soon...
