/*app.js*/
const express = require('express');
/*instrumentation.js*/
// Require dependencies
const opentelemetry = require("@opentelemetry/api");
//const { NodeSDK } = require('@opentelemetry/sdk-node');
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const {
  TraceExporter,
} = require("@google-cloud/opentelemetry-cloud-trace-exporter");

//const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
// const {
//   getNodeAutoInstrumentations,
// } = require('@opentelemetry/auto-instrumentations-node');
const {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} = require('@opentelemetry/sdk-metrics');



const PORT = parseInt(process.env.PORT || '8081');
const app = express();

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

 function logHttpRequest(
    req,
//    tracer,
    projectId = 'cindy-cloud-sdk-test', // Your Google Cloud Platform project ID
    logName = 'my-log', // The name of the log to write to
    requestMethod = 'GET', // GET, POST, PUT, etc.
    requestUrl = 'http://www.google.com',
    status = 200,
    userAgent = 'my-user-agent/1.0.0',
    latencySeconds = 3,
    responseSize = 256 // response size in bytes.
  ) {



    console.log("request headers", req.header("haha"));
    console.log("request headers traceid", req.header("traceid"));
    console.log("request headers X-Cloud-Trace-Context", req.header("X-Cloud-Trace-Context"));
    // Imports the Google Cloud client library
    const {Logging} = require('@google-cloud/logging');
  
    // Creates a client
    const logging = new Logging({projectId});
  
    // Selects the log to write to
    const log = logging.log(logName);
  
    // The data to write to the log
    const text = 'Hello, Cindy!';


    const metadata = {
        resource: {type: 'global'},
        httpRequest: req,
      };
  
   // entry.metadata.httpRequest = req;
    console.log("request in metadata:",  metadata.httpRequest);

    // Prepares a log entry
    const entry = log.entry(metadata, text);
  
    // Writes the log entry
    async function writeLog() {
      await log.write(entry);
      console.log(`Logged: ${text}`);
    }
    writeLog();
    // [END logging_http_request]
    // [END logging_write_log_entry_advanced]
  }

app.get('/rolldice', (req, res) => {
 // logHttpRequest(req, tracer).catch(console.error);
 logHttpRequest(req);
  res.send(getRandomNumber(1, 6).toString());
  
});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});



// Finally shutdown the NodeTracerProvider to finish flushing any batched spans
// provider.shutdown().then(
//     () => {
//       console.log("Successfully shutdown");
//     },
//     (err) => {
//       console.error("Error shutting down", err);
//     }
//   );
