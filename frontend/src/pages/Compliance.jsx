import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Building2,
  Landmark,
  Eye,
  LockKeyhole,
  RotateCcw,
  Radar,
} from "lucide-react";

function Compliance() {
  const frameworks = [
    {
      name: "NIST CSF",
      fullName: "NIST Cybersecurity Framework",
      coverage: 82,
      status: "Strong",
      controls: "18 / 22",
    },
    {
      name: "ISO 27001",
      fullName: "Information Security Management",
      coverage: 74,
      status: "Moderate",
      controls: "14 / 19",
    },
    {
      name: "CIS Controls",
      fullName: "CIS Critical Security Controls",
      coverage: 78,
      status: "Moderate",
      controls: "14 / 18",
    },
    {
      name: "RBI",
      fullName: "Cyber Security Controls - Banking",
      coverage: 69,
      status: "Needs Attention",
      controls: "11 / 16",
    },
    {
      name: "SEBI CSCRF",
      fullName:
        "Cybersecurity & Cyber Resilience Framework",
      coverage: 71,
      status: "Needs Attention",
      controls: "Prototype Mapping",
      sebi: true,
    },
  ];

  const controlMappings = [
    {
      control: "Multi-Factor Authentication",
      asset: "Identity Server",
      status: "Implemented",
      frameworks: [
        "NIST",
        "ISO 27001",
        "CIS",
        "RBI",
        "SEBI CSCRF",
      ],
    },
    {
      control: "Web Application Firewall",
      asset: "Payment Gateway API",
      status: "Implemented",
      frameworks: [
        "NIST",
        "ISO 27001",
        "CIS",
        "SEBI CSCRF",
      ],
    },
    {
      control: "Endpoint Detection & Response",
      asset: "Payment Gateway API",
      status: "Implemented",
      frameworks: [
        "NIST",
        "CIS",
        "RBI",
        "SEBI CSCRF",
      ],
    },
    {
      control: "Database Encryption",
      asset: "Customer Database",
      status: "Implemented",
      frameworks: [
        "NIST",
        "ISO 27001",
        "CIS",
        "RBI",
        "SEBI CSCRF",
      ],
    },
    {
      control: "API Gateway Protection",
      asset: "Mobile Banking API",
      status: "Implemented",
      frameworks: [
        "NIST",
        "CIS",
        "RBI",
        "SEBI CSCRF",
      ],
    },
    {
      control: "Privileged Access Management",
      asset: "Identity Server",
      status: "Gap",
      frameworks: [
        "NIST",
        "ISO 27001",
        "CIS",
        "RBI",
        "SEBI CSCRF",
      ],
    },
    {
      control: "Patch Management",
      asset: "Internet Banking Web Server",
      status: "Gap",
      frameworks: [
        "NIST",
        "ISO 27001",
        "CIS",
        "RBI",
        "SEBI CSCRF",
      ],
    },
  ];

  /*
   * These are prototype readiness mappings.
   * They are NOT official SEBI compliance scores.
   */
  const sebiAreas = [
    {
      name: "Anticipate",
      icon: Radar,
      status: "Mapped",
      description:
        "Asset inventory, vulnerability intelligence and continuous risk identification.",
    },
    {
      name: "Withstand",
      icon: LockKeyhole,
      status: "Partial",
      description:
        "MFA, encryption, WAF and API protection support preventive resilience.",
    },
    {
      name: "Contain",
      icon: ShieldCheck,
      status: "Partial",
      description:
        "EDR and protective controls support detection and containment capabilities.",
    },
    {
      name: "Recover",
      icon: RotateCcw,
      status: "Review",
      description:
        "Recovery planning and tested restoration workflows are not fully modeled in the prototype.",
    },
    {
      name: "Evolve",
      icon: Eye,
      status: "Mapped",
      description:
        "Continuous monitoring, risk trends and what-if analysis support ongoing improvement.",
    },
  ];

  const averageCoverage = Math.round(
    frameworks.reduce(
      (total, item) =>
        total + item.coverage,
      0
    ) / frameworks.length
  );

  const gaps = controlMappings.filter(
    (item) => item.status === "Gap"
  ).length;

  const implemented = controlMappings.filter(
    (item) =>
      item.status === "Implemented"
  ).length;

  return (
    <div>
      {/* HEADER */}

      <div className="mb-7">
        <p className="text-sm text-cyan-400 font-medium">
          GOVERNANCE & COMPLIANCE
        </p>

        <h1 className="text-3xl font-bold mt-1">
          Compliance & Regulatory Readiness
        </h1>

        <p className="text-slate-400 mt-2">
          Map CyVar security controls to
          cybersecurity frameworks and regulatory
          requirements.
        </p>
      </div>

      {/* TOP METRICS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <Metric
          title="Illustrative Coverage"
          value={`${averageCoverage}%`}
          icon={ShieldCheck}
        />

        <Metric
          title="Frameworks"
          value={frameworks.length}
          icon={FileCheck2}
        />

        <Metric
          title="Implemented Controls"
          value={implemented}
          icon={CheckCircle2}
        />

        <Metric
          title="Control Gaps"
          value={gaps}
          icon={AlertTriangle}
        />
      </div>

      {/* FRAMEWORK COVERAGE */}

      <div className="mt-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Framework Coverage
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Illustrative readiness mapping of the
            current synthetic CyVar control
            environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
          {frameworks.map((framework) => (
            <div
              key={framework.name}
              className={`bg-slate-900 border rounded-xl p-5 ${
                framework.sebi
                  ? "border-purple-800/70"
                  : "border-slate-800"
              }`}
            >
              <div className="flex justify-between items-start">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    framework.sebi
                      ? "bg-purple-950/50"
                      : "bg-cyan-950/50"
                  }`}
                >
                  {framework.sebi ? (
                    <Landmark
                      size={20}
                      className="text-purple-400"
                    />
                  ) : (
                    <Building2
                      size={20}
                      className="text-cyan-400"
                    />
                  )}
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    framework.coverage >= 80
                      ? "bg-green-950/50 text-green-400"
                      : framework.coverage >= 70
                      ? "bg-amber-950/50 text-amber-400"
                      : "bg-red-950/50 text-red-400"
                  }`}
                >
                  {framework.status}
                </span>
              </div>

              <h3 className="font-semibold mt-5">
                {framework.name}
              </h3>

              <p className="text-xs text-slate-500 mt-1 min-h-[32px]">
                {framework.fullName}
              </p>

              <div className="flex justify-between mt-5">
                <span className="text-xs text-slate-500">
                  Readiness
                </span>

                <span className="text-sm font-semibold">
                  {framework.coverage}%
                </span>
              </div>

              <div className="w-full h-2 bg-slate-950 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    framework.sebi
                      ? "bg-purple-500"
                      : "bg-cyan-500"
                  }`}
                  style={{
                    width: `${framework.coverage}%`,
                  }}
                />
              </div>

              <p className="text-xs text-slate-600 mt-3">
                {framework.controls}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SEBI CSCRF */}

      <div className="mt-6 bg-slate-900 border border-purple-900/50 rounded-xl p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-purple-400">
              SEBI REGULATORY READINESS
            </p>

            <h2 className="text-xl font-semibold mt-1">
              Cybersecurity & Cyber Resilience
              Framework (CSCRF)
            </h2>

            <p className="text-sm text-slate-500 mt-2 max-w-3xl">
              CyVar maps its current prototype
              capabilities against SEBI's five cyber
              resilience goals. This view is intended
              for readiness analysis rather than
              certification.
            </p>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-purple-950/40 border border-purple-800 text-purple-300">
            SEBI CSCRF
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
          {sebiAreas.map((area) => {
            const Icon = area.icon;

            return (
              <div
                key={area.name}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4"
              >
                <Icon
                  size={19}
                  className="text-purple-400"
                />

                <h3 className="font-semibold mt-3">
                  {area.name}
                </h3>

                <span
                  className={`inline-block text-[11px] mt-2 px-2 py-1 rounded-full ${
                    area.status === "Mapped"
                      ? "bg-green-950/40 text-green-400"
                      : area.status === "Partial"
                      ? "bg-amber-950/40 text-amber-400"
                      : "bg-red-950/40 text-red-400"
                  }`}
                >
                  {area.status}
                </span>

                <p className="text-xs text-slate-500 mt-3 leading-5">
                  {area.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* SEBI SPECIFIC READINESS AREAS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-5">
          <ReadinessBox
            title="Asset Inventory"
            status="Available"
            text="CyVar maintains a synthetic enterprise asset inventory with criticality and exposure."
          />

          <ReadinessBox
            title="Vulnerability & Patch"
            status="Gap Identified"
            text="CVE intelligence is monitored; patch management remains a modeled control gap."
          />

          <ReadinessBox
            title="Risk Monitoring"
            status="Available"
            text="Continuous prototype monitoring tracks EAL, VaR and ML risk changes."
          />

          <ReadinessBox
            title="Cyber Resilience"
            status="Partial"
            text="Financial simulation and what-if analysis are modeled; full recovery testing is outside the prototype."
          />
        </div>
      </div>

      {/* CONTROL MAPPING */}

      <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold">
            Control-to-Framework Mapping
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Shows how current CyVar demo controls
            align across cybersecurity frameworks,
            including prototype SEBI CSCRF mapping.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/60">
              <tr className="text-xs text-slate-500">
                <th className="px-6 py-4">
                  SECURITY CONTROL
                </th>

                <th className="px-6 py-4">
                  ASSET
                </th>

                <th className="px-6 py-4">
                  STATUS
                </th>

                <th className="px-6 py-4">
                  FRAMEWORK MAPPING
                </th>
              </tr>
            </thead>

            <tbody>
              {controlMappings.map((item) => (
                <tr
                  key={`${item.control}-${item.asset}`}
                  className="border-t border-slate-800"
                >
                  <td className="px-6 py-5">
                    <p className="text-sm font-medium">
                      {item.control}
                    </p>
                  </td>

                  <td className="px-6 py-5 text-sm text-slate-400">
                    {item.asset}
                  </td>

                  <td className="px-6 py-5">
                    {item.status ===
                    "Implemented" ? (
                      <span className="inline-flex items-center gap-2 text-xs text-green-400 bg-green-950/30 px-3 py-1 rounded-full">
                        <CheckCircle2 size={13} />
                        Implemented
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-xs text-red-400 bg-red-950/30 px-3 py-1 rounded-full">
                        <AlertTriangle size={13} />
                        Gap
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2">
                      {item.frameworks.map(
                        (framework) => (
                          <span
                            key={framework}
                            className={`text-xs border px-3 py-1 rounded-full ${
                              framework ===
                              "SEBI CSCRF"
                                ? "bg-purple-950/30 border-purple-800 text-purple-300"
                                : "bg-slate-950 border-slate-700 text-slate-300"
                            }`}
                          >
                            {framework}
                          </span>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRIORITY GAPS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        <GapCard
          title="Privileged Access Management"
          description="PAM is currently not implemented for the Identity Server. This remains a priority access-control gap in the prototype."
          priority="High Priority"
        />

        <GapCard
          title="Patch Management"
          description="Patch management is currently not implemented for the Internet Banking Web Server and is relevant to the prototype's SEBI CSCRF vulnerability-management readiness."
          priority="Critical Priority"
        />
      </div>

      {/* DISCLAIMER */}

      <div className="mt-6 bg-amber-950/20 border border-amber-900/40 rounded-xl p-5">
        <p className="text-sm text-amber-300 font-medium">
          Prototype Regulatory Readiness Mapping
        </p>

        <p className="text-xs text-slate-500 mt-2 leading-5">
          Coverage percentages and cross-framework
          mappings shown in CyVar are illustrative
          prototype values. The SEBI section is a
          high-level readiness mapping to CSCRF
          concepts and does not represent a formal
          regulatory audit, certification, legal
          determination, or assertion that an
          organization is SEBI compliant.
        </p>
      </div>
    </div>
  );
}

function Metric({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex justify-between">
        <p className="text-sm text-slate-500">
          {title}
        </p>

        <Icon
          size={19}
          className="text-cyan-400"
        />
      </div>

      <p className="text-3xl font-bold mt-4">
        {value}
      </p>
    </div>
  );
}

function ReadinessBox({
  title,
  status,
  text,
}) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
      <p className="text-sm font-medium">
        {title}
      </p>

      <p className="text-xs text-purple-400 mt-2">
        {status}
      </p>

      <p className="text-xs text-slate-500 mt-3 leading-5">
        {text}
      </p>
    </div>
  );
}

function GapCard({
  title,
  description,
  priority,
}) {
  return (
    <div className="bg-slate-900 border border-red-950 rounded-xl p-5">
      <div className="flex justify-between gap-4">
        <div>
          <p className="text-xs text-red-400">
            CONTROL GAP
          </p>

          <h3 className="font-semibold mt-2">
            {title}
          </h3>

          <p className="text-sm text-slate-500 mt-2">
            {description}
          </p>
        </div>

        <AlertTriangle
          className="text-red-400 shrink-0"
          size={21}
        />
      </div>

      <span className="inline-block mt-4 text-xs bg-red-950/30 text-red-400 px-3 py-1 rounded-full">
        {priority}
      </span>
    </div>
  );
}

export default Compliance;