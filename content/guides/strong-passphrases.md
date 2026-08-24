---
title: "Passphrases: Easier to Remember, Harder to Crack"
slug: "strong-passphrases"
description: "Why 4 random words beat P@ssw0rd!23 — the math of password strength, how to build passphrases that stick, and the 3 rules that actually protect you."
date: "2026-08-24"
updated: "2026-08-24"
tools: ["password-generator", "password-strength"]
---

Security experts keep saying "use a strong password" — and then everyone writes `P@ssw0rd!23` and feels clever. Here is what actually makes a password strong, and why the answer is probably four random words.

## The math in one table

Password strength is about **how many guesses an attacker needs**. With a modern offline cracking rig:

| Password | Time to crack |
|---|---|
| `P@ssw0rd!23` (11 chars, predictable pattern) | minutes — patterns like this are tried first |
| `Tr0ub4dor&3` (classic "complex") | ~3 days |
| `correct-horse-battery-staple` (4 random words) | **centuries** |
| 16+ random characters (generated) | longer than the age of the universe |

Swapping a→@ and o→0 barely helps — cracking tools try every popular substitution automatically. **Length and randomness are what pay.**

## Why passphrases win for humans

A passphrase is several random words strung together:

- **Entropy from a big word list:** picking 4 words from a 7,776-word list (diceware standard) gives about 51 bits of entropy; 5 words ≈ 64 bits — into "centuries" territory.
- **Memorable:** your brain stores 4 meaningful images ("correct horse battery staple") far better than 11 symbols.
- **Fast to type** on phones — no symbol-switching keyboard gymnastics.

## How to build a good one

1. **Random words, not a phrase.** Song lyrics, movie quotes and famous sayings are in every cracking dictionary. The words must be independently random.
2. **Four words minimum, five for anything financial.**
3. **Add a number or capital only if the site forces you** — it adds little, but some logins still demand it.
4. **Never reuse it.** One passphrase per important account — or better:

## The 3 rules that actually protect you

1. **Use a password manager.** One strong master passphrase, then unique 16+ character generated passwords everywhere else. This defeats credential stuffing — the attack where a leak from site A opens your account on site B.
2. **Turn on 2FA** for email, banking and anything financial. A stolen password alone then gets the attacker nowhere.
3. **Check for breaches** — if a password you use appears in a leak, change it everywhere it was reused.

## Try it now (nothing leaves your browser)

- Generate a strong random password or get inspired for word combinations with the [Password Generator](/tools/generators/password-generator).
- Test how your current passwords score with the [Password Strength Checker](/tools/developer-tools/password-strength) — it evaluates length, variety and predictability locally in your browser.

## FAQ

**Is a passphrase safe to reuse across sites?** No password is. Reuse means one leak breaks everything. Use unique passwords via a manager.

**Should I change passwords every 90 days?** Modern guidance (NIST) says no — forced rotation makes people choose weaker patterns. Change a password when it appears in a breach.

**Are password managers safe?** Far safer than the alternative: one well-protected vault vs. dozens of reused passwords. Enable 2FA on the vault itself.
