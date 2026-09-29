import { API_URL } from "../api";
import { useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  Activity,
  Building2,
  Database,
  Server,
  ShieldAlert,
  X,
  IndianRupee,
  BrainCircuit,
} from "lucide-react";

// ======================================================
// CUSTOM NODE
// ======================================================

function RiskNode({ data }) {
  const styles = {
    service: "border-cyan-500 bg-cyan-950/50",
    asset: "border-slate-600 bg-slate-900",
    critical: "border-red-500 bg-red-950/40",
    vulnerability: "border-orange-500 bg-orange-950/40",
  };

  return (
    <div
      className={`min-w-[190px] rounded-xl border-2 px-4 py-3 shadow-xl ${
        styles[data.type] || styles.asset
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-cyan-400"
      />

      <p className="text-[10px] uppercase tracking-wider text-slate-500">
        {data.type}
      </p>

      <p className="text-sm font-semibold text-white mt-1">
        {data.label}
      </p>

      {data.subtitle && (
        <p className="text-xs text-slate-400 mt-1">
          {data.subtitle}
        </p>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-cyan-400"
      />
    </div>
  );
}

const nodeTypes = {
  riskNode: RiskNode,
};

// ======================================================
// DIGITAL TWIN
// ======================================================

function DigitalTwin() {
  const [riskData, setRiskData] = useState(null);
  const [mlData, setMlData] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  // ====================================================
  // FETCH CURRENT CYVAR DATA
  // ====================================================

  useEffect(() => {
    const loadData = async () => {
      try {
        const [riskResponse, mlResponse] =
          await Promise.all([
            fetch(
              `${API_URL}/api/risk/enterprise/summary`
            ),
            fetch(
              `${API_URL}/api/ml/risk-predictions`
            ),
          ]);

        const riskResult = await riskResponse.json();
        const mlResult = await mlResponse.json();

        setRiskData(riskResult);

        setMlData(
          mlResult.predictions || []
        );
      } catch (error) {
        console.error(
          "Digital Twin data error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ====================================================
  // GRAPH NODES
  // ====================================================

  const nodes = useMemo(() => {
    if (!riskData) return [];

    const assets = riskData.assets || [];

    const findAsset = (code) =>
      assets.find(
        (asset) =>
          asset.asset_code === code
      );

    const createAssetNode = (
      code,
      x,
      y
    ) => {
      const asset = findAsset(code);

      return {
        id: code,
        type: "riskNode",
        position: { x, y },

        data: {
          label:
            asset?.name || code,

          subtitle: code,

          type:
            asset?.expected_annual_loss >=
            500000
              ? "critical"
              : "asset",

          asset,
        },
      };
    };

    return [
      // BUSINESS SERVICES

      {
        id: "SERVICE-PAY",
        type: "riskNode",
        position: {
          x: 50,
          y: 20,
        },
        data: {
          label: "Online Payments",
          subtitle: "Business Service",
          type: "service",
        },
      },

      {
        id: "SERVICE-AUTH",
        type: "riskNode",
        position: {
          x: 450,
          y: 20,
        },
        data: {
          label: "Customer Authentication",
          subtitle: "Business Service",
          type: "service",
        },
      },

      {
        id: "SERVICE-MOBILE",
        type: "riskNode",
        position: {
          x: 850,
          y: 20,
        },
        data: {
          label: "Mobile Banking",
          subtitle: "Business Service",
          type: "service",
        },
      },

      // ASSETS

      createAssetNode(
        "PAY-API-001",
        0,
        190
      ),

      createAssetNode(
        "PAY-DB-001",
        220,
        190
      ),

      createAssetNode(
        "IAM-001",
        450,
        190
      ),

      createAssetNode(
        "MOB-API-001",
        700,
        190
      ),

      createAssetNode(
        "CUST-DB-001",
        920,
        190
      ),

      createAssetNode(
        "WEB-001",
        1140,
        190
      ),

      // VULNERABILITIES

      {
        id: "CVE-2021-44228",
        type: "riskNode",
        position: {
          x: 0,
          y: 380,
        },
        data: {
          label: "CVE-2021-44228",
          subtitle: "Log4Shell",
          type: "vulnerability",
        },
      },

      {
        id: "CVE-2024-10979-PAY",
        type: "riskNode",
        position: {
          x: 220,
          y: 380,
        },
        data: {
          label: "CVE-2024-10979",
          subtitle: "Tracked CVE",
          type: "vulnerability",
        },
      },

      {
        id: "CVE-2021-20222",
        type: "riskNode",
        position: {
          x: 450,
          y: 380,
        },
        data: {
          label: "CVE-2021-20222",
          subtitle: "Tracked CVE",
          type: "vulnerability",
        },
      },

      {
        id: "CVE-2022-22965",
        type: "riskNode",
        position: {
          x: 700,
          y: 380,
        },
        data: {
          label: "CVE-2022-22965",
          subtitle: "Spring4Shell",
          type: "vulnerability",
        },
      },

      {
        id: "CVE-2024-10979-CUST",
        type: "riskNode",
        position: {
          x: 920,
          y: 380,
        },
        data: {
          label: "CVE-2024-10979",
          subtitle: "Tracked CVE",
          type: "vulnerability",
        },
      },

      {
        id: "CVE-2021-42013",
        type: "riskNode",
        position: {
          x: 1140,
          y: 380,
        },
        data: {
          label: "CVE-2021-42013",
          subtitle: "Apache HTTP Server",
          type: "vulnerability",
        },
      },
    ];
  }, [riskData]);

  // ====================================================
  // GRAPH CONNECTIONS
  // ====================================================

  const edges = useMemo(
    () => [
      // SERVICE -> ASSET

      {
        id: "pay-api",
        source: "SERVICE-PAY",
        target: "PAY-API-001",
        animated: true,
      },

      {
        id: "pay-db",
        source: "SERVICE-PAY",
        target: "PAY-DB-001",
        animated: true,
      },

      {
        id: "auth-iam",
        source: "SERVICE-AUTH",
        target: "IAM-001",
        animated: true,
      },

      {
        id: "mobile-api",
        source: "SERVICE-MOBILE",
        target: "MOB-API-001",
        animated: true,
      },

      {
        id: "mobile-db",
        source: "SERVICE-MOBILE",
        target: "CUST-DB-001",
        animated: true,
      },

      {
        id: "mobile-web",
        source: "SERVICE-MOBILE",
        target: "WEB-001",
        animated: true,
      },

      // ASSET -> CVE

      {
        id: "api-log4j",
        source: "PAY-API-001",
        target: "CVE-2021-44228",
      },

      {
        id: "paydb-cve",
        source: "PAY-DB-001",
        target: "CVE-2024-10979-PAY",
      },

      {
        id: "iam-cve",
        source: "IAM-001",
        target: "CVE-2021-20222",
      },

      {
        id: "mobile-cve",
        source: "MOB-API-001",
        target: "CVE-2022-22965",
      },

      {
        id: "customer-cve",
        source: "CUST-DB-001",
        target: "CVE-2024-10979-CUST",
      },

      {
        id: "web-cve",
        source: "WEB-001",
        target: "CVE-2021-42013",
      },
    ],
    []
  );

  // ====================================================
  // NODE CLICK
  // ====================================================

  const handleNodeClick = (
    event,
    node
  ) => {
    if (!node.id.includes("-001")) {
      return;
    }

    const financialAsset =
      riskData?.assets?.find(
        (asset) =>
          asset.asset_code === node.id
      );

    const mlAsset = mlData.find(
      (asset) =>
        asset.asset_code === node.id
    );

    setSelectedAsset({
      ...financialAsset,
      ml: mlAsset,
    });
  };

  const money = (value) => {
    if (
      value === null ||
      value === undefined
    )
      return "—";

    if (value >= 10000000)
      return `₹${(
        value / 10000000
      ).toFixed(2)} Cr`;

    if (value >= 100000)
      return `₹${(
        value / 100000
      ).toFixed(2)} L`;

    return `₹${Number(
      value
    ).toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <p className="text-slate-400">
        Building Cyber Risk Digital Twin...
      </p>
    );
  }

  return (
    <div>

      {/* HEADER */}

      <div className="flex justify-between items-start mb-5">

        <div>
          <p className="text-sm text-cyan-400">
            CYBER RISK DIGITAL TWIN
          </p>

          <h1 className="text-3xl font-bold mt-1">
            Enterprise Risk Graph
          </h1>

          <p className="text-slate-400 mt-2">
            Visualize how business services,
            assets and vulnerabilities are
            connected to financial cyber risk.
          </p>
        </div>

        <div className="flex gap-2">

          <Badge
            text="LIVE RISK DATA"
            color="green"
          />

          <Badge
            text="ML CONNECTED"
            color="purple"
          />

        </div>
      </div>

      {/* SUMMARY */}

      <div className="grid grid-cols-4 gap-4 mb-5">

        <Summary
          icon={Building2}
          label="Business Services"
          value="3"
        />

        <Summary
          icon={Server}
          label="Assets"
          value="6"
        />

        <Summary
          icon={ShieldAlert}
          label="Mapped CVEs"
          value="6"
        />

        <Summary
          icon={BrainCircuit}
          label="Risk Intelligence"
          value="XGBoost + Monte Carlo"
        />

      </div>

      {/* GRAPH */}

      <div className="relative h-[600px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">

        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          minZoom={0.4}
          maxZoom={1.5}
        >

          <Background
            gap={22}
            size={1}
          />

          <Controls />

          <MiniMap />

        </ReactFlow>

        {/* DETAIL PANEL */}

        {selectedAsset && (

          <div className="absolute top-4 right-4 z-20 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-5">

            <div className="flex justify-between">

              <div>

                <p className="text-xs text-cyan-400">
                  {selectedAsset.asset_code}
                </p>

                <h3 className="font-semibold mt-1">
                  {selectedAsset.name}
                </h3>

              </div>

              <button
                onClick={() =>
                  setSelectedAsset(null)
                }
              >
                <X
                  size={18}
                  className="text-slate-500"
                />
              </button>

            </div>

            <div className="border-t border-slate-800 mt-4 pt-4 space-y-3">

              <Detail
                label="Mapped CVE"
                value={
                  selectedAsset.cve || "—"
                }
              />

              <Detail
                label="Expected Annual Loss"
                value={money(
                  selectedAsset.expected_annual_loss
                )}
              />

              <Detail
                label="VaR95"
                value={money(
                  selectedAsset.var_95
                )}
              />

              <Detail
                label="ML Risk Class"
                value={
                  selectedAsset.ml
                    ?.ml_risk_class || "—"
                }
              />

              <Detail
                label="ML Confidence"
                value={
                  selectedAsset.ml
                    ?.ml_confidence
                    ? `${selectedAsset.ml.ml_confidence}%`
                    : "—"
                }
              />

              <Detail
                label="CVSS"
                value={
                  selectedAsset.ml
                    ?.cvss_score ?? "—"
                }
              />

              <Detail
                label="EPSS"
                value={
                  selectedAsset.ml
                    ?.epss_score !==
                    undefined
                    ? `${(
                        selectedAsset.ml
                          .epss_score * 100
                      ).toFixed(1)}%`
                    : "—"
                }
              />

              <Detail
                label="CISA KEV"
                value={
                  selectedAsset.ml
                    ?.cisa_kev
                    ? "YES"
                    : "NO"
                }
              />

            </div>

            <div className="mt-5 bg-cyan-950/20 border border-cyan-900/40 rounded-lg p-3">

              <p className="text-xs text-cyan-300">
                Risk relationship
              </p>

              <p className="text-xs text-slate-500 mt-1 leading-5">
                Vulnerability → Asset →
                Business Service → Financial
                Exposure
              </p>

            </div>

          </div>

        )}

      </div>

      {/* LEGEND */}

      <div className="flex gap-6 mt-4 text-xs text-slate-500">

        <Legend
          label="Business Service"
          className="bg-cyan-500"
        />

        <Legend
          label="Enterprise Asset"
          className="bg-slate-500"
        />

        <Legend
          label="High Financial Exposure"
          className="bg-red-500"
        />

        <Legend
          label="Vulnerability"
          className="bg-orange-500"
        />

      </div>

      <p className="text-xs text-slate-600 mt-4">
        Prototype Digital Twin. Enterprise
        relationships are synthetic demo data;
        financial risk is calculated by the CyVar
        risk engine and ML classifications are
        generated by the XGBoost prototype model.
      </p>

    </div>
  );
}

// ======================================================
// SMALL COMPONENTS
// ======================================================

function Summary({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">

      <Icon
        size={18}
        className="text-cyan-400"
      />

      <p className="text-xs text-slate-500 mt-3">
        {label}
      </p>

      <p className="font-semibold mt-1">
        {value}
      </p>

    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between gap-4">

      <span className="text-xs text-slate-500">
        {label}
      </span>

      <span className="text-xs font-medium text-right">
        {value}
      </span>

    </div>
  );
}

function Badge({ text, color }) {
  const style =
    color === "green"
      ? "text-green-300 border-green-900 bg-green-950/30"
      : "text-purple-300 border-purple-900 bg-purple-950/30";

  return (
    <span
      className={`text-xs border px-3 py-1 rounded-full ${style}`}
    >
      {text}
    </span>
  );
}

function Legend({
  label,
  className,
}) {
  return (
    <div className="flex items-center gap-2">

      <span
        className={`w-2.5 h-2.5 rounded-full ${className}`}
      />

      {label}

    </div>
  );
}

export default DigitalTwin;