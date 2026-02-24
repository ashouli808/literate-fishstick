geotab.addin.rfidEpcViewer = function () {

  return {

    initialize: function (api, state, callback) {

      /*
       * 🔴 CHANGE THIS VALUE
       * Must EXACTLY match the diagnostic name
       * shown under Engine & Maintenance → Measurements
       */
      const EPC_DIAGNOSTIC_NAME = "RFID EPC";

      api.call("Get", {
        typeName: "StatusData",
        search: {
          diagnosticSearch: {
            name: EPC_DIAGNOSTIC_NAME
          },
          fromDate: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        sort: { dateTime: -1 }
      }, function (results) {

        const tableBody = document.getElementById("rfidTable");
        tableBody.innerHTML = "";

        results.forEach(record => {

          // EPC safety: force to string (prevents truncation)
          const epcValue = String(record.data);

          const row = document.createElement("tr");

          row.innerHTML = `
            <td>${record.device ? record.device.name : "Unknown"}</td>
            <td>${epcValue}</td>
            <td>${new Date(record.dateTime).toLocaleString()}</td>
          `;

          tableBody.appendChild(row);
        });

        callback();
      });
    }
  };
};
