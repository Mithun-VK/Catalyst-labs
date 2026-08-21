"use client";

import { useEffect, useRef, useState } from "react";
import {
  BUDGET_RANGES,
  emptyEnquiry,
  LIMITS,
  PROJECT_TYPES,
  TIMELINES,
  validateEnquiry,
  validateField,
  type EnquiryInput,
  type FieldErrors,
} from "@/lib/enquiry";
import { track } from "@/lib/analytics";
import { mailtoLink, site, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error";

export function EnquiryForm() {
  const [values, setValues] = useState<EnquiryInput>(emptyEnquiry);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string>("");
  const started = useRef(false);
  const mountedAt = useRef(0);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  // Move focus to whichever outcome the submit produced.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
    if (status === "error") errorRef.current?.focus();
  }, [status]);

  const set = (field: keyof EnquiryInput, value: string) => {
    if (!started.current) {
      started.current = true;
      track("form_started");
    }
    setValues((v) => ({ ...v, [field]: value }));
    // Only clear an existing error while typing; don't create new ones.
    if (errors[field]) {
      setErrors((e) => ({ ...e, [field]: validateField(field, value) }));
    }
  };

  const blur = (field: keyof EnquiryInput) => {
    setErrors((e) => ({ ...e, [field]: validateField(field, values[field] as string) }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    const payload = { ...values, elapsedMs: Date.now() - mountedAt.current };
    const result = validateEnquiry(payload);

    if (!result.ok) {
      setErrors(result.errors);
      setStatus("idle");
      track("form_error", { reason: "validation" });
      // Focus the first field that failed - falling back to the first control
      // in the group for radio sets, which have no single element id.
      const first = Object.keys(result.errors)[0];
      const target =
        document.getElementById(`field-${first}`) ??
        document.querySelector<HTMLElement>(`[name="${first}"]`);
      target?.focus();
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
        track("form_submitted", { projectType: payload.projectType });
        return;
      }

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        errors?: FieldErrors;
      };

      if (res.status === 400 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        track("form_error", { reason: "server_validation" });
        return;
      }

      setStatus("error");
      setFormError(
        data.error ??
          "We couldn't send that just now. Please use WhatsApp or email below - those reach us directly."
      );
      track("form_error", { reason: `http_${res.status}` });
    } catch {
      setStatus("error");
      setFormError(
        "Network error. Please check your connection, or reach us on WhatsApp or email below."
      );
      track("form_error", { reason: "network" });
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="flex h-full flex-col justify-center border border-line-ember bg-ember/[0.04] p-8 sm:p-10"
      >
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center border border-ember"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 text-ember"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 12.5l5.5 5.5L20 7" />
          </svg>
        </span>

        <h3 className="mt-6 text-h2 text-paper">That&rsquo;s with us.</h3>
        <p className="mt-4 max-w-md text-lead text-mute">
          We read every enquiry ourselves. Expect a reply from{" "}
          <span className="text-paper">{site.contact.email}</span> within one
          working day - usually with a question or two about the problem before
          anything else.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappLink("Hi Catalyst Labs - I just submitted an enquiry.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { location: "form_success" })}
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 border border-line-strong px-5 text-small text-paper transition-colors duration-(--duration-base) hover:border-paper/40"
          >
            Continue on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              setValues(emptyEnquiry());
              setErrors({});
              setStatus("idle");
              started.current = false;
              mountedAt.current = Date.now();
            }}
            className="inline-flex h-11 cursor-pointer items-center justify-center px-5 text-small text-mute transition-colors duration-(--duration-base) hover:text-paper"
          >
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="spotlight border border-line bg-ink-raised p-6 sm:p-8"
      style={{ boxShadow: "var(--shadow-panel)" }}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="name"
          label="Name"
          required
          value={values.name}
          error={errors.name}
          maxLength={LIMITS.name}
          autoComplete="name"
          onChange={(v) => set("name", v)}
          onBlur={() => blur("name")}
        />
        <Field
          id="company"
          label="Company"
          value={values.company}
          error={errors.company}
          maxLength={LIMITS.company}
          autoComplete="organization"
          onChange={(v) => set("company", v)}
          onBlur={() => blur("company")}
        />
        <Field
          id="email"
          label="Email"
          type="email"
          required
          inputMode="email"
          value={values.email}
          error={errors.email}
          maxLength={LIMITS.email}
          autoComplete="email"
          onChange={(v) => set("email", v)}
          onBlur={() => blur("email")}
        />
        <Field
          id="phone"
          label="Phone / WhatsApp"
          type="tel"
          inputMode="tel"
          value={values.phone}
          error={errors.phone}
          maxLength={LIMITS.phone}
          autoComplete="tel"
          onChange={(v) => set("phone", v)}
          onBlur={() => blur("phone")}
        />
      </div>

      <div className="mt-8 grid gap-8">
        <ChoiceGroup
          name="projectType"
          label="Project type"
          required
          options={PROJECT_TYPES}
          value={values.projectType}
          error={errors.projectType}
          onChange={(v) => set("projectType", v)}
        />

        <div className="grid gap-8 sm:grid-cols-2">
          <ChoiceGroup
            name="budget"
            label="Budget range"
            options={BUDGET_RANGES}
            value={values.budget}
            onChange={(v) => set("budget", v)}
          />
          <ChoiceGroup
            name="timeline"
            label="Timeline"
            options={TIMELINES}
            value={values.timeline}
            onChange={(v) => set("timeline", v)}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6">
        <Field
          id="brief"
          label="What are you trying to build, automate or improve?"
          required
          textarea
          rows={5}
          value={values.brief}
          error={errors.brief}
          maxLength={LIMITS.brief}
          hint="The problem in plain language is more useful to us than a spec."
          onChange={(v) => set("brief", v)}
          onBlur={() => blur("brief")}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            id="currentProduct"
            label="Current website / product"
            value={values.currentProduct}
            error={errors.currentProduct}
            maxLength={LIMITS.currentProduct}
            placeholder="example.com"
            onChange={(v) => set("currentProduct", v)}
            onBlur={() => blur("currentProduct")}
          />
          <Field
            id="notes"
            label="Anything else"
            value={values.notes}
            error={errors.notes}
            maxLength={LIMITS.notes}
            onChange={(v) => set("notes", v)}
            onBlur={() => blur("notes")}
          />
        </div>
      </div>

      {/* Honeypot. Hidden from sight, from assistive tech and from the tab
          order - only an automated filler will populate it. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="field-website">Website (leave blank)</label>
        <input
          id="field-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => setValues((v) => ({ ...v, website: e.target.value }))}
        />
      </div>

      {status === "error" ? (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="mt-8 border border-warn/40 bg-warn/[0.06] px-5 py-4 text-small text-paper"
        >
          {formError}
          <span className="mt-2 block text-mute">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ember underline underline-offset-4"
            >
              WhatsApp
            </a>
            {" · "}
            <a
              href={mailtoLink("Project enquiry")}
              className="text-ember underline underline-offset-4"
            >
              {site.contact.email}
            </a>
          </span>
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-4 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-[0.8125rem] text-mute-deep">
          We use these details to reply to your enquiry. Nothing is shared or sold.
        </p>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex h-[3.25rem] cursor-pointer items-center justify-center gap-2.5 rounded-xs bg-ember px-7 font-medium text-ink transition-colors duration-(--duration-base) hover:bg-ember-soft disabled:pointer-events-none disabled:opacity-60"
        >
          {status === "submitting" ? (
            <>
              <span
                aria-hidden="true"
                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink/30 border-t-ink"
              />
              Sending
            </>
          ) : (
            <>
              Send enquiry
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5 transition-transform duration-(--duration-base) ease-(--ease-out-quart) group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="square"
              >
                <path d="M1 8h13M9 3l5 5-5 5" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */

function Field({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  required,
  textarea,
  rows,
  type = "text",
  ...rest
}: {
  id: keyof EnquiryInput & string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  type?: string;
  maxLength?: number;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
}) {
  const describedBy =
    [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const shared = cn(
    "w-full border bg-ink px-4 py-3 text-paper placeholder:text-mute-deep",
    "transition-colors duration-(--duration-base)",
    "hover:border-line-strong focus:border-ember focus:outline-none",
    error ? "border-warn/60" : "border-line"
  );

  return (
    <div className={textarea ? "sm:col-span-2" : ""}>
      <label htmlFor={`field-${id}`} className="label flex items-center gap-2 text-mute">
        {label}
        {required ? (
          <span className="text-ember" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="text-mute-deep normal-case tracking-normal">
            (optional)
          </span>
        )}
      </label>

      <div className="mt-2.5">
        {textarea ? (
          <textarea
            id={`field-${id}`}
            name={id}
            rows={rows ?? 4}
            required={required}
            aria-required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className={cn(shared, "resize-y")}
            {...rest}
          />
        ) : (
          <input
            id={`field-${id}`}
            name={id}
            type={type}
            required={required}
            aria-required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className={shared}
            {...rest}
          />
        )}
      </div>

      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-2 text-[0.8125rem] text-mute-deep">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p
          id={`${id}-error`}
          className="mt-2 flex items-center gap-2 text-[0.8125rem] text-warn"
        >
          <span aria-hidden="true" className="h-1 w-1 shrink-0 bg-warn" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Radio group rendered as selectable chips. Real inputs underneath. */
function ChoiceGroup({
  name,
  label,
  options,
  value,
  onChange,
  error,
  required,
}: {
  name: string;
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="label flex items-center gap-2 text-mute">
        {label}
        {required ? (
          <span className="text-ember" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="text-mute-deep normal-case tracking-normal">
            (optional)
          </span>
        )}
      </legend>

      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = value === option;
          const id = `${name}-${option.replace(/\W+/g, "-").toLowerCase()}`;
          return (
            <div key={option}>
              <input
                type="radio"
                id={id}
                name={name}
                value={option}
                checked={checked}
                onChange={() => onChange(option)}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className={cn(
                  "inline-flex h-11 cursor-pointer items-center gap-2.5 border px-4 text-small transition-colors duration-(--duration-base)",
                  "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember",
                  checked
                    ? "border-line-ember bg-ember/10 text-paper"
                    : "border-line text-mute hover:border-line-strong hover:text-paper"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 transition-colors duration-(--duration-base)",
                    checked ? "bg-ember" : "bg-mute-deep"
                  )}
                />
                {option}
              </label>
            </div>
          );
        })}
      </div>

      {error ? (
        <p
          id={`${name}-error`}
          className="mt-2.5 flex items-center gap-2 text-[0.8125rem] text-warn"
        >
          <span aria-hidden="true" className="h-1 w-1 shrink-0 bg-warn" />
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
