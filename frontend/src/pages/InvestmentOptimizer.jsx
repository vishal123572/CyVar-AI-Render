import { API_URL } from "../api";
import { useState } from "react";

import {
  IndianRupee,
  ShieldCheck,
  TrendingDown,
  Wallet,
  BrainCircuit,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";



function InvestmentOptimizer() {
  const [budget, setBudget] = useState(1000000);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const money = (value) => {
    if (value === null || value === undefined) {
      return "—";
    }

    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    }

    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    }

    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  const optimize = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_URL}/api/optimize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            budget: Number(budget),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Investment optimization failed."
        );
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setResult(null);
        return;
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to connect to the CyVar optimization engine."
      );
    } finally {
      setLoading(false);
    }
  };

  const curveData =
    result?.risk_reduction_curve?.map((item) => ({
      ...item,

      budget_lakh:
        Number(item.budget || 0) / 100000,

      reduction_lakh:
        Number(item.risk_reduction || 0) / 100000,

      remaining_eal_lakh:
        Number(item.remaining_eal || 0) / 100000,
    })) || [];

  return (
    <div>
      {/* HEADER */}

      <div className="mb-7">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-cyan-400">
              SECURITY INVESTMENT OPTIMIZATION
            </p>

            <h1 className="text-3xl font-bold mt-1">
              Investment Optimizer
            </h1>

            <p className="text-slate-400 mt-2">
              Allocate a limited cybersecurity budget
              to maximize modeled annual financial risk
              reduction.
            </p>
          </div>

          <div className="flex gap-2">
            <span className="text-xs px-3 py-1 rounded-full border border-purple-900 bg-purple-950/30 text-purple-300">
              PuLP OPTIMIZER
            </span>

            <span className="text-xs px-3 py-1 rounded-full border border-cyan-900 bg-cyan-950/30 text-cyan-300">
              BINARY OPTIMIZATION
            </span>
          </div>
        </div>
      </div>

      {/* BUDGET */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-end gap-5">
          <div className="flex-1">
            <label className="text-xs text-slate-500">
              Available Security Budget (₹)
            </label>

            <input
              type="number"
              value={budget}
              onChange={(e) =>
                setBudget(e.target.value)
              }
              className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={optimize}
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-semibold px-7 py-3 rounded-lg"
          >
            {loading
              ? "Optimizing..."
              : "Optimize Budget"}
          </button>
        </div>

        <div className="flex gap-3 mt-4">
          {[
            500000,
            1000000,
            1500000,
            2000000,
          ].map((amount) => (
            <button
              key={amount}
              onClick={() => setBudget(amount)}
              className="text-xs bg-slate-950 border border-slate-800 hover:border-cyan-800 rounded-lg px-4 py-2"
            >
              {money(amount)}
            </button>
          ))}
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mt-5 bg-red-950/30 border border-red-900 rounded-xl p-4">
          <p className="text-sm text-red-300">
            {error}
          </p>
        </div>
      )}

      {result && !result.error && (
        <>
          {/* SOLVER STATUS */}

          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 mt-6">
            <div className="flex items-center gap-3">
              <BrainCircuit
                size={20}
                className="text-purple-400"
              />

              <div>
                <p className="text-sm font-medium">
                  PuLP Optimization Engine
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {result.optimization_method}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs px-3 py-1 rounded-full bg-green-950/40 border border-green-800 text-green-300">
                {result.solver_status}
              </span>

              <p className="text-xs text-slate-600 mt-2">
                Optimal budget allocation
              </p>
            </div>
          </div>

          {/* RESULT CARDS */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
            <Metric
              title="Recommended Spend"
              value={money(
                result.total_investment
              )}
              icon={Wallet}
            />

            <Metric
              title="Modeled Risk Reduction"
              value={money(
                result.modeled_annual_risk_reduction
              )}
              icon={TrendingDown}
            />

            <Metric
              title="Remaining EAL"
              value={money(
                result.remaining_enterprise_eal
              )}
              icon={IndianRupee}
            />

            <Metric
              title="ROSI"
              value={`${result.rosi_percent}%`}
              icon={ShieldCheck}
            />
          </div>

          {/* =======================================
              RISK REDUCTION CURVE
          ======================================== */}

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">
                  Budget vs Risk Reduction Curve
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Shows how optimized security
                  investment changes modeled annual
                  financial risk.
                </p>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-purple-950/30 border border-purple-900 text-purple-300">
                PuLP OPTIMAL FRONTIER
              </span>
            </div>

            {curveData.length > 0 ? (
              <div className="h-80 mt-7">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <LineChart data={curveData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1e293b"
                    />

                    <XAxis
                      dataKey="budget_lakh"
                      stroke="#64748b"
                      fontSize={11}
                      tickFormatter={(value) =>
                        `₹${value}L`
                      }
                    />

                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickFormatter={(value) =>
                        `₹${value}L`
                      }
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#020617",
                        border:
                          "1px solid #334155",
                        borderRadius: "8px",
                      }}
                      labelFormatter={(value) =>
                        `Budget: ₹${Number(
                          value
                        ).toFixed(2)} L`
                      }
                      formatter={(
                        value,
                        name
                      ) => [
                        `₹${Number(
                          value
                        ).toFixed(2)} L`,

                        name ===
                        "reduction_lakh"
                          ? "Risk Reduction"
                          : "Remaining EAL",
                      ]}
                    />

                    <Line
                      type="monotone"
                      dataKey="reduction_lakh"
                      stroke="#22d3ee"
                      strokeWidth={3}
                      dot
                    />

                    <Line
                      type="monotone"
                      dataKey="remaining_eal_lakh"
                      stroke="#a855f7"
                      strokeWidth={3}
                      dot
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-slate-500 mt-6">
                Risk reduction curve unavailable.
              </p>
            )}

            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400" />

                <span className="text-xs text-slate-500">
                  Modeled Risk Reduction
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500" />

                <span className="text-xs text-slate-500">
                  Remaining Enterprise EAL
                </span>
              </div>
            </div>
          </div>

          {/* RECOMMENDATIONS + SUMMARY */}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-6">
            {/* RECOMMENDATIONS */}

            <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold">
                Recommended Security Investments
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Optimal control combination selected
                by PuLP within the available budget.
              </p>

              <div className="mt-5">
                {result.recommended_investments.map(
                  (item, index) => (
                    <div
                      key={item.name}
                      className="flex justify-between items-center border-b border-slate-800 py-5"
                    >
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center text-xs">
                          {index + 1}
                        </div>

                        <div>
                          <p className="font-medium">
                            {item.name}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            {item.asset}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm">
                          {money(item.cost)}
                        </p>

                        <p className="text-xs text-green-400 mt-1">
                          ↓{" "}
                          {money(
                            item.annual_risk_reduction
                          )}{" "}
                          modeled annual risk
                        </p>

                        <p className="text-xs text-slate-600 mt-1">
                          Benefit/Cost:{" "}
                          {
                            item.benefit_cost_ratio
                          }
                        </p>
                      </div>
                    </div>
                  )
                )}

                {result.recommended_investments
                  .length === 0 && (
                  <p className="text-slate-500 py-8">
                    Budget is below the minimum
                    available investment.
                  </p>
                )}
              </div>
            </div>

            {/* SUMMARY */}

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="font-semibold text-lg">
                Optimization Summary
              </h2>

              <Info
                label="Optimizer"
                value={result.optimizer}
              />

              <Info
                label="Solver Status"
                value={result.solver_status}
              />

              <Info
                label="Available Budget"
                value={money(result.budget)}
              />

              <Info
                label="Allocated"
                value={money(
                  result.total_investment
                )}
              />

              <Info
                label="Unused"
                value={money(
                  result.unused_budget
                )}
              />

              <Info
                label="Current EAL"
                value={money(
                  result.current_enterprise_eal
                )}
              />

              <Info
                label="Remaining EAL"
                value={money(
                  result.remaining_enterprise_eal
                )}
              />

              <div className="mt-5 p-4 bg-cyan-950/20 border border-cyan-900/40 rounded-lg">
                <p className="text-xs text-cyan-300">
                  ROSI
                </p>

                <p className="text-3xl font-bold mt-2">
                  {result.rosi_percent}%
                </p>

                <p className="text-xs text-slate-500 mt-2">
                  Modeled Return on Security
                  Investment
                </p>
              </div>
            </div>
          </div>

          {/* OBJECTIVE */}

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mt-6">
            <p className="text-xs text-purple-400">
              OPTIMIZATION OBJECTIVE
            </p>

            <p className="text-sm text-slate-300 mt-2">
              {result.objective}
            </p>

            <p className="text-xs text-slate-600 mt-4">
              {result.assumption_note}
            </p>
          </div>
        </>
      )}
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

      <p className="text-2xl font-bold mt-4">
        {value}
      </p>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-4 border-b border-slate-800">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-sm text-right">
        {value}
      </span>
    </div>
  );
}

export default InvestmentOptimizer;