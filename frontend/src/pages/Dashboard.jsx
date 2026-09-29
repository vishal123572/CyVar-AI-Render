import { API_URL } from "../api";
import { useEffect, useState } from "react";
import {
  IndianRupee,
  TrendingDown,
  ShieldAlert,
  Server,
  Activity,
  BrainCircuit,
  Clock,
  RefreshCw,
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


const REFRESH_SECONDS = 60;

function Dashboard() {
  const [data, setData] = useState(null);
  const [monitoring, setMonitoring] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [countdown, setCountdown] =
    useState(REFRESH_SECONDS);

  // -----------------------------------------
  // Fetch enterprise financial risk
  // -----------------------------------------

  const fetchEnterpriseRisk = async () => {
    const response = await fetch(
      `${API_URL}/api/risk/enterprise/summary`
    );

    if (!response.ok) {
      throw new Error(
        "Unable to fetch enterprise risk"
      );
    }

    const result = await response.json();
    setData(result);
  };

  // -----------------------------------------
  // Get monitoring history
  // -----------------------------------------

  const fetchMonitoringStatus = async () => {
    const response = await fetch(
      `${API_URL}/api/monitoring/status`
    );

    if (!response.ok) {
      throw new Error(
        "Unable to fetch monitoring status"
      );
    }

    const result = await response.json();
    setMonitoring(result);
  };

  // -----------------------------------------
  // Run new monitoring cycle
  // -----------------------------------------

  const refreshMonitoring = async () => {
    try {
      setRefreshing(true);

      const response = await fetch(
        `${API_URL}/api/monitoring/refresh`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Monitoring refresh failed"
        );
      }

      // Get updated monitoring history
      await fetchMonitoringStatus();

      // Also refresh enterprise dashboard
      await fetchEnterpriseRisk();

      setCountdown(REFRESH_SECONDS);
      setError(null);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to refresh continuous monitoring."
      );
    } finally {
      setRefreshing(false);
    }
  };

  // -----------------------------------------
  // Initial load
  // -----------------------------------------

  useEffect(() => {
    const initialLoad = async () => {
      try {
        setLoading(true);

        await Promise.all([
          fetchEnterpriseRisk(),
          fetchMonitoringStatus(),
        ]);

        setError(null);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to connect to CyVar risk engine."
        );
      } finally {
        setLoading(false);
      }
    };

    initialLoad();
  }, []);

  // -----------------------------------------
  // Automatic monitoring every 60 seconds
  // -----------------------------------------

  useEffect(() => {
    const interval = setInterval(() => {
      refreshMonitoring();
    }, REFRESH_SECONDS * 1000);

    return () => clearInterval(interval);
  }, []);

  // -----------------------------------------
  // Countdown
  // -----------------------------------------

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((previous) => {
        if (previous <= 1) {
          return REFRESH_SECONDS;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // -----------------------------------------
  // Currency formatting
  // -----------------------------------------

  const formatCurrency = (value) => {
    if (
      value === null ||
      value === undefined
    ) {
      return "—";
    }

    if (value >= 10000000) {
      return `₹${(
        value / 10000000
      ).toFixed(2)} Cr`;
    }

    if (value >= 100000) {
      return `₹${(
        value / 100000
      ).toFixed(2)} L`;
    }

    return `₹${Number(
      value
    ).toLocaleString("en-IN")}`;
  };

  // -----------------------------------------
  // Loading
  // -----------------------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-cyan-400 rounded-full animate-spin mx-auto" />

          <p className="text-slate-400 mt-4">
            Loading CyVar continuous risk engine...
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------------------
  // Error
  // -----------------------------------------

  if (error && !data) {
    return (
      <div className="bg-red-950/30 border border-red-900 rounded-xl p-6">
        <h2 className="text-red-400 font-semibold">
          Risk Engine Unavailable
        </h2>

        <p className="text-slate-400 mt-2">
          {error}
        </p>
      </div>
    );
  }

  const summary =
    data?.enterprise_summary || {};

  const riskDrivers =
    data?.top_risk_drivers || [];

  const latest =
    monitoring?.latest || {};

  const history =
    monitoring?.history || [];

  // Convert risk history for chart
  const chartData = history.map(
    (item, index) => ({
      snapshot: index + 1,

      time: new Date(
        item.timestamp
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),

      eal:
        Number(
          item.expected_annual_loss || 0
        ) / 100000,

      var95:
        Number(item.var_95 || 0) /
        100000,
    })
  );

  const lastUpdated =
    latest.timestamp
      ? new Date(
          latest.timestamp
        ).toLocaleTimeString()
      : "Waiting...";

  return (
    <div>

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="mb-8">

        <div className="flex items-center gap-3">

          <p className="text-sm text-cyan-400">
            EXECUTIVE RISK OVERVIEW
          </p>

          <span className="flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-green-950/40 border border-green-800 text-green-300">

            <span className="relative flex h-2 w-2">

              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />

              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />

            </span>

            CONTINUOUS MONITORING ACTIVE

          </span>

        </div>

        <h1 className="text-3xl font-bold mt-2">
          Cyber Financial Command Center
        </h1>

        <p className="text-slate-400 mt-2">
          Enterprise cyber risk translated into
          financial exposure with continuous
          ML-assisted risk monitoring.
        </p>

        <div className="flex gap-3 mt-4">

          <span className="text-xs px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-900 text-cyan-300">
            {summary.modeled_assets}/
            {summary.total_assets} Assets Modeled
          </span>

          <span className="text-xs px-3 py-1 rounded-full bg-green-950/40 border border-green-900 text-green-300">
            {summary.coverage_percent}% Coverage
          </span>

          <span className="text-xs px-3 py-1 rounded-full bg-purple-950/40 border border-purple-900 text-purple-300">
            XGBoost Active
          </span>

        </div>

      </div>

      {/* =====================================
          MAIN FINANCIAL METRICS
      ====================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <MetricCard
          title="Expected Annual Loss"
          value={formatCurrency(
            summary.expected_annual_loss
          )}
          subtitle="Portfolio Monte Carlo EAL"
          icon={IndianRupee}
        />

        <MetricCard
          title="95% Value at Risk"
          value={formatCurrency(
            summary.var_95
          )}
          subtitle="95th percentile annual loss"
          icon={TrendingDown}
        />

        <MetricCard
          title="99% Value at Risk"
          value={formatCurrency(
            summary.var_99
          )}
          subtitle="Extreme annual loss threshold"
          icon={ShieldAlert}
        />

        <MetricCard
          title="Critical Assets"
          value={summary.critical_assets}
          subtitle={`${summary.total_assets} enterprise assets`}
          icon={Server}
        />

      </div>

      {/* =====================================
          CONTINUOUS MONITORING
      ====================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">

        <div className="flex justify-between items-start">

          <div>

            <div className="flex items-center gap-2">

              <Activity
                size={20}
                className="text-green-400"
              />

              <h2 className="font-semibold text-lg">
                Continuous Risk Monitoring
              </h2>

            </div>

            <p className="text-sm text-slate-500 mt-1">
              Near-real-time prototype risk
              recalculation and trend monitoring.
            </p>

          </div>

          <button
            onClick={refreshMonitoring}
            disabled={refreshing}
            className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 disabled:opacity-50"
          >

            <RefreshCw
              size={14}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh Now"}

          </button>

        </div>

        {/* MONITORING STATS */}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">

          <MonitorBox
            label="Monitoring Status"
            value="ACTIVE"
            green
          />

          <MonitorBox
            label="Assets Monitored"
            value={
              latest.assets_monitored ?? 0
            }
          />

          <MonitorBox
            label="Critical ML Risks"
            value={
              latest.critical_ml_assets ?? 0
            }
          />

          <MonitorBox
            label="Snapshots"
            value={
              monitoring?.total_snapshots ??
              0
            }
          />

          <MonitorBox
            label="Next Refresh"
            value={`${countdown}s`}
          />

        </div>

        {/* LAST UPDATED */}

        <div className="flex items-center gap-2 mt-5 text-xs text-slate-500">

          <Clock size={14} />

          Last risk update:

          <span className="text-slate-300">
            {lastUpdated}
          </span>

          <span className="mx-2">
            •
          </span>

          Refresh interval:

          <span className="text-slate-300">
            60 seconds
          </span>

        </div>

        {/* RISK TREND CHART */}

        <div className="mt-7">

          <div className="flex justify-between items-center mb-4">

            <div>

              <h3 className="font-medium">
                Financial Risk Trend
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                EAL and VaR95 across monitoring
                snapshots
              </p>

            </div>

            <BrainCircuit
              size={20}
              className="text-purple-400"
            />

          </div>

          {chartData.length > 1 ? (

            <div className="h-72">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart data={chartData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                  />

                  <XAxis
                    dataKey="time"
                    stroke="#64748b"
                    fontSize={11}
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
                    formatter={(
                      value,
                      name
                    ) => [
                      `₹${Number(
                        value
                      ).toFixed(2)} L`,
                      name === "eal"
                        ? "EAL"
                        : "VaR95",
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="eal"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    dot
                  />

                  <Line
                    type="monotone"
                    dataKey="var95"
                    stroke="#a855f7"
                    strokeWidth={3}
                    dot
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          ) : (

            <div className="h-40 flex items-center justify-center border border-dashed border-slate-800 rounded-xl">

              <div className="text-center">

                <Activity
                  size={26}
                  className="text-cyan-400 mx-auto"
                />

                <p className="text-sm text-slate-400 mt-3">
                  Collecting risk trend data...
                </p>

                <p className="text-xs text-slate-600 mt-1">
                  The graph appears after at
                  least two monitoring snapshots.
                </p>

              </div>

            </div>

          )}

        </div>

        <p className="text-xs text-slate-600 mt-4">
          Prototype monitoring refreshes the
          available CyVar risk inputs every 60
          seconds. This demonstrates near-real-time
          risk recalculation; it is not live
          SIEM/EDR event streaming.
        </p>

      </div>

      {/* =====================================
          ENTERPRISE ANALYSIS
      ====================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-6">

        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">

          <div className="flex justify-between items-start">

            <div>

              <h2 className="font-semibold text-lg">
                Enterprise Risk Analysis
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                Portfolio-level Monte Carlo
                simulation
              </p>

            </div>

            <span className="text-xs px-3 py-1 rounded-full bg-cyan-950 text-cyan-300">
              API CONNECTED
            </span>

          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">

            <DetailBox
              label="Probability of Annual Loss"
              value={`${(
                summary.probability_of_annual_loss *
                100
              ).toFixed(2)}%`}
            />

            <DetailBox
              label="Maximum Simulated Loss"
              value={formatCurrency(
                summary.maximum_simulated_loss
              )}
            />

            <DetailBox
              label="Assets Modeled"
              value={`${summary.modeled_assets}/${summary.total_assets}`}
            />

            <DetailBox
              label="Simulation Coverage"
              value={`${summary.coverage_percent}%`}
            />

          </div>

          <p className="text-xs text-slate-500 mt-6">
            Results use 10,000 simulated enterprise
            years. Financial values and scenario
            frequencies use synthetic prototype
            assumptions.
          </p>

        </div>

        {/* TOP RISK DRIVERS */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

          <h2 className="font-semibold text-lg">
            Top Risk Drivers
          </h2>

          <p className="text-xs text-slate-500 mt-1 mb-3">
            Ranked by Expected Annual Loss
          </p>

          {riskDrivers.map(
            (asset, index) => (
              <RiskItem
                key={asset.asset_code}
                rank={index + 1}
                name={asset.name}
                value={formatCurrency(
                  asset.expected_annual_loss
                )}
              />
            )
          )}

        </div>

      </div>

    </div>
  );
}


// =============================================
// COMPONENTS
// =============================================

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

      <div className="flex justify-between">

        <p className="text-sm text-slate-400">
          {title}
        </p>

        <Icon
          size={20}
          className="text-cyan-400"
        />

      </div>

      <h2 className="text-3xl font-bold mt-4">
        {value}
      </h2>

      <p className="text-xs text-slate-500 mt-2">
        {subtitle}
      </p>

    </div>
  );
}


function DetailBox({
  label,
  value,
}) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="text-xl font-semibold mt-2">
        {value}
      </p>

    </div>
  );
}


function MonitorBox({
  label,
  value,
  green = false,
}) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p
        className={`text-lg font-semibold mt-2 ${
          green
            ? "text-green-400"
            : "text-white"
        }`}
      >
        {value}
      </p>

    </div>
  );
}


function RiskItem({
  rank,
  name,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-800 py-4">

      <div className="flex items-center gap-3">

        <span className="text-xs text-slate-600">
          #{rank}
        </span>

        <span className="text-sm text-slate-300">
          {name}
        </span>

      </div>

      <span className="text-sm text-red-400 font-medium">
        {value}
      </span>

    </div>
  );
}


export default Dashboard;