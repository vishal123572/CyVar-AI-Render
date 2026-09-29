import {
  Database,
  ShieldAlert,
  Activity,
  CheckCircle2,
  Clock,
  RefreshCw,
  Server,
  Cloud,
  Radio,
} from "lucide-react";

function Connectors() {
  const activeConnectors = [
    {
      name: "NVD",
      fullName: "National Vulnerability Database",
      type: "Vulnerability Intelligence",
      provides: "CVE descriptions & CVSS severity",
      status: "Connected",
      source: "Public API",
      icon: Database,
    },
    {
      name: "FIRST EPSS",
      fullName:
        "Exploit Prediction Scoring System",
      type: "Threat Intelligence",
      provides:
        "Exploit-likelihood threat signal",
      status: "Connected",
      source: "Public API",
      icon: Activity,
    },
    {
      name: "CISA KEV",
      fullName:
        "Known Exploited Vulnerabilities Catalog",
      type: "Exploitation Intelligence",
      provides:
        "Known real-world exploitation evidence",
      status: "Connected",
      source: "Public Feed",
      icon: ShieldAlert,
    },
  ];

  const enterpriseConnectors = [
    {
      name: "SIEM",
      example: "Splunk / Wazuh / Microsoft Sentinel",
      status: "Planned",
      icon: Radio,
    },
    {
      name: "EDR",
      example: "Endpoint security telemetry",
      status: "Planned",
      icon: Server,
    },
    {
      name: "Cloud Security",
      example: "AWS / Azure / GCP security findings",
      status: "Planned",
      icon: Cloud,
    },
  ];

  return (
    <div>
      {/* HEADER */}

      <div className="flex justify-between items-start mb-7">
        <div>
          <p className="text-sm text-cyan-400">
            DATA INGESTION & INTEGRATION
          </p>

          <h1 className="text-3xl font-bold mt-1">
            Security Data Connectors
          </h1>

          <p className="text-slate-400 mt-2">
            External security intelligence used by
            CyVar to enrich vulnerability and cyber
            risk analysis.
          </p>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-green-950/30 border border-green-800 text-green-300">
          3 ACTIVE SOURCES
        </span>
      </div>

      {/* METRICS */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Metric
          label="Active Connectors"
          value="3"
        />

        <Metric
          label="Vulnerability Source"
          value="NVD"
        />

        <Metric
          label="Threat Signal"
          value="EPSS"
        />

        <Metric
          label="Exploitation Intel"
          value="CISA KEV"
        />
      </div>

      {/* PIPELINE */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">
        <p className="text-xs text-cyan-400">
          CYVAR INTELLIGENCE PIPELINE
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-5">
          <PipelineBox text="NVD" />

          <Arrow />

          <PipelineBox text="FIRST EPSS" />

          <Arrow />

          <PipelineBox text="CISA KEV" />

          <Arrow />

          <PipelineBox text="CyVar Risk Engine" highlight />

          <Arrow />

          <PipelineBox
            text="XGBoost + Monte Carlo"
            highlight
          />
        </div>

        <p className="text-xs text-slate-500 mt-5">
          Public threat intelligence is combined
          with the synthetic enterprise asset and
          control environment before risk
          calculations are performed.
        </p>
      </div>

      {/* ACTIVE CONNECTORS */}

      <div className="mt-6">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-lg font-semibold">
              Connected Intelligence Sources
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Public security sources currently
              integrated with the CyVar prototype.
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 text-xs border border-slate-700 hover:border-cyan-700 px-4 py-2 rounded-lg text-slate-300"
          >
            <RefreshCw size={14} />
            Refresh Status
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {activeConnectors.map((connector) => {
            const Icon = connector.icon;

            return (
              <div
                key={connector.name}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5"
              >
                <div className="flex justify-between">
                  <div className="w-11 h-11 rounded-lg bg-cyan-950/40 flex items-center justify-center">
                    <Icon
                      size={21}
                      className="text-cyan-400"
                    />
                  </div>

                  <span className="flex items-center gap-1.5 text-xs text-green-400">
                    <CheckCircle2 size={14} />
                    {connector.status}
                  </span>
                </div>

                <h3 className="font-semibold text-lg mt-5">
                  {connector.name}
                </h3>

                <p className="text-xs text-slate-500 mt-1 min-h-[32px]">
                  {connector.fullName}
                </p>

                <div className="border-t border-slate-800 mt-5 pt-4 space-y-4">
                  <Info
                    label="Type"
                    value={connector.type}
                  />

                  <Info
                    label="Provides"
                    value={connector.provides}
                  />

                  <Info
                    label="Integration"
                    value={connector.source}
                  />
                </div>

                <div className="flex items-center gap-2 mt-5 text-xs text-slate-600">
                  <Clock size={13} />
                  Used during vulnerability
                  intelligence refresh
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ENTERPRISE CONNECTORS */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">
        <div>
          <p className="text-xs text-purple-400">
            PRODUCTION INTEGRATION ROADMAP
          </p>

          <h2 className="text-lg font-semibold mt-1">
            Enterprise Security Connectors
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            These integrations are architectural
            extensions and are not connected to the
            current prototype.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {enterpriseConnectors.map(
            (connector) => {
              const Icon = connector.icon;

              return (
                <div
                  key={connector.name}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4"
                >
                  <Icon
                    size={19}
                    className="text-purple-400"
                  />

                  <p className="font-medium mt-3">
                    {connector.name}
                  </p>

                  <p className="text-xs text-slate-500 mt-2">
                    {connector.example}
                  </p>

                  <span className="inline-block mt-4 text-[11px] px-2 py-1 rounded-full bg-slate-900 text-slate-500">
                    {connector.status}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* DATA DISTINCTION */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        <DataBox
          title="Real Public Data"
          text="CVE, CVSS, EPSS and CISA KEV threat intelligence."
        />

        <DataBox
          title="Synthetic Enterprise Data"
          text="Assets, business services, controls, software mappings and financial assumptions."
        />

        <DataBox
          title="Calculated Risk"
          text="XGBoost classifications, scenario frequency, EAL, VaR and optimized control recommendations."
        />
      </div>

      {/* DISCLAIMER */}

      <div className="mt-6 bg-amber-950/20 border border-amber-900/40 rounded-xl p-5">
        <p className="text-sm text-amber-300 font-medium">
          Prototype Integration Scope
        </p>

        <p className="text-xs text-slate-500 mt-2 leading-5">
          NVD, FIRST EPSS and CISA KEV are the
          external public intelligence integrations
          used by this prototype. SIEM, EDR and
          cloud-security connectors shown above are
          future production integrations and are not
          currently streaming telemetry into CyVar.
        </p>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="text-xl font-bold mt-3">
        {value}
      </p>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-[11px] text-slate-600">
        {label}
      </p>

      <p className="text-xs text-slate-300 mt-1">
        {value}
      </p>
    </div>
  );
}

function PipelineBox({
  text,
  highlight = false,
}) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border text-xs font-medium ${
        highlight
          ? "border-cyan-800 bg-cyan-950/30 text-cyan-300"
          : "border-slate-700 bg-slate-950 text-slate-300"
      }`}
    >
      {text}
    </div>
  );
}

function Arrow() {
  return (
    <span className="text-slate-600">
      →
    </span>
  );
}

function DataBox({ title, text }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <p className="text-sm font-semibold">
        {title}
      </p>

      <p className="text-xs text-slate-500 mt-2 leading-5">
        {text}
      </p>
    </div>
  );
}

export default Connectors;