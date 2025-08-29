Rights Reserved, Unlicensed
# Example: Health-data consent with Presentation Definition (OIDC4VP)

This example shows a Presentation Definition for requesting a consent credential for health-data sharing.

```json
{
  "id": "health-consent-request",
  "input_descriptors": [
    {
      "id": "consent-credential",
      "name": "Health Data Consent",
      "purpose": "Prove valid consent to access and share specified health data",
      "constraints": {
        "fields": [
          {
            "path": ["$.type", "$.credentialSubject.type"],
            "filter": {
              "type": "array",
              "contains": {"const": "HealthDataConsent"}
            }
          }
        ]
      }
    }
  ]
}
```
