/*instrumentation.js*/
// Require dependencies
const opentelemetry = require("@opentelemetry/api");
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const {
  TraceExporter,
} = require("@google-cloud/opentelemetry-cloud-trace-exporter");

const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} = require('@opentelemetry/sdk-metrics');

// Enable OpenTelemetry exporters to export traces to Google Cloud Trace.
// Exporters use Application Default Credentials (ADCs) to authenticate.
// See https://developers.google.com/identity/protocols/application-default-credentials
// for more details.
const provider = new NodeTracerProvider();


// Initialize the exporter. When your application is running on Google Cloud,
// you don't need to provide auth credentials or a project id.
const exporter = new TraceExporter();

// Configure the span processor to batch and send spans to the exporter
provider.addSpanProcessor(new BatchSpanProcessor(exporter));

// Initialize the OpenTelemetry APIs to use the
// NodeTracerProvider bindings
provider.register();
const tracer = opentelemetry.trace.getTracer("basic");

// Create a span.
const span = tracer.startSpan("foo");

// Set attributes to the span.
span.setAttribute("key", "value");

// Annotate our span to capture metadata about our operation
span.addEvent("invoking work");

// simulate some random work.
for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {}

// Be sure to end the span.
span.end();
// [END opentelemetry_trace_custom_span]

console.log("Done recording traces.");

// Finally shutdown the NodeTracerProvider to finish flushing any batched spans
provider.shutdown().then(
  () => {
    console.log("Successfully shutdown");
  },
  (err) => {
    console.error("Error shutting down", err);
  }
);


// // register and load instrumentation and old plugins - old plugins will be loaded automatically as previously
// // but instrumentations needs to be added
// registerInstrumentations({
//     instrumentations: [
//       new ExpressInstrumentation(),
//       new HttpInstrumentation({
//           requestHook: (span, request) => {
//             span.setAttribute("custom request hook attribute", "request");
//           },
//       }),
//     ],
//   });

// const sdk = new NodeSDK({
//   traceExporter: new ConsoleSpanExporter(),
//   metricReader: new PeriodicExportingMetricReader({
//     exporter: new ConsoleMetricExporter(),
//   }),
//   instrumentations: [getNodeAutoInstrumentations()],
// });

// sdk.start();
