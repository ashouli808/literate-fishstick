geotab.addin.rfidViewer = function () {
    var apiRef;
    var devices = {};

    var runSearch = function () {
        var status = document.getElementById('status');
        var body = document.getElementById('scanBody');
        var table = document.getElementById('scanTable');
        var devId = document.getElementById('deviceSelect').value;
        var dateVal = document.getElementById('fromDate').value;

        status.innerText = "Searching for bin logs...";
        status.style.display = 'block';
        table.style.display = 'none';

        var searchObj = {
            diagnosticSearch: { id: "DiagnosticTextFromSerialId" },
            resultsLimit: 100
        };

        if (devId) searchObj.deviceSearch = { id: devId };
        if (dateVal) {
            searchObj.fromDate = new Date(dateVal).toISOString();
        }

        apiRef.call("Get", {
            typeName: "StatusData",
            search: searchObj
        }, function (results) {
            status.style.display = 'none';
            table.style.display = 'table';
            body.innerHTML = "";

            if (!results || results.length === 0) {
                status.innerText = "No data found. Ensure the truck is powered and tags are scanning.";
                status.style.display = 'block';
                table.style.display = 'none';
                return;
            }

            for (var i = 0; i < results.length; i++) {
                var scan = results[i];
                var row = body.insertRow();
                
                var timeCell = row.insertCell(0);
                timeCell.innerText = new Date(scan.dateTime).toLocaleString();
                
                var truckCell = row.insertCell(1);
                truckCell.innerText = devices[scan.device.id] || scan.device.id;
                
                var dataCell = row.insertCell(2);
                var span = document.createElement('span');
                span.style.background = "#e8f0fe";
                span.style.padding = "4px";
                span.style.fontFamily = "monospace";
                span.innerText = scan.data;
                dataCell.appendChild(span);
            }
        }, function (err) {
            status.innerText = "API Error: " + err;
        });
    };

    return {
        initialize: function (api, state, callback) {
            apiRef = api;
            var dateInput = document.getElementById('fromDate');
            if (dateInput) dateInput.valueAsDate = new Date();

            api.call("Get", { typeName: "Device" }, function (result) {
                var select = document.getElementById('deviceSelect');
                for (var j = 0; j < result.length; j++) {
                    var d = result[j];
                    devices[d.id] = d.name;
                    var opt = document.createElement('option');
                    opt.value = d.id;
                    opt.innerText = d.name;
                    select.appendChild(opt);
                }
                callback();
            }, function (err) { callback(); });

            document.getElementById('refreshBtn').addEventListener('click', runSearch);
        },
        focus: function (api, state) {
            runSearch();
        },
        blur: function (api, state) {}
    };
};
