import { API_URL } from "../api";
import { useEffect, useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Crosshair,
  Bug
} from "lucide-react";

function Vulnerabilities() {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch(`${API_URL}/api/vulnerabilities`)
      .then((response) => response.json())
      .then((data) => {
        setItems(data.vulnerabilities || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });

  }, []);

  if (loading) {
    return (
      <p className="text-slate-400">
        Loading vulnerability intelligence...
      </p>
    );
  }

  const critical = items.filter(
    (item) => item.cvss_score >= 9
  ).length;

  const kev = items.filter(
    (item) => item.cisa_kev
  ).length;

  const highEPSS = items.filter(
    (item) =>
      item.epss_score !== null &&
      item.epss_score >= 0.5
  ).length;

  return (
    <div>

      <div className="mb-7">
        <p className="text-sm text-cyan-400">
          THREAT INTELLIGENCE
        </p>

        <h1 className="text-3xl font-bold mt-1">
          Vulnerabilities
        </h1>

        <p className="text-slate-400 mt-2">
          Asset vulnerabilities enriched with CVSS,
          EPSS and CISA KEV intelligence.
        </p>
      </div>


      <div className="grid grid-cols-4 gap-5 mb-6">

        <Card
          title="Tracked CVEs"
          value={items.length}
          icon={Bug}
        />

        <Card
          title="Critical CVEs"
          value={critical}
          icon={ShieldAlert}
        />

        <Card
          title="Known Exploited"
          value={kev}
          icon={AlertTriangle}
        />

        <Card
          title="High EPSS"
          value={highEPSS}
          icon={Crosshair}
        />

      </div>


      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

        <div className="grid grid-cols-7 px-5 py-4 border-b border-slate-800 text-xs text-slate-500">
          <span>CVE</span>
          <span>ASSET</span>
          <span>CVSS</span>
          <span>SEVERITY</span>
          <span>EPSS</span>
          <span>CISA KEV</span>
          <span>STATUS</span>
        </div>


        {items.map((item) => (

          <div
            key={item.id}
            className="grid grid-cols-7 items-center px-5 py-5 border-b border-slate-800/70 hover:bg-slate-800/40"
          >

            <span className="text-sm text-cyan-400 font-medium">
              {item.cve_id}
            </span>


            <div>
              <p className="text-sm">
                {item.asset_name}
              </p>

              <p className="text-xs text-slate-600 mt-1">
                {item.asset_code}
              </p>
            </div>


            <span
              className={`text-sm font-semibold ${
                item.cvss_score >= 9
                  ? "text-red-400"
                  : item.cvss_score >= 7
                  ? "text-orange-400"
                  : "text-yellow-400"
              }`}
            >
              {item.cvss_score ?? "—"}
            </span>


            <span className="text-xs text-slate-300">
              {item.cvss_severity || "Unknown"}
            </span>


            <span className="text-sm">
              {item.epss_score !== null
                ? `${(item.epss_score * 100).toFixed(2)}%`
                : "Unknown"}
            </span>


            <span>
              {item.cisa_kev ? (
                <span className="text-xs text-red-400">
                  ● Known Exploited
                </span>
              ) : (
                <span className="text-xs text-slate-500">
                  Not Listed
                </span>
              )}
            </span>


            <span className="text-xs px-3 py-1 rounded-full bg-orange-950/40 text-orange-400 w-fit">
              {item.patch_status}
            </span>

          </div>

        ))}

      </div>


      <p className="text-xs text-slate-600 mt-4">
        CVE intelligence is enriched using NVD, FIRST
        EPSS and CISA KEV. Asset mappings belong to the
        synthetic CyVar demo environment.
      </p>

    </div>
  );
}


function Card({ title, value, icon: Icon }) {

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

      <p className="text-3xl font-bold mt-3">
        {value}
      </p>

    </div>
  );
}


export default Vulnerabilities;