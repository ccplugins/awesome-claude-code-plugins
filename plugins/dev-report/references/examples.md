# Worked examples

Two complete reports, in different languages, from sessions of different shapes. Read one end-to-end before writing your first report — the calibration you need is mostly in how much room section 5 gets.

- [Example A — English, bug-hunt session](#example-a--english--bug-hunt-session)
- [Example B — Korean, mixed verification + regression session](#example-b--korean--mixed-verification--regression-session)
- [What each one is doing](#what-each-one-is-doing)

---

## Example A — English — bug-hunt session

> Illustrative example. The session was meant to be routine maintenance and turned into a bug hunt.

### 📌 Summary

Today was supposed to be clearing four small items off the backlog. I got through two of them, then found that about one in six customers hasn't been receiving their order confirmation email since the payment provider upgrade three weeks ago. That's fixed and live now. The other two backlog items are untouched.

### 🎯 Why I started here

The backlog items were all blocked on the same thing — none could be checked without putting a real order through the system. So I placed a test order first, intending to use it for all four checks at once. That order never produced a confirmation email, which is what pulled the thread.

### 🔍 What I found

The server log for that order read:

```
[warn] notify: no handler for event 'payment.succeeded.v2' — dropped
```

An **event** here is a message our payment provider sends us when something happens — "payment succeeded," "card declined." A **handler** is the piece of our code that listens for a specific message and does something about it. The log is saying: a message arrived, nothing was listening, and it was thrown away without an error.

Thrown away without an error is the important half. Nothing failed loudly, so nothing alerted us, so this ran for three weeks looking healthy.

### 🧩 Why it happened

When we upgraded the payment provider's library three weeks ago, they renamed their events — `payment.succeeded` became `payment.succeeded.v2`. Our code listens by exact name, so it stopped matching. Both names are valid; the provider sends the new one to accounts on the new library and the old one to accounts still on the old one.

That last detail explains the "one in six." We run six servers, and two of them hadn't picked up the library upgrade because they were restarted on an older deployment. Those two kept getting the old event name and kept working perfectly. So roughly a third of orders were fine, which is exactly the pattern that keeps a problem invisible — enough emails were going out that nobody noticed a gap.

Worth saying: the notification system was not broken. It correctly refused to guess what an unrecognized message meant. Silently dropping it instead of shouting is the actual defect, and that's a separate fix I'll get to below.

### 🔧 How I fixed it, and why this way

Three changes, doing three different jobs.

**The root cause:** the handler now registers for both event names. The provider has committed to sending `.v2` going forward but hasn't set a date for retiring the old one, so accepting both is not a temporary hack — it's the correct state until they announce a cutoff.

I considered the alternative of pinning every server to the new library and listening only for `.v2`. That is cleaner, and I rejected it because it makes email delivery depend on all six servers being perfectly in sync at all times. They weren't today and they won't be during the next deploy either. Correctness shouldn't rest on a condition we've already watched fail.

**The visibility fix:** an unrecognized event is now logged as an error rather than a warning, and it increments a counter we already alert on. This is the change I actually care most about. The specific renaming was a one-off; the fact that a dropped message could stay invisible for three weeks is structural, and it would have hidden the next one just as well.

**The cleanup:** I found the 47 affected orders and sent their confirmation emails. They now say "your order confirmation" without a timestamp claiming it was sent today — I didn't want a customer comparing it to their bank statement and getting confused about when the charge happened.

What this does **not** cover: only the confirmation email was affected. Shipping notifications go through a different path and were never broken, and I confirmed that rather than assuming it.

### 📊 Numbers

| | Before | After |
|---|---|---|
| Orders confirmed by email | 5 of 6 (83%, over 284 orders in 3 weeks) | 6 of 6 (30 of 30 since deploy) |
| Time from payment to email | 4 seconds | 4 seconds — unchanged |
| Unrecognized events dropped silently | all of them | none — each one now alerts |
| Backlog affected orders | 47 | 0 |

### 🧪 Verified, assumed, untested

**Verified:** I placed four real test orders after deploying, one against each server type, and all four emails arrived. The 47 backfilled emails show as delivered in the provider's dashboard.

**Assumed:** that no other event type has been quietly renamed. I checked the provider's changelog and found only this one, but I'm trusting their changelog rather than auditing every event we listen for. The new alerting means we'd now find out within minutes instead of weeks, which is why I'm comfortable leaving it there.

**Untested:** refund confirmations. They use the same handler mechanism and I believe they're fine, but no refund happened today and I didn't force one against live payment data.

### 🚀 Next, and what I need from you

I'll do on my own: finish the two remaining backlog items tomorrow, and audit the rest of our event names against the provider's changelog.

I need a decision from you on one thing: those 47 customers got their confirmation email three weeks late. I can leave it as-is, or add a one-line apology to the resend. I'd lean toward leaving it — most people won't connect the two, and an apology draws attention to a gap they didn't notice. But that's a brand call, not a technical one.

---

## Example B — Korean — mixed verification + regression session

> 각색한 예시. 검증 항목을 치우려던 날이 회귀 버그 수정으로 바뀐 경우.

### 📌 한 줄 요약

원래는 밀린 검증 항목을 치우는 날이었는데, 그 과정에서 예약 전날 저녁에 나가야 할 알림 문자가 3주째 다음 날 새벽 5시에 발송되고 있었다는 걸 발견해 고쳤습니다. 지금은 제시간 발송을 실측으로 확인했고, 아직 발송 전이던 알림은 전부 바로잡았습니다.

### 🎯 왜 이것부터 했나

밀린 검증 항목 6개가 전부 "실제 예약을 한 건 넣어봐야 확인 가능"에 걸려 있었습니다. 하나씩 보는 것보다 테스트 예약 한 건을 끝까지 흘려보내면서 6개를 한 번에 터는 게 빠르다고 판단해서, 예약을 하나 등록했습니다.

### 🔍 그러다 발견한 것

예약을 등록하자 알림 로그에 이렇게 찍혔습니다.

```
알림 등록: 예약 #4821 — 발송 예정 2026-08-03T20:00:00Z
```

끝의 **`Z`는 국제 표준시(UTC) 표시**입니다. 전 세계 서버가 공통 기준으로 쓰는 시각인데, 한국보다 9시간 느립니다. 즉 이 알림은 손님 기준 저녁 8시가 아니라 **다음 날 새벽 5시**에 나가도록 잡혀 있었습니다. 문자가 올 때까지 기다릴 필요도 없었습니다 — 등록되는 순간 이미 시각이 틀려 있었습니다.

### 🧩 원인을 따라가 보니

3주 전에 문자 발송 업체를 교체했습니다. 새 업체 연동 코드는 시각에 시간대 표시가 없으면 국제 표준시로 해석합니다. 이전 업체 연동은 서버에 설정된 한국 시간을 따랐습니다. 교체하면서 옮긴 코드는 시각 숫자만 그대로 넘기고 있었고, "이 시각은 한국 기준"이라는 표시 한 줄이 빠진 겁니다.

발송기 자체는 **정확히 제 일을 했습니다.** 넘겨받은 시각에 1분 오차 없이 보냈습니다. 잘못은 한 단계 위에 있었습니다 — 아무도 발송기에게 그 시각이 어느 나라 기준인지 알려주지 않았습니다.

### 📅 언제부터 이랬나

알림 등록 로그를 날짜순으로 훑었습니다. 교체일 이전 건은 시각이 `+09:00`으로 끝나고, 이후 건은 전부 `Z`로 끝납니다. 표기가 바뀐 지점이 원인이 들어온 날입니다.

교체 후 잡힌 예약은 41건입니다. 그중 알림이 이미 발송된 12건은 전부 새벽 5시에 나갔습니다. 새벽 문자를 받은 12명 중 문의를 남긴 손님은 없었습니다 — 아무도 항의하지 않는 조용한 실패였고, 3주를 간 것도 그래서입니다. **아직 발송 전이던 29건은 오늘 전부 바로잡아서, 추가 피해는 없습니다.**

### 🔧 어떻게 고쳤나 — 그리고 왜 이 방법인가

두 가지를 고쳤고, 역할이 다릅니다.

**첫째, 근본 원인.** 알림 시각을 계산해서 넘기는 규칙을 **함수 하나로 통일**하고, 그 함수가 항상 시간대 표시를 붙이도록 했습니다. 등록하는 쪽과 발송하는 쪽이 같은 함수를 쓰기 때문에, 두 곳의 해석이 갈라질 자리 자체가 없어졌습니다. 이번 버그가 정확히 "두 곳이 같은 숫자를 서로 다른 기준으로 읽은" 버그였습니다.

**둘째, 방어망.** 발송 직전에 "지금이 알림을 보내기에 말이 되는 시간인가"를 확인합니다. 오전 8시부터 밤 9시 사이가 아니면 발송을 보류하고 경고를 올립니다. 새벽 발송은 그 자체로 계산이 어디선가 틀렸다는 신호이기 때문입니다.

방어망만 두지 않은 이유는, 그러면 시각 계산은 계속 틀린 채로 방어망이 조용히 뒤치다꺼리하는 상태가 굳어지기 때문입니다. 보류된 알림을 누가 언제 다시 보낼지가 새 문제로 남고, 방어망에 구멍이 생기는 날 아무 경고 없이 새벽 문자로 돌아갑니다. 반대로 근본 수정만 두지 않은 이유는, 오늘 사고의 뿌리가 "교체하면서 표시 한 줄 빠뜨리기"였기 때문입니다. 다음 교체 때 같은 실수를 안 한다는 건 사람의 주의력에 거는 기대이지, 보장으로 쓸 수 있는 종류의 것이 아닙니다.

### 📊 숫자

| 항목 | 수정 전 | 수정 후 |
|---|---|---|
| 알림 발송 시각 | 예정보다 9시간 늦음 — 다음 날 새벽 5시 | 예정대로 저녁 8시 (테스트 2건 실측) |
| 새벽에 나간 문자 | 12건 (교체 후 발송된 알림 12건 전부) | 0건 |
| 발송 대기 중이던 틀린 알림 | 29건 | 0건 — 전부 재계산 |
| 신규 테스트 | — | 8개 추가, 전부 통과 |

### 🧪 검증된 것 / 추정 / 확인 못 한 것

**검증됨:** 테스트 예약 2건의 알림 시각을 몇 분 뒤로 잡아 실제 발송까지 돌렸고, 두 건 모두 제시간에 왔습니다. 대기 중이던 29건은 재계산 후 전수 확인했습니다.

**추정:** 카카오 알림톡 경로도 같이 고쳐졌을 겁니다. 같은 시각 계산 함수를 쓰기 때문인데, 실제로 발송까지 돌려본 건 문자뿐입니다.

**확인 못 함:** 해외에 있는 손님. 오늘 확인한 예약은 전부 한국 시간대 손님이었습니다. 손님 시간대가 한국이 아닐 때의 동작은 별도 항목으로 적어뒀습니다.

### 🚀 남은 것 / 필요한 결정

제가 알아서 할 것: 카카오 알림톡 경로로 한 건 실측, 해외 시간대 케이스 확인.

결정이 필요한 것: 방어망이 알림을 보류한 다음입니다. 오전 8시가 되면 자동으로 재발송하는 방법과, 담당자가 확인한 뒤 보내는 방법이 있습니다. 전자는 빠르지만 계산이 틀린 알림이 또 그대로 나갈 수 있고, 후자는 안전하지만 사람 일이 하나 늘어납니다. 어느 쪽이 가게 운영에 맞는지는 제가 정할 문제가 아닌 것 같습니다.

---

## What each one is doing

Both reports use the same moves. Worth noticing where:

| Move | Where it shows up |
|---|---|
| Intent-vs-outcome gap as the summary | Both open with "this was supposed to be X, it became Y" — the single most decision-relevant sentence available |
| Evidence quoted before it's explained | The log line appears raw, then gets unpacked, in both |
| Term paid for at first use, then spent | "event"/"handler" in A, "국제 표준시(UTC)" in B — one clause each, then used freely |
| Naming who behaved correctly | "the notification system was not broken" / "발송기 자체는 정확히 제 일을 했습니다" — stops the reader generalizing to distrust |
| The rejected alternative | A rejects pinning all servers to one library; B rejects having only the safety net. Both say what would have gone wrong |
| Roles for multiple changes | A labels root cause / visibility / cleanup; B labels root cause / defense |
| Explicit scope boundary | "only the confirmation email was affected" / "아직 발송 전이던 29건은 오늘 전부 바로잡아서, 추가 피해는 없습니다" |
| Denominators on every rate | "83%, over 284 orders" / "교체 후 발송된 알림 12건 전부" |
| A real gap volunteered | Refund confirmations in A; the customer-abroad time-zone case in B |
| A decision handed back, framed as theirs | The apology wording in A; auto-resend vs. human review for held notifications in B |

Notice what neither does: no diffs, no file trees, no list of changed files, no apology for the bug, and no sentence that starts by announcing that an explanation is coming.
