import { API_URL } from "../api";
import { useEffect, useState } from "react";
import {
  FlaskConical,
  TrendingDown,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";

function Simulator() {
  const [assets, setAssets] = useState([]);
  const [assetCode, setAssetCode] = useState("PAY-API-001");
  const [effectiveness, setEffectiveness] = useState(90);

  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  // ------------------------------------------------
  // LOAD ASSETS
  // ------------------------------------------------

  useEffect(() => {
    fetch(`${API_URL}/api/assets`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load assets");
        }

        return response.json();
      })
      .then((data) => {
        setAssets(data.assets || []);

        if (data.assets && data.assets.length > 0) {
          setAssetCode(data.assets[0].asset_code);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load assets from backend.");
      });
  }, []);

  // ------------------------------------------------
  // MONEY FORMAT
  // ------------------------------------------------

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

  // ------------------------------------------------
  // RUN SIMULATION
  // ------------------------------------------------

  const runSimulation = async () => {
    setRunning(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/simulate`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            asset_code: assetCode,
            new_control_effectiveness: effectiveness / 100,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Simulation request failed");
      }

      if (data.error) {
        setError(data.error);
        return;
      }

      setResult(data);
    } catch (err) {
      console.error(err);

      setError(
        "Simulation failed. Make sure the FastAPI backend is running."
      );
    } finally {
      setRunning(false);
    }
  };

  // ------------------------------------------------
  // UI
  // ------------------------------------------------

  return (
    <div>
      {/* HEADER */}

      <div className="mb-7">
        <p className="text-sm text-cyan-400 font-medium">
          SCENARIO SIMULATION
        </p>

        <h1 className="text-3xl font-bold mt-1">
          What-If Simulator
        </h1>

        <p className="text-slate-400 mt-2">
          Test how improvements in security controls could
          change modeled financial cyber risk.
        </p>
      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* LEFT SIDE */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-950/50 p-2 rounded-lg">
              <FlaskConical
                size={22}
                className="text-cyan-400"
              />
            </div>

            <div>
              <h2 className="font-semibold text-lg">
                Configure Scenario
              </h2>

              <p className="text-xs text-slate-500">
                Change security assumptions
              </p>
            </div>
          </div>

          {/* ASSET */}

          <label className="text-xs text-slate-500 block mt-7 mb-2">
            Select Asset
          </label>

          <select
            value={assetCode}
            onChange={(e) => {
              setAssetCode(e.target.value);
              setResult(null);
            }}
            className="
              w-full
              bg-slate-950
              border
              border-slate-700
              rounded-lg
              px-4
              py-3
              text-slate-200
              outline-none
              focus:border-cyan-500
            "
          >
            {assets.map((asset) => (
              <option
                key={asset.asset_code}
                value={asset.asset_code}
              >
                {asset.name} ({asset.asset_code})
              </option>
            ))}
          </select>

          {/* EFFECTIVENESS */}

          <div className="mt-7">
            <label className="text-xs text-slate-500">
              Target Control Effectiveness
            </label>

            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-slate-300">
                Security Control Strength
              </span>

              <span className="text-xl text-cyan-400 font-bold">
                {effectiveness}%
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="95"
              step="5"
              value={effectiveness}
              onChange={(e) => {
                setEffectiveness(
                  Number(e.target.value)
                );

                setResult(null);
              }}
              className="w-full mt-5 accent-cyan-500"
            />

            <div className="flex justify-between mt-2">
              <span className="text-xs text-slate-600">
                10%
              </span>

              <span className="text-xs text-slate-600">
                95%
              </span>
            </div>
          </div>

          {/* BUTTON */}

          <button
            onClick={runSimulation}
            disabled={running || assets.length === 0}
            className="
              w-full
              mt-8
              bg-cyan-500
              hover:bg-cyan-400
              disabled:bg-slate-700
              disabled:text-slate-500
              text-slate-950
              font-semibold
              py-3
              rounded-lg
              transition
            "
          >
            {running
              ? "Running 10,000 Simulations..."
              : "Run What-If Simulation"}
          </button>

          <div className="mt-5 bg-slate-950 border border-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-500 leading-5">
              The simulator temporarily changes modeled
              control effectiveness. Your stored asset and
              control data are not modified.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          {error && (
            <div className="bg-red-950/30 border border-red-900 rounded-lg p-4">
              <p className="text-sm text-red-400">
                {error}
              </p>
            </div>
          )}

          {!result && !error && (
            <div className="min-h-[420px] flex items-center justify-center text-center">
              <div>
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <FlaskConical
                    size={28}
                    className="text-slate-600"
                  />
                </div>

                <h3 className="text-lg font-semibold mt-5">
                  Ready to simulate
                </h3>

                <p className="text-sm text-slate-500 mt-2 max-w-sm">
                  Select an asset, choose the target
                  security-control effectiveness and run
                  the financial risk simulation.
                </p>
              </div>
            </div>
          )}

          {result && (
            <>
              {/* RESULT HEADER */}

              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-cyan-400">
                    SIMULATION RESULT
                  </p>

                  <h2 className="text-xl font-semibold mt-1">
                    {result.asset.name}
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    {result.asset.asset_code}
                  </p>
                </div>

                <div className="bg-green-950/40 border border-green-900/60 rounded-full px-4 py-2">
                  <span className="text-sm text-green-400">
                    ↓{" "}
                    {
                      result.risk_reduction
                        .reduction_percent
                    }
                    %
                  </span>
                </div>
              </div>

              {/* CARDS */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-7">
                <ResultCard
                  title="Current EAL"
                  value={money(
                    result.before
                      .expected_annual_loss
                  )}
                  subtitle="Before improvement"
                  icon={IndianRupee}
                />

                <ResultCard
                  title="Simulated EAL"
                  value={money(
                    result.after
                      .expected_annual_loss
                  )}
                  subtitle="After improvement"
                  icon={TrendingDown}
                />

                <ResultCard
                  title="Annual Risk Reduction"
                  value={money(
                    result.risk_reduction
                      .annual_loss_reduction
                  )}
                  subtitle="Modeled financial benefit"
                  icon={ShieldCheck}
                />

                <ResultCard
                  title="New VaR 95%"
                  value={money(
                    result.after.var_95
                  )}
                  subtitle="95th percentile annual loss"
                  icon={TrendingDown}
                />
              </div>

              {/* COMPARISON */}

              <div className="mt-6 bg-slate-950 border border-slate-800 rounded-xl p-5">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      Before vs After
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Expected Annual Loss
                    </p>
                  </div>

                  <span className="text-sm text-cyan-400">
                    {effectiveness}% target control
                  </span>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-500">
                      Current
                    </span>

                    <span>
                      {money(
                        result.before
                          .expected_annual_loss
                      )}
                    </span>
                  </div>

                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{
                        width: "100%",
                      }}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-500">
                      After Improvement
                    </span>

                    <span className="text-green-400">
                      {money(
                        result.after
                          .expected_annual_loss
                      )}
                    </span>
                  </div>

                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (result.after
                            .expected_annual_loss /
                            result.before
                              .expected_annual_loss) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* EXPLANATION */}

              <div className="mt-5 bg-cyan-950/20 border border-cyan-900/40 rounded-lg p-5">
                <p className="text-sm font-semibold text-cyan-300">
                  Scenario Interpretation
                </p>

                <p className="text-sm text-slate-400 mt-3 leading-6">
                  If modeled security-control effectiveness
                  for{" "}
                  <span className="text-white">
                    {result.asset.name}
                  </span>{" "}
                  reaches{" "}
                  <span className="text-cyan-400">
                    {(
                      result.simulation
                        .control_effectiveness * 100
                    ).toFixed(0)}
                    %
                  </span>
                  , Expected Annual Loss changes from{" "}
                  <span className="text-white">
                    {money(
                      result.before
                        .expected_annual_loss
                    )}
                  </span>{" "}
                  to{" "}
                  <span className="text-green-400">
                    {money(
                      result.after
                        .expected_annual_loss
                    )}
                  </span>
                  .
                </p>
              </div>

              <p className="text-xs text-slate-600 mt-4">
                10,000 Monte Carlo simulated years.
                Financial assumptions and scenario
                frequencies are synthetic prototype inputs.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


// ==================================================
// RESULT CARD
// ==================================================

function ResultCard({
  title,
  value,
  subtitle,
  icon: Icon,
}) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-slate-500">
            {title}
          </p>

          <p className="text-2xl font-bold mt-3">
            {value}
          </p>

          <p className="text-xs text-slate-600 mt-2">
            {subtitle}
          </p>
        </div>

        <div className="bg-cyan-950/40 p-2 rounded-lg">
          <Icon
            size={19}
            className="text-cyan-400"
          />
        </div>
      </div>
    </div>
  );
}

export default Simulator;