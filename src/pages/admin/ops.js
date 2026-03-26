import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import WhiteNavbar from "../../components/navbar/WhiteNavbar";
import Footer from "../../components/footer/Footer";

const AUTO_REFRESH_STORAGE_KEY = "home-cooking:ops:auto-refresh";

function StatusPill({ ok, label }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
        ok ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${ok ? "bg-emerald-600" : "bg-red-600"}`}
        aria-hidden
      />
      {label}
    </span>
  );
}

function KeyRow({ name, value }) {
  return (
    <li className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
      <span className="font-medium text-slate-700">{name}</span>
      <StatusPill ok={Boolean(value)} label={value ? "set" : "missing"} />
    </li>
  );
}

function MetricCard({ title, value, helper }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{title}</p>
      <p className="mt-2 font-display text-3xl text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
    </article>
  );
}

export default function AdminOpsPage() {
  const [statusKey, setStatusKey] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const saved = window.localStorage.getItem(AUTO_REFRESH_STORAGE_KEY);
    if (saved === "true" || saved === "false") {
      setAutoRefresh(saved === "true");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(AUTO_REFRESH_STORAGE_KEY, String(autoRefresh));
  }, [autoRefresh]);

  const appEntries = useMemo(() => Object.entries(data?.app?.entries || {}), [data]);
  const n8nEntries = useMemo(() => Object.entries(data?.n8n?.entries || {}), [data]);
  const alertEntries = useMemo(
    () => Object.entries(data?.alerting?.entries || {}),
    [data]
  );
  const metrics = data?.metrics;

  const loadStatus = useCallback(async () => {
    if (inFlightRef.current) {
      return;
    }

    inFlightRef.current = true;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/integrations/status", {
        method: "GET",
        headers: {
          ...(statusKey.trim() ? { "x-status-key": statusKey.trim() } : {}),
        },
      });

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.message || "Status fetch failed");
      }

      setData(body);
      setHistory((prev) => {
        const next = [
          {
            checkedAt: body.checkedAt,
            ok: Boolean(body.ok),
            label: body.ok ? "ready" : "not ready",
          },
          ...prev,
        ];
        return next.slice(0, 6);
      });
    } catch (fetchError) {
      setData(null);
      const message = fetchError?.message || "Unknown error";
      setError(message);
      setHistory((prev) => {
        const next = [
          {
            checkedAt: new Date().toISOString(),
            ok: false,
            label: message,
          },
          ...prev,
        ];
        return next.slice(0, 6);
      });
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, [statusKey]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  useEffect(() => {
    if (!autoRefresh) {
      return undefined;
    }

    const timer = setInterval(() => {
      loadStatus();
    }, 30000);

    return () => clearInterval(timer);
  }, [autoRefresh, loadStatus]);

  return (
    <>
      <Head>
        <title>Admin Ops | Home Cooking</title>
      </Head>

      <WhiteNavbar />

      <main
        className="min-h-screen py-12"
        style={{
          background:
            "radial-gradient(circle at 15% 10%, rgba(20,184,166,0.09), transparent 40%), radial-gradient(circle at 90% 80%, rgba(249,115,22,0.1), transparent 45%), var(--hc-bg)",
        }}
      >
        <section className="section-shell">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              Ops Dashboard
            </p>
            <h1 className="mt-2 font-display text-4xl text-slate-900">Integrations Status</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Check app and n8n readiness before production rollout. In production, provide
              <span className="font-semibold"> STATUS_API_KEY </span>
              via the input below.
            </p>
          </div>

          <div className="mb-8 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
            <label htmlFor="status-key" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Status API Key (production only)
            </label>
            <div className="mb-3 flex flex-wrap items-center gap-4">
              <p className="text-xs text-slate-500">
                Auto-refresh interval: 30 seconds.
              </p>
              <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                />
                Auto-refresh {autoRefresh ? "on" : "off"}
              </label>
            </div>
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                id="status-key"
                type="password"
                value={statusKey}
                onChange={(e) => setStatusKey(e.target.value)}
                placeholder="Paste STATUS_API_KEY if required"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />
              <button
                type="button"
                onClick={loadStatus}
                disabled={loading}
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Checking..." : "Refresh Status"}
              </button>
            </div>
          </div>

          {error ? (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {data ? (
            <>
              <div className="mb-6 grid gap-4 md:grid-cols-3">
                <MetricCard
                  title="Registrations"
                  value={metrics?.totals?.registrations ?? 0}
                  helper={`Last 24h: ${metrics?.last24h?.registrations ?? 0}`}
                />
                <MetricCard
                  title="Recipes Created"
                  value={metrics?.totals?.recipesCreated ?? 0}
                  helper={`Last 24h: ${metrics?.last24h?.recipesCreated ?? 0}`}
                />
                <MetricCard
                  title="Publish Rate"
                  value={`${metrics?.totals?.publishRate ?? 0}%`}
                  helper={`Last 24h: ${metrics?.last24h?.publishRate ?? 0}%`}
                />
              </div>

              <div className="mb-6 flex flex-wrap items-center gap-3">
                <StatusPill ok={Boolean(data.ok)} label={data.ok ? "overall ready" : "overall not ready"} />
                <StatusPill
                  ok={Boolean(data?.app?.ready)}
                  label={data?.app?.ready ? "app ready" : "app incomplete"}
                />
                <StatusPill
                  ok={Boolean(data?.n8n?.ready)}
                  label={data?.n8n?.ready ? "n8n ready" : "n8n incomplete"}
                />
                <StatusPill
                  ok={Boolean(data?.alerting?.allConfigured)}
                  label={data?.alerting?.allConfigured ? "alerting full" : "alerting partial"}
                />
                <span className="text-xs text-slate-500">
                  KPI source: {metrics?.source || "n/a"}
                </span>
                <span className="text-xs text-slate-500">Checked: {data.checkedAt}</span>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h2 className="mb-3 font-display text-2xl text-slate-900">App Env</h2>
                  <ul className="space-y-2">
                    {appEntries.map(([name, value]) => (
                      <KeyRow key={name} name={name} value={value} />
                    ))}
                  </ul>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h2 className="mb-3 font-display text-2xl text-slate-900">n8n Env</h2>
                  <ul className="space-y-2">
                    {n8nEntries.map(([name, value]) => (
                      <KeyRow key={name} name={name} value={value} />
                    ))}
                  </ul>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h2 className="mb-3 font-display text-2xl text-slate-900">Alerting Env</h2>
                  <ul className="space-y-2">
                    {alertEntries.map(([name, value]) => (
                      <KeyRow key={name} name={name} value={value} />
                    ))}
                  </ul>
                </article>
              </div>

              <article className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <h2 className="mb-3 font-display text-2xl text-slate-900">Recent Checks</h2>
                {history.length ? (
                  <ul className="space-y-2">
                    {history.map((entry, index) => (
                      <li
                        key={`${entry.checkedAt}-${index}`}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                      >
                        <span className="text-slate-700">{entry.checkedAt}</span>
                        <StatusPill ok={entry.ok} label={entry.label} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">No checks yet.</p>
                )}
              </article>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-500">
              Click <span className="font-semibold">Refresh Status</span> to load integration readiness.
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
