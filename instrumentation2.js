/*instrumentation.js*/
const { NodeSDK } = require('@opentelemetry/sdk-node');
//const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
const {
  PeriodicExportingMetricReader,
  //ConsoleMetricExporter,
} = require('@opentelemetry/sdk-metrics');
const { Resource } = require('@opentelemetry/resources');
const {
  SemanticResourceAttributes,
} = require('@opentelemetry/semantic-conventions');
const {
    TraceExporter,
} = require("@google-cloud/opentelemetry-cloud-trace-exporter");


const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'dice-server',
    [SemanticResourceAttributes.SERVICE_VERSION]: '0.1.0',
  }),
//   traceExporter: new ConsoleSpanExporter(),
//   metricReader: new PeriodicExportingMetricReader({
//     exporter: new ConsoleMetricExporter(),
//   }),
traceExporter: new TraceExporter(),
metricReader: new PeriodicExportingMetricReader({
  exporter: new TraceExporter(),
}),
});

sdk.start();
