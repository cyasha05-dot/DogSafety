import Report from "../models/Reports.models.js";

const seedReports = async () => {
  await Report.deleteMany({});
  await Report.insertMany([
    {
      location: "MG Road, Near City Mall",
      severity: "high",
      status: "pending",
      dogCount: "6-10",
      description: "Pack of aggressive dogs blocking pedestrian path",
      contactNumber: "+91 9359843313",
      reportedBy: "yash chaudhari",
    },
    // Add more...
  ]);
};

seedReports();
