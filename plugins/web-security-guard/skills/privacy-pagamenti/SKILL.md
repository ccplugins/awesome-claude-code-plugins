---
name: privacy-pagamenti
description: Protegge dati di pagamento e abbonamenti quando un sito/app gestisce checkout, carte, subscription o fatturazione. Copre integrazione sicura Stripe/PayPal, verifica firma webhook, PCI-DSS, GDPR, minimizzazione dati e ciclo di vita degli abbonamenti. Trigger - "pagamenti", "checkout", "abbonamento", "subscription", "Stripe", "PayPal", "carta di credito", "fatturazione", "privacy dei pagamenti".
---

# Privacy Pagamenti e Abbonamenti

Quando un sito/app gestisce pagamenti o abbonamenti, applicare queste regole.

## Regola d'oro: mai toccare i dati della carta
- Il numero di carta NON deve mai transitare dal proprio server né essere salvato nel proprio DB (requisito PCI-DSS). Usare sempre checkout/elementi ospitati dal provider: Stripe Checkout / Payment Element, PayPal Smart Buttons.
- Nel DB salvare SOLO: ID cliente del provider (es. `cus_...`), ID abbonamento, stato, ultime 4 cifre e brand se forniti dal provider.
- Le chiavi segrete (`sk_...`, client secret) vivono solo in variabili d'ambiente lato server. Nel frontend solo chiavi pubblicabili.

## Webhook: sempre verificati
Lo stato di pagamenti/abbonamenti si aggiorna SOLO da webhook verificati, mai dal redirect del browser (falsificabile).

```js
// Stripe (Express) — il body deve essere RAW
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) { return res.status(400).send('Firma non valida'); }
  // gestire event.type: checkout.session.completed, invoice.paid,
  // invoice.payment_failed, customer.subscription.deleted ...
  res.json({received: true});
});
```

Per PayPal usare l'API di verifica firma webhook. Rendere i gestori idempotenti (stesso evento ricevuto due volte = nessun doppio effetto): salvare gli `event.id` processati.

## Abbonamenti
- Gestire sempre: pagamento fallito (grace period + email), cancellazione (accesso fino a fine periodo), upgrade/downgrade con proratazione del provider.
- La cancellazione deve essere facile quanto l'iscrizione (obbligo in UE/USA). Prevedere pagina "gestisci abbonamento" (Stripe Customer Portal è la via più semplice).
- Prezzi e importi: mai fidarsi di valori inviati dal client; il server usa solo i Price ID configurati.

## Privacy e GDPR
- **Minimizzazione**: raccogliere solo i dati necessari alla transazione. Niente dati di pagamento nei log, negli URL, in analytics o in email.
- **Informativa**: privacy policy che dichiara provider di pagamento, dati trattati, conservazione. Cookie banner se ci sono cookie non tecnici.
- **Diritti**: prevedere export ed eliminazione dei dati su richiesta (l'eliminazione lato provider va richiesta via API del provider). Conservare i dati di fatturazione per gli obblighi fiscali (in Italia 10 anni) separandoli dal profilo eliminato.
- **Cifratura**: TLS ovunque; dati personali sensibili cifrati at-rest se il DB lo consente.
- **Audit log**: registrare chi/quando per ogni evento di pagamento e modifica di abbonamento (senza PAN o dati carta).

## Checklist consegna
Chiavi in env, webhook con firma verificata e idempotente, nessun dato carta nel DB/log, portale di gestione abbonamento, privacy policy, flusso di cancellazione, gestione pagamento fallito.
