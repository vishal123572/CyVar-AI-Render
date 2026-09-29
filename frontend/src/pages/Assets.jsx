import { API_URL } from "../api";
import { useEffect, useState } from "react";
import {
  Search,
  Server,
  Globe,
  ShieldCheck,
  Database,
} from "lucide-react";

function Assets() {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/assets`)
      .then((response) => response.json())
      .then((data) => {
        setAssets(data.assets || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const filteredAssets = assets.filter((asset) => {
    const value = search.toLowerCase();

    return (
      asset.name.toLowerCase().includes(value) ||
      asset.asset_code.toLowerCase().includes(value) ||
      asset.asset_type.toLowerCase().includes(value) ||
      asset.business_unit.toLowerCase().includes(value)
    );
  });

  const internetExposed = assets.filter(
    (asset) => asset.internet_exposed
  ).length;

  const criticalAssets = assets.filter(
    (asset) => asset.criticality >= 4
  ).length;

  if (loading) {
    return (
      <div className="text-slate-400">
        Loading enterprise assets...
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}

      <div className="mb-7">
        <p className="text-sm text-cyan-400">
          ENTERPRISE ASSET INVENTORY
        </p>

        <h1 className="text-3xl font-bold mt-1">
          Assets
        </h1>

        <p className="text-slate-400 mt-2">
          Monitor critical enterprise systems and
          their cyber exposure.
        </p>
      </div>

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-3 gap-5 mb-6">
        <SummaryCard
          title="Total Assets"
          value={assets.length}
          icon={Server}
        />

        <SummaryCard
          title="Critical Assets"
          value={criticalAssets}
          icon={ShieldCheck}
        />

        <SummaryCard
          title="Internet Exposed"
          value={internetExposed}
          icon={Globe}
        />
      </div>

      {/* SEARCH */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-5">
        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3">
          <Search
            size={18}
            className="text-slate-500"
          />

          <input
            type="text"
            placeholder="Search by asset, code, type or business unit..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="bg-transparent outline-none w-full text-sm text-slate-200 placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* ASSET TABLE */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 px-5 py-4 text-xs text-slate-500 border-b border-slate-800">
          <span>ASSET</span>
          <span>CODE</span>
          <span>TYPE</span>
          <span>BUSINESS UNIT</span>
          <span>CRITICALITY</span>
          <span>EXPOSURE</span>
          <span>CLASSIFICATION</span>
        </div>

        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="grid grid-cols-7 items-center px-5 py-5 border-b border-slate-800/70 hover:bg-slate-800/40 transition"
          >
            {/* NAME */}

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-950/50 flex items-center justify-center">
                <Database
                  size={17}
                  className="text-cyan-400"
                />
              </div>

              <div>
                <p className="text-sm font-medium">
                  {asset.name}
                </p>

                <p className="text-xs text-slate-600 mt-1">
                  {asset.environment}
                </p>
              </div>
            </div>

            {/* CODE */}

            <span className="text-xs text-cyan-400">
              {asset.asset_code}
            </span>

            {/* TYPE */}

            <span className="text-sm text-slate-300">
              {asset.asset_type}
            </span>

            {/* BUSINESS */}

            <span className="text-sm text-slate-400">
              {asset.business_unit}
            </span>

            {/* CRITICALITY */}

            <div>
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  asset.criticality >= 5
                    ? "bg-red-950/50 text-red-400 border border-red-900"
                    : asset.criticality >= 4
                    ? "bg-orange-950/50 text-orange-400 border border-orange-900"
                    : "bg-green-950/50 text-green-400 border border-green-900"
                }`}
              >
                {asset.criticality}/5
              </span>
            </div>

            {/* EXPOSURE */}

            <div>
              {asset.internet_exposed ? (
                <span className="text-xs text-red-400">
                  ● Internet
                </span>
              ) : (
                <span className="text-xs text-green-400">
                  ● Internal
                </span>
              )}
            </div>

            {/* CLASSIFICATION */}

            <span className="text-xs text-slate-300">
              {asset.data_classification}
            </span>
          </div>
        ))}

        {filteredAssets.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No assets found.
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="text-3xl font-bold mt-2">
            {value}
          </p>
        </div>

        <div className="w-11 h-11 rounded-lg bg-cyan-950/50 flex items-center justify-center">
          <Icon
            size={21}
            className="text-cyan-400"
          />
        </div>
      </div>
    </div>
  );
}

export default Assets;