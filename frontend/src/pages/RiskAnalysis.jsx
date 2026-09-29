import { API_URL } from "../api";
import { useEffect, useState } from "react";
import {
  IndianRupee,
  Activity,
  ShieldAlert,
  TrendingUp,
  BrainCircuit,
  Cpu,
} from "lucide-react";



function RiskAnalysis() {
  const [data, setData] = useState(null);
  const [mlData, setMlData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadRiskData() {
      try {
        const [riskResponse, mlResponse] = await Promise.all([
          fetch(`${API_URL}/api/risk/enterprise/summary`),
          fetch(`${API_URL}/api/ml/risk-predictions`),
        ]);

        if (!riskResponse.ok || !mlResponse.ok) {
          throw new Error("Failed to fetch risk data");
        }

        const riskResult = await riskResponse.json();
        const mlResult = await mlResponse.json();

        setData(riskResult);
        setMlData(mlResult);
      } catch (error) {
        console.error("Risk Analysis Error:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadRiskData();
  }, []);

  const money = (value) => {
    const amount = Number(value || 0);

    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }

    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <p className="text-slate-400">
        Running financial and ML risk analysis...
      </p>
    );
  }

  if (error || !data) {
    return (
      <p className="text-red-400">
        Unable to load risk analysis.
      </p>
    );
  }

  const summary = data.enterprise_summary;
  const assets = data.assets || [];
  const mlPredictions = mlData?.predictions || [];

  const getMLPrediction = (assetCode) =>
    mlPredictions.find(
      (prediction) => prediction.asset_code === assetCode
    );

  return (
    <div>
      {/* HEADER */}
      <div className="mb-7">
        <p className="text-sm text-cyan-400">
          FINANCIAL + MACHINE LEARNING RISK ANALYSIS
        </p>

        <h1 className="text-3xl font-bold mt-1">
          Risk Analysis
        </h1>

        <p className="text-slate-400 mt-2">
          Combine XGBoost risk classification with Monte Carlo
          financial risk quantification.
        </p>
      </div>

      {/* FINANCIAL METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <Metric
          title="Expected Annual Loss"
          value={money(summary.expected_annual_loss)}
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
          icon={ShieldAlert}
        />

        <Metric
          title="Annual Loss Probability"
          value={`${(
            summary.probability_of_annual_loss * 100
          ).toFixed(2)}%`}
          icon={TrendingUp}
        />
      </div>

      {/* FINANCIAL RISK */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold">
                Asset Financial Risk
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Ranked by Expected Annual Loss
              </p>
            </div>

            <span className="text-xs text-cyan-300 bg-cyan-950 px-3 py-1 rounded-full">
              10,000 SIMULATIONS
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {assets.map((asset, index) => {
              const maxEAL =
                assets[0]?.expected_annual_loss || 1;

              const width = Math.min(
                (asset.expected_annual_loss / maxEAL) * 100,
                100
              );

              const prediction = getMLPrediction(
                asset.asset_code
              );

              return (
                <div key={asset.asset_code}>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600">
                        #{index + 1}
                      </span>

                      <span className="text-sm">
                        {asset.name}
                      </span>

                      {prediction && (
                        <RiskBadge
                          risk={prediction.ml_risk_class}
                        />
                      )}
                    </div>

                    <span className="text-sm text-red-400">
                      {money(asset.expected_annual_loss)}
                    </span>
                  </div>

                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-cyan-500 h-2 rounded-full"
                      style={{ width: `${width}%` }}
                    />
                  </div>

                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-slate-600">
                      {asset.cve}
                    </span>

                    <span className="text-xs text-slate-600">
                      VaR95 {money(asset.var_95)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MODEL INFO */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold">
            Model Information
          </h2>

          <Info
            label="Assets Modeled"
            value={`${summary.modeled_assets}/${summary.total_assets}`}
          />

          <Info
            label="Coverage"
            value={`${summary.coverage_percent}%`}
          />

          <Info
            label="ML Model"
            value="XGBoost"
          />

          <Info
            label="ML Test Accuracy"
            value="86.65%"
          />

          <Info
            label="Financial Model"
            value="Monte Carlo"
          />

          <Info
            label="Simulation Years"
            value="10,000"
          />

          <div className="mt-6 p-4 bg-amber-950/20 border border-amber-900/40 rounded-lg">
            <p className="text-xs text-amber-300">
              Prototype Model
            </p>

            <p className="text-xs text-slate-500 mt-2 leading-5">
              XGBoost is trained on synthetic cyber-risk
              scenarios. Financial assumptions and scenario
              frequencies are also prototype inputs. Public
              vulnerability intelligence is used for CVE,
              CVSS, EPSS and KEV information.
            </p>
          </div>
        </div>
      </div>

      {/* XGBOOST SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2">
              <BrainCircuit
                size={21}
                className="text-purple-400"
              />

              <h2 className="text-lg font-semibold">
                XGBoost ML Risk Predictions
              </h2>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Asset-level cyber risk classification using
              vulnerability and enterprise security features.
            </p>
          </div>

          <span className="text-xs text-purple-300 bg-purple-950/50 border border-purple-900 px-3 py-1 rounded-full">
            ML MODEL ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mlPredictions.map((prediction) => (
            <div
              key={prediction.asset_code}
              className="bg-slate-950/70 border border-slate-800 rounded-xl p-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-cyan-400">
                    {prediction.asset_code}
                  </p>

                  <h3 className="font-semibold mt-1">
                    {prediction.asset_name}
                  </h3>
                </div>

                <Cpu
                  size={19}
                  className="text-purple-400"
                />
              </div>

              <div className="flex items-center justify-between mt-5">
                <span className="text-sm text-slate-500">
                  ML Risk
                </span>

                <RiskBadge
                  risk={prediction.ml_risk_class}
                />
              </div>

              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-slate-500">
                  Model Confidence
                </span>

                <span className="text-sm font-semibold">
                  {prediction.ml_confidence}%
                </span>
              </div>

              <div className="border-t border-slate-800 mt-4 pt-4 grid grid-cols-3 gap-3">
                <SmallValue
                  label="CVSS"
                  value={prediction.cvss_score}
                />

                <SmallValue
                  label="EPSS"
                  value={`${(
                    Number(prediction.epss_score || 0) * 100
                  ).toFixed(1)}%`}
                />

                <SmallValue
                  label="KEV"
                  value={
                    prediction.cisa_kev ? "YES" : "NO"
                  }
                />
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-500">
                    Prediction confidence
                  </span>

                  <span className="text-purple-300">
                    {prediction.ml_confidence}%
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{
                      width: `${prediction.ml_confidence}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-600 mt-5">
          Prototype ML predictions are generated by an XGBoost
          classifier trained on 10,000 synthetic cyber-risk
          scenarios. Confidence represents model classification
          confidence, not the probability that the organization
          will be breached.
        </p>
      </div>
    </div>
  );
}

function Metric({ title, value, icon: Icon }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex justify-between">
        <p className="text-sm text-slate-500">
          {title}
        </p>

        <Icon
          size={20}
          className="text-cyan-400"
        />
      </div>

      <p className="text-3xl font-bold mt-4">
        {value}
      </p>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between border-b border-slate-800 py-4">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-sm">
        {value}
      </span>
    </div>
  );
}

function SmallValue({ label, value }) {
  return (
    <div>
      <p className="text-[11px] text-slate-600">
        {label}
      </p>

      <p className="text-sm font-semibold mt-1">
        {value}
      </p>
    </div>
  );
}

function RiskBadge({ risk }) {
  const styles = {
    Low: "text-green-400 bg-green-950/40 border-green-900",
    Medium:
      "text-yellow-300 bg-yellow-950/40 border-yellow-900",
    High:
      "text-orange-400 bg-orange-950/40 border-orange-900",
    Critical:
      "text-red-400 bg-red-950/40 border-red-900",
  };

  return (
    <span
      className={`text-[11px] px-2.5 py-1 rounded-full border font-medium ${
        styles[risk] ||
        "text-slate-300 bg-slate-800 border-slate-700"
      }`}
    >
      {risk || "Unknown"}
    </span>
  );
}

export default RiskAnalysis;