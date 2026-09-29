import { API_URL } from "../api";
import { useEffect, useState } from "react";
import {
  FileText,
  Download,
  Printer,
  ShieldAlert,
  IndianRupee,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

function Reports() {
  const [riskData, setRiskData] = useState(null);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      const [riskResponse, vulnerabilityResponse] =
        await Promise.all([
          fetch(
            `${API_URL}/api/risk/enterprise/summary`
          ),
          fetch(
            `${API_URL}/api/vulnerabilities`
          ),
        ]);

      const risk = await riskResponse.json();
      const vuln = await vulnerabilityResponse.json();

      setRiskData(risk);

      setVulnerabilities(
        Array.isArray(vuln)
          ? vuln
          : vuln.vulnerabilities || []
      );
    } catch (error) {
      console.error("Report loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const money = (value) => {
    const number = Number(value || 0);

    if (number >= 10000000) {
      return `₹${(number / 10000000).toFixed(2)} Cr`;
    }

    if (number >= 100000) {
      return `₹${(number / 100000).toFixed(2)} L`;
    }

    return `₹${number.toLocaleString("en-IN")}`;
  };

  const exportJSON = () => {
    const report = {
      report_name: "CyVar AI Enterprise Cyber Risk Report",
      generated_at: new Date().toISOString(),
      enterprise_risk: riskData,
      vulnerabilities,
      note:
        "Prototype report. Enterprise, financial and control assumptions contain synthetic demo data.",
    };

    const blob = new Blob(
      [JSON.stringify(report, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "CyVar_AI_Risk_Report.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="text-slate-400">
        Generating enterprise risk report...
      </div>
    );
  }

  if (!riskData) {
    return (
      <div className="text-red-400">
        Unable to load report data. Make sure the backend is
        running.
      </div>
    );
  }

  const summary =
    riskData.enterprise_summary || {};

  const assets =
    riskData.assets || [];

  const topDrivers =
    riskData.top_risk_drivers || [];

  const criticalVulnerabilities =
    vulnerabilities.filter(
      (v) => Number(v.cvss_score || 0) >= 9
    );

  const kevVulnerabilities =
    vulnerabilities.filter(
      (v) => v.cisa_kev === true
    );

  const generatedDate =
    new Date().toLocaleString("en-IN");

  return (
    <div className="pb-10 print:bg-white print:text-black">

      {/* HEADER */}

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 mb-7">
        <div>
          <p className="text-sm text-cyan-400 font-medium">
            EXECUTIVE REPORTING
          </p>

          <h1 className="text-3xl font-bold mt-1">
            Cyber Risk Reports
          </h1>

          <p className="text-slate-400 mt-2">
            Executive-level financial cyber risk,
            vulnerability and asset exposure summary.
          </p>
        </div>

        <div className="flex gap-3 print:hidden">
          <button
            onClick={exportJSON}
            className="flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-cyan-500 px-4 py-3 rounded-lg text-sm"
          >
            <Download size={17} />

            Export Data
          </button>

          <button
            onClick={printReport}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-3 rounded-lg text-sm font-medium"
          >
            <Printer size={17} />

            Print / PDF
          </button>
        </div>
      </div>

      {/* REPORT HEADER */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-5">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/50 flex items-center justify-center">
              <FileText
                size={23}
                className="text-cyan-400"
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Enterprise Cyber Risk Assessment
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                CyVar AI Financial Risk Intelligence
              </p>
            </div>
          </div>

          <div className="md:text-right">
            <p className="text-xs text-slate-500">
              REPORT GENERATED
            </p>

            <p className="text-sm mt-1">
              {generatedDate}
            </p>
          </div>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY */}

      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          Executive Summary
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Financial exposure calculated from the current
          CyVar risk model.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <Metric
          title="Expected Annual Loss"
          value={money(
            summary.expected_annual_loss
          )}
          icon={IndianRupee}
        />

        <Metric
          title="95% Value at Risk"
          value={money(summary.var_95)}
          icon={Activity}
        />

        <Metric
          title="99% Value at Risk"
          value={money(summary.var_99)}
          icon={Target}
        />

        <Metric
          title="Annual Loss Probability"
          value={`${(
            Number(
              summary.probability_of_annual_loss || 0
            ) * 100
          ).toFixed(2)}%`}
          icon={ShieldAlert}
        />
      </div>

      {/* MODEL COVERAGE */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="font-semibold">
            Risk Model Coverage
          </h2>

          <div className="space-y-5 mt-6">
            <ReportRow
              label="Total Assets"
              value={summary.total_assets || 0}
            />

            <ReportRow
              label="Modeled Assets"
              value={summary.modeled_assets || 0}
            />

            <ReportRow
              label="Critical Assets"
              value={summary.critical_assets || 0}
            />

            <ReportRow
              label="Model Coverage"
              value={`${summary.coverage_percent || 0}%`}
            />

            <ReportRow
              label="Maximum Simulated Loss"
              value={money(
                summary.maximum_simulated_loss
              )}
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="font-semibold">
            Vulnerability Intelligence
          </h2>

          <div className="space-y-5 mt-6">
            <ReportRow
              label="Tracked Vulnerabilities"
              value={vulnerabilities.length}
            />

            <ReportRow
              label="Critical CVEs"
              value={
                criticalVulnerabilities.length
              }
            />

            <ReportRow
              label="Known Exploited"
              value={kevVulnerabilities.length}
            />

            <ReportRow
              label="Public Intelligence"
              value="NVD / EPSS / CISA KEV"
            />
          </div>
        </div>
      </div>

      {/* TOP RISK DRIVERS */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl mt-6 overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold">
            Top Financial Risk Drivers
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Assets ranked by modeled Expected Annual Loss.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/60">
              <tr className="text-xs text-slate-500">
                <th className="px-6 py-4">
                  RANK
                </th>

                <th className="px-6 py-4">
                  ASSET
                </th>

                <th className="px-6 py-4">
                  CVE
                </th>

                <th className="px-6 py-4">
                  EAL
                </th>

                <th className="px-6 py-4">
                  VAR 95
                </th>
              </tr>
            </thead>

            <tbody>
              {topDrivers.map(
                (asset, index) => (
                  <tr
                    key={asset.asset_code}
                    className="border-t border-slate-800"
                  >
                    <td className="px-6 py-5">
                      <span className="w-7 h-7 inline-flex items-center justify-center bg-slate-950 rounded-full text-xs">
                        {index + 1}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-medium">
                        {asset.name}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {asset.asset_code}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-cyan-400">
                      {asset.cve || "—"}
                    </td>

                    <td className="px-6 py-5 text-sm font-medium">
                      {money(
                        asset.expected_annual_loss
                      )}
                    </td>

                    <td className="px-6 py-5 text-sm">
                      {money(asset.var_95)}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASSET RISK REGISTER */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl mt-6 overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold">
            Asset Risk Register
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Financial exposure across all modeled assets.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/60">
              <tr className="text-xs text-slate-500">
                <th className="px-6 py-4">
                  ASSET
                </th>

                <th className="px-6 py-4">
                  CRITICALITY
                </th>

                <th className="px-6 py-4">
                  VULNERABILITY
                </th>

                <th className="px-6 py-4">
                  EAL
                </th>

                <th className="px-6 py-4">
                  RISK STATUS
                </th>
              </tr>
            </thead>

            <tbody>
              {assets.map((asset) => {
                const eal =
                  Number(
                    asset.expected_annual_loss || 0
                  );

                let status = "Moderate";

                if (eal >= 500000) {
                  status = "High";
                } else if (eal < 150000) {
                  status = "Low";
                }

                return (
                  <tr
                    key={asset.asset_code}
                    className="border-t border-slate-800"
                  >
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium">
                        {asset.name}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {asset.asset_code}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      {asset.criticality}/5
                    </td>

                    <td className="px-6 py-5 text-cyan-400 text-sm">
                      {asset.cve || "—"}
                    </td>

                    <td className="px-6 py-5 font-medium">
                      {money(eal)}
                    </td>

                    <td className="px-6 py-5">
                      <RiskBadge status={status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* FINDINGS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        <div className="bg-red-950/10 border border-red-950 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle
              className="text-red-400"
              size={21}
            />

            <h3 className="font-semibold">
              Priority Finding
            </h3>
          </div>

          <p className="text-sm text-slate-400 mt-4 leading-6">
            {topDrivers.length > 0
              ? `${topDrivers[0].name} (${topDrivers[0].asset_code}) is currently the highest modeled financial risk driver with an Expected Annual Loss of ${money(
                  topDrivers[0]
                    .expected_annual_loss
                )}.`
              : "No ranked risk driver is currently available."}
          </p>
        </div>

        <div className="bg-cyan-950/10 border border-cyan-950 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2
              className="text-cyan-400"
              size={21}
            />

            <h3 className="font-semibold">
              Recommended Action
            </h3>
          </div>

          <p className="text-sm text-slate-400 mt-4 leading-6">
            Review the highest financial risk
            drivers, validate vulnerability exposure,
            test alternative controls using the
            What-If Simulator and compare investments
            using the Investment Optimizer.
          </p>
        </div>
      </div>

      {/* METHODOLOGY */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">
        <h2 className="font-semibold">
          Risk Quantification Methodology
        </h2>

        <p className="text-sm text-slate-400 leading-7 mt-4">
          CyVar combines vulnerability intelligence,
          asset exposure, security-control
          effectiveness and business impact assumptions
          to estimate scenario frequency. A Monte Carlo
          model then simulates 10,000 annual loss
          outcomes to estimate Expected Annual Loss,
          VaR95 and VaR99.
        </p>

        <div className="flex flex-wrap gap-2 mt-5">
          {[
            "NVD",
            "FIRST EPSS",
            "CISA KEV",
            "Monte Carlo",
            "Financial Risk",
          ].map((item) => (
            <span
              key={item}
              className="text-xs bg-slate-950 border border-slate-700 rounded-full px-3 py-1"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* DISCLAIMER */}

      <div className="mt-6 border border-amber-900/40 bg-amber-950/20 rounded-xl p-5">
        <p className="text-sm font-medium text-amber-300">
          Prototype Risk Report
        </p>

        <p className="text-xs text-slate-500 leading-5 mt-2">
          Vulnerability intelligence originates from
          public sources stored by the CyVar prototype.
          Asset mappings, financial assumptions,
          scenario-frequency coefficients and control
          assumptions are synthetic demo inputs.
          Financial values are model outputs and should
          not be interpreted as observed organizational
          losses or guaranteed future outcomes.
        </p>
      </div>
    </div>
  );
}


// --------------------------------------------
// METRIC
// --------------------------------------------

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

      <p className="text-2xl font-bold mt-4">
        {value}
      </p>
    </div>
  );
}


// --------------------------------------------
// REPORT ROW
// --------------------------------------------

function ReportRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-sm font-medium">
        {value}
      </span>
    </div>
  );
}


// --------------------------------------------
// RISK BADGE
// --------------------------------------------

function RiskBadge({ status }) {
  const styles = {
    High:
      "bg-red-950/40 text-red-400 border-red-900/40",

    Moderate:
      "bg-amber-950/40 text-amber-400 border-amber-900/40",

    Low:
      "bg-green-950/40 text-green-400 border-green-900/40",
  };

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full border ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default Reports;