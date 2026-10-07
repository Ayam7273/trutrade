import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark } from 'lucide-react';
import FormField from '../FormField.jsx';
import PageHeader from '../PageHeader.jsx';
import Panel from '../Panel.jsx';
import StatusBadge from '../StatusBadge.jsx';
import Button from '../../ui/Button.jsx';
import { transactionsContent, withdrawContent as content } from '../../../data/dashboardContent';
import { fill, formatMoney } from '../../../lib/format';
import { mockPayoutSpeedHours } from '../../../lib/dashboardMock';
import { MIN_WITHDRAWAL, requestWithdrawal, useBalances, useWithdrawal } from '../../../lib/paymentsApi';
import controls from '../FormField.module.css';
import styles from './RequestWithdrawal.module.css';

const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

function parseAmount(text) {
  const cleaned = text.replace(/[,\s£]/g, '');
  return MONEY_PATTERN.test(cleaned) ? Number(cleaned) : null;
}

export default function RequestWithdrawal() {
  const navigate = useNavigate();
  const balances = useBalances();
  const { account } = useWithdrawal();
  const { currency } = balances;
  const available = balances.available.amount;
  const money = (value) => formatMoney(value, currency);

  const [amountText, setAmountText] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [step, setStep] = useState('form');
  const [busy, setBusy] = useState(false);
  const amountRef = useRef(null);
  const reviewRef = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (step === 'review') reviewRef.current?.focus();
    else amountRef.current?.focus();
  }, [step]);

  const amount = parseAmount(amountText);
  const validAmount = amount !== null && amount >= MIN_WITHDRAWAL && amount <= available ? amount : null;

  function validate() {
    const { errors } = content;
    if (!account.verified) return errors.unverified;
    if (amountText.trim() === '') return errors.amountRequired;
    if (amount === null) return errors.amountInvalid;
    if (amount < MIN_WITHDRAWAL) return fill(errors.amountTooLow, { min: money(MIN_WITHDRAWAL) });
    if (amount > available) return fill(errors.amountTooHigh, { max: money(available) });
    return '';
  }

  function handleReview(event) {
    event.preventDefault();
    const problem = validate();
    setError(problem);
    if (problem) {
      amountRef.current?.focus();
      return;
    }
    setStep('review');
  }

  async function handleConfirm() {
    setBusy(true);
    setFormError('');
    try {
      const { data, error: requestError } = await requestWithdrawal({ amount: validAmount, note: note.trim() });
      if (requestError) throw requestError;
      navigate(fill(transactionsContent.detailHref, { id: encodeURIComponent(data.id) }), { state: { requested: true } });
    } catch {
      setFormError(content.errors.failed);
      setBusy(false);
    }
  }

  const summary = content.summary;
  const shown = validAmount === null ? summary.empty : money(validAmount);

  return (
    <div className={styles.page}>
      <PageHeader
        title={content.title}
        subtitle={content.subtitle}
        breadcrumbs={{
          label: content.breadcrumbLabel,
          items: [{ label: content.breadcrumbRoot, to: content.breadcrumbRootHref }, { label: content.title }],
        }}
      />

      <div className={styles.grid}>
        <div className={styles.column}>
          {step === 'form' ? (
            <form className={styles.card} onSubmit={handleReview} noValidate aria-label={content.title}>
              <div className={styles.available}>
                <p className={styles.availableLabel}>{content.available}</p>
                <p className={styles.availableValue}>{money(available)}</p>
              </div>

              <FormField
                id="withdraw-amount"
                label={content.amount.label}
                required
                requiredAria={content.requiredAria}
                hint={fill(content.amount.hint, { min: money(MIN_WITHDRAWAL), max: money(available) })}
                error={error}
              >
                {(props) => (
                  <div className={styles.affix}>
                    <span className={styles.prefix} aria-hidden="true">{content.amount.prefix}</span>
                    <input
                      {...props}
                      ref={amountRef}
                      className={`${controls.input} ${styles.amountInput}`}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      value={amountText}
                      onChange={(event) => {
                        setAmountText(event.target.value);
                        if (error) setError('');
                      }}
                    />
                  </div>
                )}
              </FormField>

              <div className={styles.quick} role="group" aria-label={content.amount.quick}>
                {content.amount.quickOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={styles.quickButton}
                    onClick={() => {
                      setAmountText(String(Math.floor(available * option.ratio)));
                      setError('');
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <section className={styles.destination} aria-labelledby="withdraw-destination">
                <div className={styles.destinationHeader}>
                  <h2 id="withdraw-destination" className={styles.destinationTitle}>{content.destination.title}</h2>
                  <Link to={content.destination.manageHref} className={styles.link}>{content.destination.manage}</Link>
                </div>
                <div className={styles.account}>
                  <span className={styles.bankIcon} aria-hidden="true"><Landmark size={20} /></span>
                  <div className={styles.accountText}>
                    <p className={styles.bank}>{account.bank}</p>
                    <p className={styles.holder}>
                      {fill(content.destination.accountLine, { holder: account.holder, last4: account.last4 })}
                    </p>
                  </div>
                  <StatusBadge tone={account.verified ? 'success' : 'warning'}>
                    {account.verified ? content.destination.verified : content.destination.unverified}
                  </StatusBadge>
                </div>
                {!account.verified ? <p className={styles.warning}>{content.destination.unverifiedBody}</p> : null}
              </section>

              <FormField
                id="withdraw-note"
                label={content.note.label}
                hint={content.note.hint}
              >
                {(props) => (
                  <input
                    {...props}
                    className={controls.input}
                    type="text"
                    maxLength={content.note.maxLength}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                  />
                )}
              </FormField>

              <div className={styles.buttons}>
                <Link to={content.cancelHref} className={styles.cancel}>{content.cancel}</Link>
                <Button type="submit" disabled={!account.verified}>{content.review}</Button>
              </div>
            </form>
          ) : (
            <section className={styles.card} aria-labelledby="withdraw-review-title">
              <h2 id="withdraw-review-title" ref={reviewRef} tabIndex={-1} className={styles.reviewTitle}>
                {content.reviewTitle}
              </h2>
              <p className={styles.reviewAmount}>{money(validAmount)}</p>
              <p className={styles.reviewBody}>
                {fill(content.reviewBody, { amount: money(validAmount), bank: account.bank, last4: account.last4 })}
              </p>
              {note.trim() ? <p className={styles.reviewNote}>{fill(content.reviewNote, { note: note.trim() })}</p> : null}
              {formError ? <p className={styles.error} role="alert">{formError}</p> : null}
              <div className={styles.buttons}>
                <Button variant="outline" onClick={() => setStep('form')} disabled={busy}>{content.back}</Button>
                <Button onClick={handleConfirm} disabled={busy}>{busy ? content.confirming : content.confirm}</Button>
              </div>
            </section>
          )}
        </div>

        <div className={styles.column}>
          <Panel title={summary.title}>
            <dl className={styles.summary} aria-live="polite">
              <div>
                <dt>{summary.amount}</dt>
                <dd>{shown}</dd>
              </div>
              <div>
                <dt>{summary.fee}</dt>
                <dd className={styles.free}>{summary.feeValue}</dd>
              </div>
              <div className={styles.receive}>
                <dt>{summary.receive}</dt>
                <dd>{shown}</dd>
              </div>
              <div>
                <dt>{summary.arrival}</dt>
                <dd>{fill(summary.arrivalValue, { hours: mockPayoutSpeedHours })}</dd>
              </div>
            </dl>
          </Panel>
        </div>
      </div>
    </div>
  );
}
