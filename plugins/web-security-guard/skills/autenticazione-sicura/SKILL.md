---
name: autenticazione-sicura
description: Implementa autenticazione sicura quando un sito/app richiede registrazione, login o account utente. Copre verifica email con codice, autenticazione a due fattori (2FA/TOTP), passkey e chiavi di sicurezza, hashing password, sessioni e recupero account. Trigger - "login", "registrazione", "verifica email", "codice di verifica", "2FA", "doppio fattore", "autenticazione", "passkey", "account utente".
---

# Autenticazione Sicura

Quando un sito/app prevede account utente, implementare l'autenticazione secondo queste regole. Se l'utente non specifica i dettagli, proporre di default: password + verifica email con codice + 2FA opzionale.

## Password
- Hash con **Argon2id** (preferito) o bcrypt (cost ≥ 12). MAI MD5/SHA1/SHA256 semplice, mai password in chiaro.
- Lunghezza minima 8-12 caratteri; verificare contro liste di password compromesse se possibile.
- Rate limiting sul login: max ~5 tentativi per account/IP in 15 minuti, poi blocco temporaneo crescente. Risposta identica per "utente inesistente" e "password errata".

## Verifica email con codice (OTP)
- Codice numerico a 6 cifre generato con CSPRNG (`crypto.randomInt`, `secrets.randbelow`), MAI `Math.random()`.
- Validità 10 minuti, monouso, max 5 tentativi di inserimento, poi invalidare e rigenerare.
- Salvare nel DB solo l'hash del codice, con scadenza. Rate limiting sull'invio (max 1 ogni 60s, 5/ora per indirizzo).
- Stesso schema per: conferma registrazione, reset password, conferma di azioni sensibili (cambio email, cambio IBAN, cancellazione account).

## 2FA / doppio fattore
Offrire in ordine di preferenza:
1. **Passkey / chiavi di sicurezza (WebAuthn/FIDO2)** — resistenti al phishing. Librerie: `@simplewebauthn/server` (Node), `webauthn` (Python).
2. **TOTP** (Google Authenticator ecc.) — segreto generato server-side, mostrato via QR, verificato con finestra ±1 step. Librerie: `otplib`, `pyotp`.
3. **Codice via email** — minimo accettabile; SMS solo se richiesto esplicitamente.

Regole:
- Alla attivazione del 2FA generare **10 codici di recupero** monouso (mostrati una sola volta, salvati hashati).
- Richiedere il 2FA a ogni login da dispositivo nuovo e per azioni sensibili (step-up).
- Disattivazione 2FA solo con ri-autenticazione completa.

## Sessioni e token
- Vedi skill hardening-siti per i cookie. In più: invalidare tutte le sessioni al cambio password; lista "dispositivi connessi" con revoca.
- Se si usano JWT: scadenza breve (15 min) + refresh token revocabile salvato server-side; algoritmo fissato (no `alg: none`).

## Recupero account
- Reset password tramite link/codice monouso a scadenza, MAI domande di sicurezza.
- Notificare via email ogni evento sensibile: login da nuovo dispositivo, cambio password/email, attivazione/disattivazione 2FA.

## Cosa non fare mai
- Inviare password via email. Loggare password o codici OTP. Rivelare se un'email è registrata (enumerazione). Implementare crittografia "fatta in casa".
