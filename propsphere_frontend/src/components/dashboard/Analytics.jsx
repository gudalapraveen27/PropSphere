import { useSelector } from "react-redux";
import { useFilterPropertiesQuery } from "../../services/properties.services";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./Analytics.css";
function Analytics() {
  const user = useSelector((state) => state.uReducer.id);

  const { data, isLoading, isError } = useFilterPropertiesQuery(
      { id: user },
      {
        skip: !user,
        refetchOnMountOrArgChange: true,
      },
    );
  const properties = data?.properties || [];

  const sold = properties.filter(
    (property) => property.status === "Sold",
  ).length;

  const rented = properties.filter(
    (property) => property.status === "Rented",
  ).length;

  const pending = properties.filter(
    (property) => property.status === "Pending",
  ).length;

  const sale = properties.filter(
    (property) => property.listingType === "Sale",
  ).length;

  const rent = properties.filter(
    (property) => property.listingType === "Rent",
  ).length;

  const statusData = [
    { name: "Pending", value: pending, color: "#d99a32" },
    { name: "Sold", value: sold, color: "#398568" },
    { name: "Rented", value: rented, color: "#8066a8" },
  ];

  const listingData = [
    { name: "For Sale", properties: sale },
    { name: "For Rent", properties: rent },
  ];

  if (isLoading) {
    return <div className="analytics-message">Loading analytics...</div>;
  }

  if (isError) {
    return <div className="analytics-message">Unable to load analytics.</div>;
  }

  return (
    <div className="analytics">
      {/* Header */}
      <div className="analytics-heading">
        <div>
          <h2>Analytics</h2>
          <p>Overview of your property listings and performance</p>
        </div>

        <span className="analytics-total">{properties.length} Properties</span>
      </div>

      {/* Summary cards */}
      <div className="analytics-summary">
        <div className="analytics-stat">
          <p>Total Properties</p>
          <h3>{properties.length}</h3>
          <span>All listings</span>
        </div>

        <div className="analytics-stat">
          <p>Sold</p>
          <h3>{sold}</h3>
          <span>Properties sold</span>
        </div>

        <div className="analytics-stat">
          <p>Rented</p>
          <h3>{rented}</h3>
          <span>Properties rented</span>
        </div>

        <div className="analytics-stat">
          <p>Pending</p>
          <h3>{pending}</h3>
          <span>Pending properties</span>
        </div>
      </div>

      {/* Charts */}
      {properties.length === 0 ? (
        <div className="analytics-empty">
          <h3>No properties to analyse</h3>
          <p>
            Your property statistics will appear here after you add listings.
          </p>
        </div>
      ) : (
        <div className="analytics-reports">
          {/* Property status chart */}
          <div className="analytics-report">
            <h3>Property Status</h3>
            <p className="analytics-subtitle">
              Current status of your listings
            </p>

            <div className="analytics-chart">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusData.filter((item) => item.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={2}
                  >
                    {statusData
                      .filter((item) => item.value > 0)
                      .map((item) => (
                        <Cell key={item.name} fill={item.color} />
                      ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="analytics-status-list">
              {statusData.map((item) => (
                <div className="analytics-status-row" key={item.name}>
                  <span>
                    <i style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>

                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Sale and rent chart */}
          <div className="analytics-report">
            <h3>Sale and Rent Listings</h3>
            <p className="analytics-subtitle">
              Number of properties by listing type
            </p>

            <div className="analytics-chart">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={listingData}
                  margin={{
                    top: 15,
                    right: 10,
                    left: -15,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    stroke="#edf0f4"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis dataKey="name" axisLine={false} tickLine={false} />

                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="properties"
                    name="Properties"
                    fill="#3478b9"
                    radius={[3, 3, 0, 0]}
                    barSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="analytics-listing-summary">
              <div>
                <span>For Sale</span>
                <strong>{sale}</strong>
              </div>

              <div>
                <span>For Rent</span>
                <strong>{rent}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
